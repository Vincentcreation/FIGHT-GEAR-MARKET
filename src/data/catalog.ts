import type { Brand, Product } from "@/lib/types";

export const brands: Brand[] = [
  {
    id: "brand-nak-muay-forge",
    slug: "nak-muay-forge",
    name: "Nak Muay Forge",
    tagline: "Forged for the ring in Bangkok",
    origin: "Bangkok, Thailand",
    description:
      "A fictional workshop brand building dense padding gloves and traditional fight shorts for daily pad work.",
    accent: "#B42318",
  },
  {
    id: "brand-siam-strike",
    slug: "siam-strike",
    name: "Siam Strike Co.",
    tagline: "Modern Muay Thai kit, clean lines",
    origin: "Chiang Mai, Thailand",
    description:
      "A fictional athletic label focused on lighter training gloves, competition shorts, and durable wraps.",
    accent: "#0F6E56",
  },
  {
    id: "brand-rama-ringwear",
    slug: "rama-ringwear",
    name: "Rama Ringwear",
    tagline: "Camp-tested gear from the South",
    origin: "Phuket, Thailand",
    description:
      "A fictional camp supplier known for breathable shorts and wraps that stay tight through long sparring rounds.",
    accent: "#1849A9",
  },
];

export const products: Product[] = [
  {
    id: "p-nmf-classic-gloves",
    slug: "nak-muay-forge-classic-gloves",
    brandId: "brand-nak-muay-forge",
    category: "gloves",
    name: "Forge Classic Gloves",
    summary: "Dense foam gloves for heavy bag and pad rounds.",
    description:
      "Demo product. Multi-layer foam with a snug wrist wrap. Choose glove weight for training intensity.",
    variantKind: "weight",
    color: "#8B1A12",
    variants: [
      { id: "v-nmf-g-10", label: "10 oz", sku: "NMF-G-10", priceUsd: 78, stock: 14 },
      { id: "v-nmf-g-12", label: "12 oz", sku: "NMF-G-12", priceUsd: 82, stock: 22 },
      { id: "v-nmf-g-14", label: "14 oz", sku: "NMF-G-14", priceUsd: 86, stock: 18 },
      { id: "v-nmf-g-16", label: "16 oz", sku: "NMF-G-16", priceUsd: 90, stock: 11 },
    ],
  },
  {
    id: "p-nmf-spar-gloves",
    slug: "nak-muay-forge-sparring-gloves",
    brandId: "brand-nak-muay-forge",
    category: "gloves",
    name: "Forge Sparring Gloves",
    summary: "Softer outer layer made for partner sparring.",
    description:
      "Demo product. Extra knuckle cushioning with a longer cuff for wrist support during sparring.",
    variantKind: "weight",
    color: "#5C0F0A",
    variants: [
      { id: "v-nmf-s-14", label: "14 oz", sku: "NMF-S-14", priceUsd: 94, stock: 9 },
      { id: "v-nmf-s-16", label: "16 oz", sku: "NMF-S-16", priceUsd: 98, stock: 16 },
      { id: "v-nmf-s-18", label: "18 oz", sku: "NMF-S-18", priceUsd: 102, stock: 7 },
    ],
  },
  {
    id: "p-nmf-heritage-shorts",
    slug: "nak-muay-forge-heritage-shorts",
    brandId: "brand-nak-muay-forge",
    category: "shorts",
    name: "Heritage Fight Shorts",
    summary: "Traditional cut with reinforced side slits.",
    description:
      "Demo product. Satin-feel shell, wide waistband, and classic Muay Thai proportions.",
    variantKind: "size",
    color: "#C2410C",
    variants: [
      { id: "v-nmf-hs-s", label: "S", sku: "NMF-HS-S", priceUsd: 48, stock: 12 },
      { id: "v-nmf-hs-m", label: "M", sku: "NMF-HS-M", priceUsd: 48, stock: 20 },
      { id: "v-nmf-hs-l", label: "L", sku: "NMF-HS-L", priceUsd: 48, stock: 15 },
      { id: "v-nmf-hs-xl", label: "XL", sku: "NMF-HS-XL", priceUsd: 50, stock: 8 },
    ],
  },
  {
    id: "p-nmf-cotton-wraps",
    slug: "nak-muay-forge-cotton-wraps",
    brandId: "brand-nak-muay-forge",
    category: "hand-wraps",
    name: "Forge Cotton Wraps",
    summary: "Breathable cotton wraps with a secure thumb loop.",
    description:
      "Demo product. Soft cotton blend that stays flexible through sweating rounds.",
    variantKind: "length",
    color: "#E7E5E4",
    variants: [
      { id: "v-nmf-w-3", label: "3 m", sku: "NMF-W-3", priceUsd: 12, stock: 40 },
      { id: "v-nmf-w-45", label: "4.5 m", sku: "NMF-W-45", priceUsd: 14, stock: 55 },
      { id: "v-nmf-w-5", label: "5 m", sku: "NMF-W-5", priceUsd: 16, stock: 33 },
    ],
  },
  {
    id: "p-ss-velocity-gloves",
    slug: "siam-strike-velocity-gloves",
    brandId: "brand-siam-strike",
    category: "gloves",
    name: "Velocity Training Gloves",
    summary: "Lighter profile gloves for technical pad work.",
    description:
      "Demo product. Slimmer silhouette with responsive foam for speed drills and mitt sessions.",
    variantKind: "weight",
    color: "#0F766E",
    variants: [
      { id: "v-ss-v-10", label: "10 oz", sku: "SS-V-10", priceUsd: 84, stock: 13 },
      { id: "v-ss-v-12", label: "12 oz", sku: "SS-V-12", priceUsd: 88, stock: 19 },
      { id: "v-ss-v-14", label: "14 oz", sku: "SS-V-14", priceUsd: 92, stock: 10 },
      { id: "v-ss-v-16", label: "16 oz", sku: "SS-V-16", priceUsd: 96, stock: 8 },
    ],
  },
  {
    id: "p-ss-pro-gloves",
    slug: "siam-strike-pro-competition-gloves",
    brandId: "brand-siam-strike",
    category: "gloves",
    name: "Pro Competition Gloves",
    summary: "Compact competition-style gloves for demo catalog use.",
    description:
      "Demo product. Compact head shape and firm wrist strap intended for competition cut.",
    variantKind: "weight",
    color: "#134E4A",
    variants: [
      { id: "v-ss-p-8", label: "8 oz", sku: "SS-P-8", priceUsd: 110, stock: 6 },
      { id: "v-ss-p-10", label: "10 oz", sku: "SS-P-10", priceUsd: 114, stock: 9 },
      { id: "v-ss-p-12", label: "12 oz", sku: "SS-P-12", priceUsd: 118, stock: 7 },
    ],
  },
  {
    id: "p-ss-cut-shorts",
    slug: "siam-strike-cut-shorts",
    brandId: "brand-siam-strike",
    category: "shorts",
    name: "Strike Cut Shorts",
    summary: "Modern tapered fight shorts with stretch panels.",
    description:
      "Demo product. Lightweight shell with side stretch inserts for kicks and clinch work.",
    variantKind: "size",
    color: "#115E59",
    variants: [
      { id: "v-ss-cs-s", label: "S", sku: "SS-CS-S", priceUsd: 54, stock: 14 },
      { id: "v-ss-cs-m", label: "M", sku: "SS-CS-M", priceUsd: 54, stock: 21 },
      { id: "v-ss-cs-l", label: "L", sku: "SS-CS-L", priceUsd: 54, stock: 17 },
      { id: "v-ss-cs-xl", label: "XL", sku: "SS-CS-XL", priceUsd: 56, stock: 9 },
    ],
  },
  {
    id: "p-ss-mesh-wraps",
    slug: "siam-strike-mesh-wraps",
    brandId: "brand-siam-strike",
    category: "hand-wraps",
    name: "Mesh Cool Wraps",
    summary: "Semi-elastic wraps with a ventilated weave.",
    description:
      "Demo product. Quick-dry mesh feel with a wide hook-and-loop closure.",
    variantKind: "length",
    color: "#99F6E4",
    variants: [
      { id: "v-ss-w-3", label: "3 m", sku: "SS-W-3", priceUsd: 15, stock: 28 },
      { id: "v-ss-w-45", label: "4.5 m", sku: "SS-W-45", priceUsd: 17, stock: 36 },
      { id: "v-ss-w-5", label: "5 m", sku: "SS-W-5", priceUsd: 19, stock: 24 },
    ],
  },
  {
    id: "p-rr-camp-gloves",
    slug: "rama-ringwear-camp-gloves",
    brandId: "brand-rama-ringwear",
    category: "gloves",
    name: "Camp Daily Gloves",
    summary: "Durable all-day training gloves for camp schedules.",
    description:
      "Demo product. Built for high-volume bag work with a reinforced palm and wrist.",
    variantKind: "weight",
    color: "#1D4ED8",
    variants: [
      { id: "v-rr-c-12", label: "12 oz", sku: "RR-C-12", priceUsd: 80, stock: 15 },
      { id: "v-rr-c-14", label: "14 oz", sku: "RR-C-14", priceUsd: 84, stock: 18 },
      { id: "v-rr-c-16", label: "16 oz", sku: "RR-C-16", priceUsd: 88, stock: 12 },
    ],
  },
  {
    id: "p-rr-wave-shorts",
    slug: "rama-ringwear-wave-shorts",
    brandId: "brand-rama-ringwear",
    category: "shorts",
    name: "Wave Camp Shorts",
    summary: "Breathable shorts cut for hot gym sessions.",
    description:
      "Demo product. Airy fabric, roomy thighs, and a drawcord waist for long training days.",
    variantKind: "size",
    color: "#1E3A8A",
    variants: [
      { id: "v-rr-ws-s", label: "S", sku: "RR-WS-S", priceUsd: 46, stock: 11 },
      { id: "v-rr-ws-m", label: "M", sku: "RR-WS-M", priceUsd: 46, stock: 19 },
      { id: "v-rr-ws-l", label: "L", sku: "RR-WS-L", priceUsd: 46, stock: 16 },
      { id: "v-rr-ws-xl", label: "XL", sku: "RR-WS-XL", priceUsd: 48, stock: 10 },
    ],
  },
  {
    id: "p-rr-pro-shorts",
    slug: "rama-ringwear-pro-shorts",
    brandId: "brand-rama-ringwear",
    category: "shorts",
    name: "Pro Ring Shorts",
    summary: "Higher-rise fight shorts with bold stripe panels.",
    description:
      "Demo product. Structured waist and deep slits designed for ring movement.",
    variantKind: "size",
    color: "#172554",
    variants: [
      { id: "v-rr-ps-s", label: "S", sku: "RR-PS-S", priceUsd: 58, stock: 8 },
      { id: "v-rr-ps-m", label: "M", sku: "RR-PS-M", priceUsd: 58, stock: 13 },
      { id: "v-rr-ps-l", label: "L", sku: "RR-PS-L", priceUsd: 58, stock: 11 },
      { id: "v-rr-ps-xl", label: "XL", sku: "RR-PS-XL", priceUsd: 60, stock: 6 },
    ],
  },
  {
    id: "p-rr-grip-wraps",
    slug: "rama-ringwear-grip-wraps",
    brandId: "brand-rama-ringwear",
    category: "hand-wraps",
    name: "Grip Lock Wraps",
    summary: "Stiffer wraps for fighters who want a locked-in fist.",
    description:
      "Demo product. Firmer weave with an extended closure tab for a tighter finish.",
    variantKind: "length",
    color: "#BFDBFE",
    variants: [
      { id: "v-rr-w-45", label: "4.5 m", sku: "RR-W-45", priceUsd: 16, stock: 30 },
      { id: "v-rr-w-5", label: "5 m", sku: "RR-W-5", priceUsd: 18, stock: 27 },
    ],
  },
  {
    id: "p-rr-soft-wraps",
    slug: "rama-ringwear-soft-wraps",
    brandId: "brand-rama-ringwear",
    category: "hand-wraps",
    name: "Soft Stretch Wraps",
    summary: "Beginner-friendly wraps with gentle stretch.",
    description:
      "Demo product. Easy to tension and comfortable for shorter training sessions.",
    variantKind: "length",
    color: "#DBEAFE",
    variants: [
      { id: "v-rr-sw-3", label: "3 m", sku: "RR-SW-3", priceUsd: 13, stock: 35 },
      { id: "v-rr-sw-45", label: "4.5 m", sku: "RR-SW-45", priceUsd: 15, stock: 42 },
    ],
  },
  {
    id: "p-ss-bag-gloves",
    slug: "siam-strike-bag-gloves",
    brandId: "brand-siam-strike",
    category: "gloves",
    name: "Bag Anchor Gloves",
    summary: "Heavier foam gloves made for bag-only sessions.",
    description:
      "Demo product. Thick shock absorption for high-rep bag circuits without sparring use.",
    variantKind: "weight",
    color: "#0D9488",
    variants: [
      { id: "v-ss-b-14", label: "14 oz", sku: "SS-B-14", priceUsd: 76, stock: 14 },
      { id: "v-ss-b-16", label: "16 oz", sku: "SS-B-16", priceUsd: 80, stock: 17 },
      { id: "v-ss-b-18", label: "18 oz", sku: "SS-B-18", priceUsd: 84, stock: 9 },
    ],
  },
  {
    id: "p-nmf-camp-shorts",
    slug: "nak-muay-forge-camp-shorts",
    brandId: "brand-nak-muay-forge",
    category: "shorts",
    name: "Camp Drill Shorts",
    summary: "Everyday gym shorts with a secure drawcord.",
    description:
      "Demo product. Durable fabric for drills, shadowboxing, and open mat sessions.",
    variantKind: "size",
    color: "#9A3412",
    variants: [
      { id: "v-nmf-cd-s", label: "S", sku: "NMF-CD-S", priceUsd: 42, stock: 16 },
      { id: "v-nmf-cd-m", label: "M", sku: "NMF-CD-M", priceUsd: 42, stock: 24 },
      { id: "v-nmf-cd-l", label: "L", sku: "NMF-CD-L", priceUsd: 42, stock: 18 },
      { id: "v-nmf-cd-xl", label: "XL", sku: "NMF-CD-XL", priceUsd: 44, stock: 10 },
    ],
  },
];

export function getBrandById(id: string) {
  return brands.find((brand) => brand.id === id);
}

export function getBrandBySlug(slug: string) {
  return brands.find((brand) => brand.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductsByBrand(brandId: string) {
  return products.filter((product) => product.brandId === brandId);
}

export function getVariant(productId: string, variantId: string) {
  const product = getProductById(productId);
  return product?.variants.find((variant) => variant.id === variantId);
}

export function filterProducts(filters: {
  brand?: string;
  category?: string;
}) {
  return products.filter((product) => {
    const brand = getBrandById(product.brandId);
    const brandOk =
      !filters.brand ||
      brand?.slug === filters.brand ||
      product.brandId === filters.brand;
    const categoryOk = !filters.category || product.category === filters.category;
    return brandOk && categoryOk;
  });
}
