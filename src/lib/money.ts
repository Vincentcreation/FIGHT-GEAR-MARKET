export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function calcCommission(itemsSubtotalUsd: number, rate: number) {
  const commissionUsd = roundMoney(itemsSubtotalUsd * rate);
  const sellerPayoutUsd = roundMoney(itemsSubtotalUsd - commissionUsd);
  return { commissionUsd, sellerPayoutUsd };
}

export function rateLabel(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}
