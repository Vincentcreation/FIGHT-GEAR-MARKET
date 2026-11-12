export type Category = "gloves" | "shorts" | "hand-wraps";

export type Brand = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  origin: string;
  description: string;
  accent: string;
};

export type Variant = {
  id: string;
  label: string;
  sku: string;
  priceUsd: number;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  brandId: string;
  category: Category;
  name: string;
  summary: string;
  description: string;
  variantKind: "weight" | "size" | "length";
  variants: Variant[];
  color: string;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type SimulatedOrder = {
  id: string;
  createdAt: string;
  brandId: string;
  brandName: string;
  items: Array<{
    productId: string;
    productName: string;
    variantId: string;
    variantLabel: string;
    quantity: number;
    unitPriceUsd: number;
    lineTotalUsd: number;
  }>;
  itemsSubtotalUsd: number;
  shippingUsd: number;
  commissionRate: number;
  commissionUsd: number;
  sellerPayoutUsd: number;
  buyerName: string;
  destination: string;
  status: "simulated";
};

export const CATEGORY_LABELS: Record<Category, string> = {
  gloves: "Gloves",
  shorts: "Shorts",
  "hand-wraps": "Hand wraps",
};

export const COMMISSION_RATES = [0.01, 0.02, 0.05] as const;
export const DEFAULT_COMMISSION_RATE = 0.05;
