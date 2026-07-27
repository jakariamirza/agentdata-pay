export type Listing = {
  id: string;
  project: string;
  locality: string;
  propertyType: "Apartment" | "Villa";
  bedrooms: number;
  areaSqFt: number;
  priceUsd: number;
  previousPriceUsd?: number;
  listedAt: string;
  pricePerSqFt: number;
  signal: "new" | "reduced" | "value" | "standard";
};

export const listings: Listing[] = [
  {
    id: "WFD-101",
    project: "Brigade Cornerstone Utopia",
    locality: "Varthur Road",
    propertyType: "Apartment",
    bedrooms: 2,
    areaSqFt: 1240,
    priceUsd: 186_747,
    listedAt: "2026-07-25",
    pricePerSqFt: 151,
    signal: "new",
  },
  {
    id: "WFD-102",
    project: "Prestige Lakeside Habitat",
    locality: "Whitefield",
    propertyType: "Apartment",
    bedrooms: 3,
    areaSqFt: 1650,
    priceUsd: 248_193,
    previousPriceUsd: 265_060,
    listedAt: "2026-07-08",
    pricePerSqFt: 150,
    signal: "reduced",
  },
  {
    id: "WFD-103",
    project: "Sobha Dream Acres",
    locality: "Panathur",
    propertyType: "Apartment",
    bedrooms: 2,
    areaSqFt: 1210,
    priceUsd: 165_060,
    previousPriceUsd: 178_313,
    listedAt: "2026-07-11",
    pricePerSqFt: 136,
    signal: "value",
  },
  {
    id: "WFD-104",
    project: "Total Environment Pursuit of a Radical Rhapsody",
    locality: "ITPL Main Road",
    propertyType: "Apartment",
    bedrooms: 3,
    areaSqFt: 2750,
    priceUsd: 560_241,
    listedAt: "2026-07-23",
    pricePerSqFt: 204,
    signal: "new",
  },
  {
    id: "WFD-105",
    project: "Assetz Marq",
    locality: "Kannamangala",
    propertyType: "Apartment",
    bedrooms: 3,
    areaSqFt: 1620,
    priceUsd: 219_277,
    previousPriceUsd: 228_916,
    listedAt: "2026-07-15",
    pricePerSqFt: 135,
    signal: "reduced",
  },
  {
    id: "WFD-106",
    project: "Adarsh Palm Meadows",
    locality: "Ramagondanahalli",
    propertyType: "Villa",
    bedrooms: 4,
    areaSqFt: 3500,
    priceUsd: 783_133,
    listedAt: "2026-06-30",
    pricePerSqFt: 224,
    signal: "standard",
  },
];

export const marketContext = {
  locality: "Whitefield, Bengaluru",
  currency: "USD",
  pricingNote: "Curated demonstration prices expressed in USD.",
  generatedAt: "2026-07-27T06:30:00.000Z",
  source: "Curated hackathon demonstration dataset",
  disclaimer:
    "Demonstration data only. Verify listings and prices before making a property decision.",
};
