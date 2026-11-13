"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { brands, getBrandById, getProductById } from "@/data/catalog";
import { usePortal } from "@/context/PortalContext";
import { calcCommission, roundMoney } from "@/lib/money";
import {
  COMMISSION_RATES,
  DEFAULT_COMMISSION_RATE,
  type CartItem,
  type Product,
  type SimulatedOrder,
} from "@/lib/types";

const CART_KEY = "fgm-demo-cart";
const RATE_KEY = "fgm-demo-commission-rate";
const ORDERS_KEY = "fgm-demo-orders";

type MarketplaceContextValue = {
  cart: CartItem[];
  commissionRate: number;
  orders: SimulatedOrder[];
  hydrated: boolean;
  itemCount: number;
  brandGroups: Array<{
    brandId: string;
    brandName: string;
    items: Array<CartItem & { lineTotalUsd: number; unitPriceUsd: number; productName: string; variantLabel: string }>;
    subtotalUsd: number;
  }>;
  cartSubtotalUsd: number;
  setCommissionRate: (rate: number) => void;
  addToCart: (productId: string, variantId: string, quantity?: number) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  clearBrandFromCart: (brandId: string) => void;
  placeOrderForBrand: (input: {
    brandId: string;
    buyerName: string;
    destination: string;
  }) => SimulatedOrder | null;
  getOrder: (id: string) => SimulatedOrder | undefined;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const { catalogProducts } = usePortal();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [commissionRate, setCommissionRateState] = useState(DEFAULT_COMMISSION_RATE);
  const [orders, setOrders] = useState<SimulatedOrder[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const resolveProduct = useCallback(
    (productId: string): Product | undefined =>
      catalogProducts.find((product) => product.id === productId) ??
      getProductById(productId),
    [catalogProducts],
  );

  const resolveVariant = useCallback(
    (productId: string, variantId: string) =>
      resolveProduct(productId)?.variants.find((variant) => variant.id === variantId),
    [resolveProduct],
  );

  useEffect(() => {
    const savedCart = readJson<CartItem[]>(CART_KEY, []);
    const savedRate = readJson<number>(RATE_KEY, DEFAULT_COMMISSION_RATE);
    const savedOrders = readJson<SimulatedOrder[]>(ORDERS_KEY, []);
    setCart(savedCart);
    setCommissionRateState(
      COMMISSION_RATES.includes(savedRate as (typeof COMMISSION_RATES)[number])
        ? savedRate
        : DEFAULT_COMMISSION_RATE,
    );
    setOrders(savedOrders);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(RATE_KEY, JSON.stringify(commissionRate));
  }, [commissionRate, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  const setCommissionRate = useCallback((rate: number) => {
    if (!COMMISSION_RATES.includes(rate as (typeof COMMISSION_RATES)[number])) return;
    setCommissionRateState(rate);
  }, []);

  const addToCart = useCallback((productId: string, variantId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.variantId === variantId,
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { productId, variantId, quantity }];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      setCart((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (item) => !(item.productId === productId && item.variantId === variantId),
          );
        }
        return prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item,
        );
      });
    },
    [],
  );

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId),
      ),
    );
  }, []);

  const clearBrandFromCart = useCallback(
    (brandId: string) => {
      setCart((prev) =>
        prev.filter((item) => resolveProduct(item.productId)?.brandId !== brandId),
      );
    },
    [resolveProduct],
  );

  const brandGroups = useMemo(() => {
    const groups = new Map<
      string,
      {
        brandId: string;
        brandName: string;
        items: Array<
          CartItem & {
            lineTotalUsd: number;
            unitPriceUsd: number;
            productName: string;
            variantLabel: string;
          }
        >;
        subtotalUsd: number;
      }
    >();

    for (const item of cart) {
      const product = resolveProduct(item.productId);
      const variant = resolveVariant(item.productId, item.variantId);
      const brand = product ? getBrandById(product.brandId) : undefined;
      if (!product || !variant || !brand) continue;

      const lineTotalUsd = roundMoney(variant.priceUsd * item.quantity);
      const current = groups.get(brand.id) ?? {
        brandId: brand.id,
        brandName: brand.name,
        items: [],
        subtotalUsd: 0,
      };
      current.items.push({
        ...item,
        lineTotalUsd,
        unitPriceUsd: variant.priceUsd,
        productName: product.name,
        variantLabel: variant.label,
      });
      current.subtotalUsd = roundMoney(current.subtotalUsd + lineTotalUsd);
      groups.set(brand.id, current);
    }

    return Array.from(groups.values()).sort((a, b) =>
      a.brandName.localeCompare(b.brandName),
    );
  }, [cart, resolveProduct, resolveVariant]);

  const cartSubtotalUsd = useMemo(
    () => roundMoney(brandGroups.reduce((sum, group) => sum + group.subtotalUsd, 0)),
    [brandGroups],
  );

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const placeOrderForBrand = useCallback(
    ({
      brandId,
      buyerName,
      destination,
    }: {
      brandId: string;
      buyerName: string;
      destination: string;
    }) => {
      const group = brandGroups.find((entry) => entry.brandId === brandId);
      const brand = brands.find((entry) => entry.id === brandId);
      if (!group || !brand || group.items.length === 0) return null;

      const { commissionUsd, sellerPayoutUsd } = calcCommission(
        group.subtotalUsd,
        commissionRate,
      );
      const shippingUsd = 18;

      const order: SimulatedOrder = {
        id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        brandId: brand.id,
        brandName: brand.name,
        items: group.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          unitPriceUsd: item.unitPriceUsd,
          lineTotalUsd: item.lineTotalUsd,
        })),
        itemsSubtotalUsd: group.subtotalUsd,
        shippingUsd,
        commissionRate,
        commissionUsd,
        sellerPayoutUsd,
        buyerName: buyerName.trim() || "Demo Buyer",
        destination: destination.trim() || "Canada",
        status: "simulated",
      };

      setOrders((prev) => [order, ...prev]);
      clearBrandFromCart(brandId);
      return order;
    },
    [brandGroups, clearBrandFromCart, commissionRate],
  );

  const getOrder = useCallback(
    (id: string) => orders.find((order) => order.id === id),
    [orders],
  );

  const value: MarketplaceContextValue = {
    cart,
    commissionRate,
    orders,
    hydrated,
    itemCount,
    brandGroups,
    cartSubtotalUsd,
    setCommissionRate,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearBrandFromCart,
    placeOrderForBrand,
    getOrder,
  };

  return (
    <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }
  return context;
}
