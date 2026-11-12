import { brands } from "@/data/catalog";
import type { Brand, Category, Product, Variant } from "@/lib/types";

export type PortalRole = "admin" | "supplier";

export type ListingStatus = "draft" | "pending_review" | "published" | "rejected";

export type PortalAccount = {
  id: string;
  role: PortalRole;
  name: string;
  brandId?: string;
};

export type PortalListing = Product & {
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewNote?: string;
  source: "supplier";
};

export const PORTAL_ACCOUNTS: PortalAccount[] = [
  {
    id: "admin",
    role: "admin",
    name: "Marketplace Admin",
  },
  {
    id: "supplier-nak-muay-forge",
    role: "supplier",
    name: "Nak Muay Forge supplier",
    brandId: "brand-nak-muay-forge",
  },
  {
    id: "supplier-siam-strike",
    role: "supplier",
    name: "Siam Strike Co. supplier",
    brandId: "brand-siam-strike",
  },
];

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  draft: "Draft",
  pending_review: "Pending review",
  published: "Published",
  rejected: "Rejected",
};

export function getAccountBrand(account: PortalAccount | null): Brand | undefined {
  if (!account?.brandId) return undefined;
  return brands.find((brand) => brand.id === account.brandId);
}

export function canManageListing(
  account: PortalAccount | null,
  listing: PortalListing,
): boolean {
  if (!account) return false;
  if (account.role === "admin") return true;
  return account.role === "supplier" && account.brandId === listing.brandId;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function defaultVariantKind(category: Category): Product["variantKind"] {
  if (category === "gloves") return "weight";
  if (category === "shorts") return "size";
  return "length";
}

export function defaultVariants(kind: Product["variantKind"]): Variant[] {
  if (kind === "weight") {
    return [
      { id: "v-new-12", label: "12 oz", sku: "NEW-12", priceUsd: 80, stock: 10 },
      { id: "v-new-14", label: "14 oz", sku: "NEW-14", priceUsd: 84, stock: 10 },
      { id: "v-new-16", label: "16 oz", sku: "NEW-16", priceUsd: 88, stock: 10 },
    ];
  }
  if (kind === "size") {
    return [
      { id: "v-new-s", label: "S", sku: "NEW-S", priceUsd: 48, stock: 12 },
      { id: "v-new-m", label: "M", sku: "NEW-M", priceUsd: 48, stock: 12 },
      { id: "v-new-l", label: "L", sku: "NEW-L", priceUsd: 48, stock: 12 },
    ];
  }
  return [
    { id: "v-new-45", label: "4.5 m", sku: "NEW-45", priceUsd: 15, stock: 20 },
    { id: "v-new-5", label: "5 m", sku: "NEW-5", priceUsd: 17, stock: 20 },
  ];
}

export function listingToProduct(listing: PortalListing): Product {
  return {
    id: listing.id,
    slug: listing.slug,
    brandId: listing.brandId,
    category: listing.category,
    name: listing.name,
    summary: listing.summary,
    description: listing.description,
    variantKind: listing.variantKind,
    variants: listing.variants,
    color: listing.color,
  };
}
