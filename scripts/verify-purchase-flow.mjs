import { chromium } from "playwright";
import path from "path";
import { ensureDir, resolveArtifactsDir, resolveWorkDir } from "./lib/paths.mjs";

const base = process.env.BASE_URL || "http://localhost:3000";
const artifactsDir = ensureDir(resolveArtifactsDir());
const outDir = ensureDir(resolveWorkDir("flow", artifactsDir));

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

try {
  await page.goto(base, { waitUntil: "networkidle" });
  assert(await page.getByText("DEMO").first().isVisible(), "DEMO banner missing");
  assert(
    (await page.locator(".site-header .brand-logo__img").count()) > 0 ||
      (await page.locator(".site-header .brand-mark--fallback").count()) > 0,
    "Header brand mark missing",
  );
  assert(
    await page.getByText("Local demo. One brand per simulated order.").isVisible(),
    "English footer copy missing",
  );
  await page.screenshot({ path: path.join(outDir, "01-home.png"), fullPage: true });

  await page.goto(`${base}/catalog?brand=siam-strike&category=gloves`, {
    waitUntil: "networkidle",
  });
  assert(
    await page.getByRole("heading", { name: "Velocity Training Gloves" }).isVisible(),
    "Velocity gloves missing from filtered catalog",
  );
  await page.screenshot({
    path: path.join(outDir, "02-catalog-filtered.png"),
    fullPage: true,
  });

  await page.getByRole("link", { name: "Velocity Training Gloves" }).first().click();
  await page.waitForURL("**/products/siam-strike-velocity-gloves");
  await page.getByRole("button", { name: /12 oz/i }).click();
  await page.getByRole("button", { name: /Add to cart/i }).click();
  assert(
    await page.getByText(/Added 1 × Velocity Training Gloves \(12 oz\)/).isVisible(),
    "Add-to-cart feedback missing for gloves",
  );
  assert((await page.locator(".cart-count").innerText()) === "1", "Cart count should be 1");
  await page.screenshot({ path: path.join(outDir, "03-gloves-added.png"), fullPage: true });

  await page.goto(`${base}/products/siam-strike-cut-shorts`, { waitUntil: "networkidle" });
  await page.locator(".variant-option", { hasText: "M" }).filter({ hasText: "$54.00" }).click();
  await page.getByRole("button", { name: /Add to cart/i }).click();
  assert(
    await page.getByText(/Added 1 × Strike Cut Shorts \(M\)/).isVisible(),
    "Add-to-cart feedback missing for shorts",
  );
  assert((await page.locator(".cart-count").innerText()) === "2", "Cart count should be 2");

  await page.goto(`${base}/products/nak-muay-forge-cotton-wraps`, {
    waitUntil: "networkidle",
  });
  await page.locator(".variant-option", { hasText: "4.5 m" }).click();
  await page.getByRole("button", { name: /Add to cart/i }).click();
  assert(
    await page.getByText(/Added 1 × Forge Cotton Wraps \(4\.5 m\)/).isVisible(),
    "Add-to-cart feedback missing for wraps",
  );
  assert((await page.locator(".cart-count").innerText()) === "3", "Cart count should be 3");

  await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
  assert(
    await page.getByText(/Multiple brands in cart/i).isVisible(),
    "Multi-brand callout missing",
  );
  assert(
    await page.getByRole("heading", { name: "Siam Strike Co." }).isVisible(),
    "Siam group missing",
  );
  assert(
    await page.getByRole("heading", { name: "Nak Muay Forge" }).isVisible(),
    "Nak group missing",
  );
  await page.screenshot({
    path: path.join(outDir, "04-cart-multi-brand.png"),
    fullPage: true,
  });

  await page.goto(`${base}/commission`, { waitUntil: "networkidle" });
  const subtotal = 88 + 54 + 14; // gloves 12oz + shorts M + wraps 4.5m
  await page.getByRole("button", { name: "1%", exact: true }).click();
  assert(
    await page.getByText(money(subtotal * 0.01)).first().isVisible(),
    "1% commission amount not visible",
  );
  await page.getByRole("button", { name: "2%", exact: true }).click();
  assert(
    await page.getByText(money(subtotal * 0.02)).first().isVisible(),
    "2% commission amount not visible",
  );
  await page.getByRole("button", { name: "5%", exact: true }).click();
  assert(
    await page.getByText(money(subtotal * 0.05)).first().isVisible(),
    "5% commission amount not visible",
  );
  await page.screenshot({ path: path.join(outDir, "05-commission-5.png"), fullPage: true });

  await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
  const siamSection = page.locator(".brand-cart").filter({ hasText: "Siam Strike Co." });
  await siamSection.getByRole("button", { name: /Place simulated order/i }).click();
  await page.waitForURL("**/order/**");
  assert(
    await page.locator(".eyebrow", { hasText: "Simulated order" }).isVisible(),
    "Order confirmation missing",
  );
  assert(
    await page.getByRole("heading", { name: /Order DEMO-/i }).isVisible(),
    "Order id heading missing",
  );
  assert(
    await page.locator(".order-confirm").getByText("Siam Strike Co.").first().isVisible(),
    "Ordered brand missing",
  );
  assert(
    await page.getByText("Other brands still in your cart.").isVisible(),
    "Remaining brand note missing",
  );
  const expectedCommission = Number((142 * 0.05).toFixed(2));
  assert(
    await page
      .locator(".order-confirm")
      .getByText(money(expectedCommission))
      .first()
      .isVisible(),
    `Expected Siam commission ${money(expectedCommission)}`,
  );
  await page.screenshot({ path: path.join(outDir, "06-order-siam.png"), fullPage: true });

  await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
  assert(
    await page.getByRole("heading", { name: "Nak Muay Forge" }).isVisible(),
    "Remaining brand missing in cart",
  );
  assert(
    (await page.getByRole("heading", { name: "Siam Strike Co." }).count()) === 0,
    "Siam should be removed after order",
  );
  await page.screenshot({
    path: path.join(outDir, "07-cart-remaining.png"),
    fullPage: true,
  });

  const nakSection = page.locator(".brand-cart").filter({ hasText: "Nak Muay Forge" });
  await nakSection.getByRole("button", { name: /Place simulated order/i }).click();
  await page.waitForURL("**/order/**");
  assert(
    await page.locator(".order-confirm").getByText("Nak Muay Forge").first().isVisible(),
    "Nak order confirmation missing",
  );
  await page.screenshot({ path: path.join(outDir, "08-order-nak.png"), fullPage: true });
} catch (error) {
  failures.push(`Unhandled error: ${error instanceof Error ? error.message : String(error)}`);
  await page.screenshot({ path: path.join(outDir, "error.png"), fullPage: true }).catch(() => {});
} finally {
  await browser.close();
}

if (failures.length) {
  console.error("FLOW FAILED");
  for (const failure of failures) console.error("-", failure);
  process.exit(1);
}

console.log("FLOW PASSED");
console.log(`Screenshots in ${outDir}`);
console.log(`Artifacts root ${artifactsDir}`);
