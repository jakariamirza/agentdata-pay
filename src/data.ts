export type Listing = {
  id: string;
  project: string;
  locality: string;
  propertyType: "Apartment" | "Villa";
  bedrooms: number;
  areaSqFt: number;
  priceInr: number;
  previousPriceInr?: number;
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
    priceInr: 15_500_000,
    listedAt: "2026-07-25",
    pricePerSqFt: 12_500,
    signal: "new",
  },
  {
    id: "WFD-102",
    project: "Prestige Lakeside Habitat",
    locality: "Whitefield",
    propertyType: "Apartment",
    bedrooms: 3,
    areaSqFt: 1650,
    priceInr: 20_600_000,
    previousPriceInr: 22_000_000,
    listedAt: "2026-07-08",
    pricePerSqFt: 12_485,
    signal: "reduced",
  },
  {
    id: "WFD-103",
    project: "Sobha Dream Acres",
    locality: "Panathur",
    propertyType: "Apartment",
    bedrooms: 2,
    areaSqFt: 1210,
    priceInr: 13_700_000,
    previousPriceInr: 14_800_000,
    listedAt: "2026-07-11",
    pricePerSqFt: 11_322,
    signal: "value",
  },
  {
    id: "WFD-104",
    project: "Total Environment Pursuit of a Radical Rhapsody",
    locality: "ITPL Main Road",
    propertyType: "Apartment",
    bedrooms: 3,
    areaSqFt: 2750,
    priceInr: 46_500_000,
    listedAt: "2026-07-23",
    pricePerSqFt: 16_909,
    signal: "new",
  },
  {
    id: "WFD-105",
    project: "Assetz Marq",
    locality: "Kannamangala",
    propertyType: "Apartment",
    bedrooms: 3,
    areaSqFt: 1620,
    priceInr: 18_200_000,
    previousPriceInr: 19_000_000,
    listedAt: "2026-07-15",
    pricePerSqFt: 11_235,
    signal: "reduced",
  },
  {
    id: "WFD-106",
    project: "Adarsh Palm Meadows",
    locality: "Ramagondanahalli",
    propertyType: "Villa",
    bedrooms: 4,
    areaSqFt: 3500,
    priceInr: 65_000_000,
    listedAt: "2026-06-30",
    pricePerSqFt: 18_571,
    signal: "standard",
  },
];

export const marketContext = {
  locality: "Whitefield, Bengaluru",
  currency: "INR",
  generatedAt: "2026-07-27T06:30:00.000Z",
  source: "Curated hackathon demonstration dataset",
  disclaimer:
    "Demonstration data only. Verify listings and prices before making a property decision.",
};
