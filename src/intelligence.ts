import { listings, marketContext, type Listing } from "./data.js";

export type Resource =
  | "market-summary"
  | "new-listings"
  | "price-reductions"
  | "opportunities";

export const resourceCatalog: Record<
  Resource,
  { label: string; description: string }
> = {
  "market-summary": {
    label: "Market summary",
    description: "Whitefield pricing, supply, and opportunity signals.",
  },
  "new-listings": {
    label: "New listings",
    description: "Properties added to the market most recently.",
  },
  "price-reductions": {
    label: "Price reductions",
    description: "Listings whose asking price has recently fallen.",
  },
  opportunities: {
    label: "Potential opportunities",
    description: "Listings priced below the sample market median.",
  },
};

export function chooseResource(query: string): Resource {
  const normalized = query.toLowerCase();
  if (/(reduc|discount|price drop|cheaper)/.test(normalized)) {
    return "price-reductions";
  }
  if (/(new|latest|recent|added)/.test(normalized)) {
    return "new-listings";
  }
  if (/(opportun|underpriced|value|deal|invest)/.test(normalized)) {
    return "opportunities";
  }
  return "market-summary";
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[midpoint]
    : (sorted[midpoint - 1] + sorted[midpoint]) / 2;
}

function reductionPercent(listing: Listing): number {
  if (!listing.previousPriceUsd) return 0;
  return Number(
    (
      ((listing.previousPriceUsd - listing.priceUsd) /
        listing.previousPriceUsd) *
      100
    ).toFixed(1),
  );
}

export function getResource(resource: Resource) {
  const medianPricePerSqFt = median(listings.map((item) => item.pricePerSqFt));

  if (resource === "new-listings") {
    return {
      ...marketContext,
      resource,
      count: listings.filter((item) => item.signal === "new").length,
      listings: listings.filter((item) => item.signal === "new"),
    };
  }

  if (resource === "price-reductions") {
    const reduced = listings
      .filter((item) => item.previousPriceUsd)
      .map((item) => ({ ...item, reductionPercent: reductionPercent(item) }))
      .sort((a, b) => b.reductionPercent - a.reductionPercent);
    return { ...marketContext, resource, count: reduced.length, listings: reduced };
  }

  if (resource === "opportunities") {
    const opportunities = listings
      .filter((item) => item.pricePerSqFt < medianPricePerSqFt)
      .map((item) => ({
        ...item,
        discountToMedianPercent: Number(
          (
            ((medianPricePerSqFt - item.pricePerSqFt) /
              medianPricePerSqFt) *
            100
          ).toFixed(1),
        ),
      }))
      .sort((a, b) => b.discountToMedianPercent - a.discountToMedianPercent);
    return {
      ...marketContext,
      resource,
      medianPricePerSqFt,
      count: opportunities.length,
      listings: opportunities,
    };
  }

  return {
    ...marketContext,
    resource,
    listingCount: listings.length,
    medianPricePerSqFt,
    averagePriceUsd: Math.round(
      listings.reduce((sum, item) => sum + item.priceUsd, 0) / listings.length,
    ),
    newListingCount: listings.filter((item) => item.signal === "new").length,
    reducedListingCount: listings.filter((item) => item.previousPriceUsd).length,
    opportunityCount: listings.filter(
      (item) => item.pricePerSqFt < medianPricePerSqFt,
    ).length,
  };
}

export function buildInsights(resource: Resource, payload: ReturnType<typeof getResource>) {
  if (
    resource === "market-summary" &&
    "medianPricePerSqFt" in payload &&
    "reducedListingCount" in payload &&
    "opportunityCount" in payload
  ) {
    return [
      `The sample median is $${payload.medianPricePerSqFt.toLocaleString("en-US")} per sq ft.`,
      `${payload.reducedListingCount} listings show a recent price reduction.`,
      `${payload.opportunityCount} listings are below the sample median price per sq ft.`,
    ];
  }

  const resultListings =
    "listings" in payload ? (payload.listings as Array<Listing & Record<string, number>>) : [];
  if (!resultListings.length) return ["No matching listings were found."];

  const top = resultListings[0];
  return [
    `${resultListings.length} matching properties were unlocked.`,
    `${top.project} is the strongest first review candidate.`,
    "This is a curated demonstration dataset; verify details before acting.",
  ];
}
