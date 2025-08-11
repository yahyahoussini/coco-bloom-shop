export type Variant = { id: string; name: string; options: string[] };

// Extended product model based on high-converting spec
export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  oldPrice?: number;
  currency: "USD";
  images: string[]; // placeholder URLs

  // Core details
  rating?: { value: number; count: number };
  badges?: string[];
  variants?: Variant[]; // e.g., Size, Scent, Hair Type
  volume?: string;
  inStock: boolean;

  // Persuasion blocks
  benefits?: { icon?: string; text: string }[];
  proof?: {
    type: 'slider' | 'stats';
    items: { label: string; value: string }[] | { before: string; after: string };
  };

  // Information sections
  ingredients?: {
    key: { name: string; description: string }[];
    inci: string;
    allergens: string;
  };
  howToUse?: {
    steps: string[];
    compatibleRoutine?: { text: string; to: string };
  };

  // Cross-sell
  routineBuilder?: {
    title: string;
    items: string[]; // product IDs
    bundlePrice: number;
  };

  // Social proof
  reviews?: {
    items: {
      id: string;
      author: string;
      photo?: string;
      rating: number;
      text: string;
      tags?: string[];
    }[];
    filters: string[];
    sortOptions: string[];
  };
  qna?: {
    items: { id: string; question: string; answer: string }[];
  };

  // Trust & policies
  policies?: {
    delivery: string;
    returns: string;
    securePaymentNote: string;
    satisfactionNote: string;
    faqs: { q: string; a: string }[];
  };

  // For filtering/categorization
  tags: string[];

  // Not in spec, but useful for existing structure
  description: string;
  specs?: string[];
};

export type CartItem = { productId: string; variantSelections?: Record<string, string>; qty: number; unitPrice: number };
export type Order = { id: string; code: string; phone: string; status: "received"|"packed"|"shipped"|"out_for_delivery"|"delivered"; items: CartItem[]; totals: { subtotal: number; shipping: number; tax: number; total: number } };
