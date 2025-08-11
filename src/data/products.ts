import type { Product, Variant } from "@/types/models";

export const categories = [
  "Skin Care",
  "Hair Care",
  "Body Care",
  "Deodorants",
  "Sets",
] as const;

export const priceRanges = [
  { label: "$15–$30", min: 15, max: 30 },
  { label: "$30–$50", min: 30, max: 50 },
  { label: "$50–$70", min: 50, max: 70 },
  { label: "$70+", min: 70, max: Infinity },
];

export type SortKey = "best" | "new" | "priceAsc" | "priceDesc";

// --- Variants ---
const bodyWashSize: Variant = { id: "size", name: "Size", options: ["250ml", "500ml"] };
const bodyWashScent: Variant = { id: "scent", name: "Scent", options: ["Argan", "Orange Blossom", "Unscented"] };
const skinType: Variant = { id: "skin-type", name: "Skin Type", options: ["Normal", "Dry", "Sensitive"] };

const shampooHairType: Variant = { id: "hair-type", name: "Hair Type", options: ["Normal", "Dry", "Oily", "Curly/Coily"] };
const shampooConcern: Variant = { id: "concern", name: "Concern", options: ["Dandruff", "Frizz", "Breakage"] };
const shampooSize: Variant = { id: "size", name: "Size", options: ["250ml", "500ml"] };
const shampooScent: Variant = { id: "scent", name: "Scent", options: ["Argan", "Herbal"] };

export const products: Product[] = [
  // --- Body Care ---
  {
    id: "p11",
    slug: "hydrating-body-wash",
    name: "Hydrating Body Wash",
    price: 24,
    currency: "USD",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    inStock: true,
    tags: ["body care", "vegan"],
    volume: "250ml",
    variants: [bodyWashSize, bodyWashScent, skinType],
    rating: { value: 4.9, count: 128 },
    badges: ["In Stock", "Vegan", "Dermatologically Tested"],
    benefits: [
      { text: "Cleans without stripping." },
      { text: "Supports skin barrier with plant oils." },
      { text: "SLS/SLES-free." },
    ],
    proof: {
      type: "stats",
      items: [{ label: "92%", value: "reported softer skin after 7 days" }],
    },
    ingredients: {
      key: [
        { name: "Argan Oil", description: "emollient support." },
        { name: "Aloe Vera", description: "immediate comfort." },
        { name: "Glycerin", description: "humectant." },
      ],
      inci: "Aqua, Sodium Cocoyl Isethionate, Glycerin, Decyl Glucoside, Lauryl Glucoside, Argania Spinosa Kernel Oil, Aloe Barbadensis Leaf Juice, etc.",
      allergens: "Fragrance-free. Contains nut oil.",
    },
    howToUse: {
      steps: [
        "Apply 2–3 pumps to wet skin.",
        "Massage and rinse.",
        "For dryness, follow with Nourish Body Lotion.",
      ],
      compatibleRoutine: { text: "Nourish Body Lotion", to: "/product/nourishing-body-lotion" },
    },
    routineBuilder: {
      title: "Complete Body Routine",
      items: ["p11", "p3", "p7"], // IDs for Body Wash, Body Lotion, Deodorant
      bundlePrice: 65,
    },
    reviews: {
      items: [
        { id: "r1", author: "Amina K.", rating: 5, text: "My skin has never felt better. So soft!", photo: "/placeholder.svg" },
        { id: "r2", author: "Youssef B.", rating: 5, text: "The unscented version is perfect for my sensitive skin." },
      ],
      filters: ["With Photos", "5 Stars", "Recent"],
      sortOptions: ["Most Relevant", "Most Recent"],
    },
    qna: {
      items: [
        { id: "q1", question: "Is this safe for eczema?", answer: "Many users with eczema find it gentle, but we recommend a patch test first." },
      ],
    },
    policies: {
      delivery: "COD. Delivery 48–72h nationwide.",
      returns: "Unopened items returnable within 7 days.",
      securePaymentNote: "Pay securely upon delivery.",
      satisfactionNote: "Your satisfaction is our priority.",
      faqs: [
        { q: "How does COD work?", a: "You pay the courier in cash when your order arrives." },
        { q: "What if I miss the delivery?", a: "The courier will attempt redelivery up to 2 times." },
      ],
    },
    description: "A gentle, hydrating body wash designed to cleanse without stripping the skin's natural moisture barrier. Formulated with nourishing plant oils and free from harsh sulfates.",
  },
  // --- Hair Care ---
  {
    id: "p12",
    slug: "argan-repair-shampoo",
    name: "Argan Repair Shampoo",
    price: 28,
    currency: "USD",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    inStock: true,
    tags: ["hair care", "sulfate-free"],
    volume: "250ml",
    variants: [shampooHairType, shampooConcern, shampooSize, shampooScent],
    rating: { value: 4.8, count: 98 },
    badges: ["In Stock", "Sulfate-Free", "Reduces Breakage"],
    benefits: [
      { text: "Gentle cleanse; silicone-free." },
      { text: "Reduces breakage vs. baseline after 4 weeks." },
      { text: "For Dry/Frizzy hair types." },
    ],
    proof: {
      type: "stats",
      items: [{ label: "−35%", value: "combing breakage" }],
    },
    ingredients: {
      key: [
        { name: "Argan Oil", description: "lipid support." },
        { name: "Panthenol (Pro-Vit B5)", description: "strength/shine." },
        { name: "Mild surfactant system", description: "sulfate-free." },
      ],
      inci: "Aqua, Decyl Glucoside, Cocamidopropyl Betaine, Argania Spinosa Kernel Oil, Panthenol, Hydrolyzed Wheat Protein, etc.",
      allergens: "Silicone-free, Paraben-free.",
    },
    howToUse: {
      steps: [
        "Wet hair, apply small amount, massage scalp 60–90s.",
        "Rinse; repeat if needed.",
        "Follow with Repair Conditioner. Use Hair Serum on lengths.",
      ],
      compatibleRoutine: { text: "Repair Conditioner", to: "/product/silk-conditioner" },
    },
    routineBuilder: {
      title: "Anti-Frizz Repair Set",
      items: ["p12", "p6", "p1"], // IDs for Shampoo, Conditioner, Serum
      bundlePrice: 85,
    },
    reviews: {
      items: [
        { id: "r3", author: "Fatima Z.", rating: 5, text: "Finally, a shampoo that tames my frizz without weighing it down!", tags: ["Curly"] },
        { id: "r4", author: "Adam L.", rating: 4, text: "Good results on my dry hair, but the herbal scent is a bit strong for me." },
      ],
      filters: ["With Photos", "Curly", "Oily"],
      sortOptions: ["Most Relevant", "Most Recent"],
    },
    qna: {
      items: [
        { id: "q2", question: "Is this color-safe?", answer: "Yes, our sulfate-free formula is gentle on color-treated hair." },
      ],
    },
    policies: {
      delivery: "COD. Delivery 48–72h nationwide.",
      returns: "Unopened items returnable within 7 days.",
      securePaymentNote: "Pay securely upon delivery.",
      satisfactionNote: "Your satisfaction is our priority.",
      faqs: [
        { q: "How does COD work?", a: "You pay the courier in cash when your order arrives." },
        { q: "What if I miss the delivery?", a: "The courier will attempt redelivery up to 2 times." },
      ],
    },
    description: "A repairing shampoo formulated to gently cleanse while reducing breakage and frizz. Enriched with Argan Oil and Pro-Vitamin B5 for stronger, shinier hair.",
  },
  // --- Existing Products (for compatibility) ---
  {
    id: "p1",
    slug: "hydrating-face-serum",
    name: "Hydrating Face Serum",
    subtitle: "Hyaluronic Boost",
    price: 39,
    currency: "USD",
    images: ["/placeholder.svg"],
    variants: [{ id: "size", name: "Size", options: ["30ml", "50ml", "100ml"] }],
    description: "Deeply hydrating serum for daily glow.",
    specs: ["Dermatologist-tested", "Clean ingredients"],
    tags: ["vegan", "fragrance-free"],
    volume: "30ml",
    inStock: true,
  },
  {
    id: "p2",
    slug: "gentle-cream-cleanser",
    name: "Gentle Cream Cleanser",
    price: 22,
    currency: "USD",
    images: ["/placeholder.svg"],
    description: "Creamy cleanser for soft skin.",
    tags: ["skin care"],
    volume: "150ml",
    inStock: true,
  },
  {
    id: "p3",
    slug: "nourishing-body-butter",
    name: "Nourishing Body Butter",
    price: 28,
    currency: "USD",
    images: ["/placeholder.svg"],
    variants: [{ id: "scent", name: "Scent", options: ["Unscented", "Citrus", "Lavender"] }],
    description: "Rich butter for deeply nourished skin.",
    tags: ["body care"],
    volume: "200ml",
    inStock: true,
  },
  {
    id: "p4",
    slug: "balancing-toner",
    name: "Balancing Toner",
    price: 19,
    currency: "USD",
    images: ["/placeholder.svg"],
    description: "Refresh and balance pH.",
    tags: ["skin care"],
    volume: "120ml",
    inStock: true,
  },
  {
    id: "p5",
    slug: "revive-shampoo",
    name: "Revive Shampoo",
    price: 24,
    currency: "USD",
    images: ["/placeholder.svg"],
    description: "Gentle cleanse, daily shine.",
    tags: ["hair care"],
    volume: "250ml",
    inStock: true,
  },
  {
    id: "p6",
    slug: "silk-conditioner",
    name: "Silk Conditioner",
    price: 26,
    currency: "USD",
    images: ["/placeholder.svg"],
    description: "Soft, detangled hair.",
    tags: ["hair care"],
    volume: "250ml",
    inStock: true,
  },
  {
    id: "p7",
    slug: "natural-deodorant",
    name: "Natural Deodorant",
    price: 18,
    currency: "USD",
    images: ["/placeholder.svg"],
    variants: [{ id: "scent", name: "Scent", options: ["Unscented", "Citrus", "Lavender"] }],
    description: "Clean protection all day.",
    tags: ["deodorants"],
    volume: "75g",
    inStock: true,
  },
  {
    id: "p8",
    slug: "glow-essentials-set",
    name: "Glow Essentials Set",
    price: 72,
    currency: "USD",
    images: ["/placeholder.svg"],
    description: "Curated daily routine set.",
    tags: ["sets"],
    inStock: true,
  },
  {
    id: "p9",
    slug: "soothing-face-cream",
    name: "Soothing Face Cream",
    price: 34,
    currency: "USD",
    images: ["/placeholder.svg"],
    description: "Comfort for sensitive skin.",
    tags: ["skin care", "vegan"],
    volume: "50ml",
    inStock: true,
  },
  {
    id: "p10",
    slug: "clarifying-clay-mask",
    name: "Clarifying Clay Mask",
    price: 29,
    currency: "USD",
    images: ["/placeholder.svg"],
    description: "Purify and refine pores.",
    tags: ["skin care"],
    volume: "100ml",
    inStock: true,
  },
];
