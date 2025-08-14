export const categories = [
  "Soins de la Peau",
  "Soins Capillaires",
  "Soins du Corps",
  "Déodorants",
  "Coffrets",
] as const;

export const priceRanges = [
  { label: "150–300 MAD", min: 150, max: 300 },
  { label: "300–500 MAD", min: 300, max: 500 },
  { label: "500–700 MAD", min: 500, max: 700 },
  { label: "700+ MAD", min: 700, max: Infinity },
];

export type SortKey = "best" | "new" | "priceAsc" | "priceDesc";
