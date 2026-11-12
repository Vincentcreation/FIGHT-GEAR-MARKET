# Fight Gear Market

Local **étape 1** marketplace demo for Thai Muay Thai gear brands. Fake English catalog, cart, one-brand simulated orders, and a configurable commission view (1% / 2% / 5%, default 5%).

Source plan: [`PLAN-MARKETPLACE.md`](./PLAN-MARKETPLACE.md)

## Stack

- Next.js (App Router) + TypeScript
- Client-side cart and orders in `localStorage` (no backend, no payments)

## Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build
npm run start
npm run lint
npm run verify:flow           # requires the dev server on :3000
npm run verify:branding       # logo + theme colors at 375px and 1440px
npm run verify:logo-fallback  # simulates logo load failure; text-only home link
```

Capture/video scripts write to `ARTIFACTS_DIR` when set. Otherwise they use `/opt/cursor/artifacts` if that folder exists, or `./artifacts` locally:

```bash
ARTIFACTS_DIR=./artifacts npm run verify:branding
ARTIFACTS_DIR=./artifacts node scripts/record-purchase-flow.mjs
```

Optional scratch dir override: `OUTPUT_DIR=/tmp/fgm-work`.

## Demo catalog

Three fictional Thai brands:

- **Nak Muay Forge** (Bangkok)
- **Siam Strike Co.** (Chiang Mai)
- **Rama Ringwear** (Phuket)

Categories: gloves (weight variants), shorts (size variants), hand wraps (length variants).

A persistent **DEMO** banner marks the UI as non-production.

## Purchase test scenario

1. Open `/catalog` and filter by brand **Siam Strike Co.** and category **Gloves**.
2. Open **Velocity Training Gloves**, choose **12 oz**, quantity **1**, and add to cart.
3. From the same brand, add **Strike Cut Shorts** in size **M**.
4. Switch brand filter to **Nak Muay Forge**, open **Forge Cotton Wraps**, choose **4.5 m**, add to cart.
5. Open `/cart`. Confirm the multi-brand callout appears.
6. Open `/commission` (or the cart commission panel), switch rates between **1%**, **2%**, and **5%**, and confirm commission and seller amounts update on the items subtotal (shipping excluded). Leave **5%** selected.
7. On `/cart`, place a simulated order for **Siam Strike Co.** only.
8. On the order confirmation page, verify commission math and the note that the other brand remains in the cart.
9. Return to `/cart` and place a separate simulated order for **Nak Muay Forge**.

Expected rules:

- One brand per simulated order
- Commission = rate × items subtotal (before demo shipping)
- Seller amount before fees = items subtotal − commission
- Orders and cart state persist in the browser only

## Scope note

This repository is independent of ELEVATEFITNESS. Étape 1 is local/demo only.
