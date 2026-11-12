import { chromium } from "playwright";
import { mkdirSync } from "fs";

const base = process.env.BASE_URL || "http://localhost:3000";
const outDir = "/tmp/fgm-video";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  recordVideo: { dir: outDir, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();

async function pause(ms = 700) {
  await page.waitForTimeout(ms);
}

await page.goto(base, { waitUntil: "networkidle" });
await pause(1000);

await page.goto(`${base}/catalog?brand=siam-strike&category=gloves`, {
  waitUntil: "networkidle",
});
await pause(800);
await page.getByRole("link", { name: "Velocity Training Gloves" }).first().click();
await page.waitForURL("**/products/siam-strike-velocity-gloves");
await page.getByRole("button", { name: /12 oz/i }).click();
await pause(400);
await page.getByRole("button", { name: /Add to cart/i }).click();
await page.getByText(/Added 1 × Velocity Training Gloves/).waitFor();
await pause(700);

await page.goto(`${base}/products/nak-muay-forge-cotton-wraps`, {
  waitUntil: "networkidle",
});
await page.locator(".variant-option", { hasText: "4.5 m" }).click();
await page.getByRole("button", { name: /Add to cart/i }).click();
await page.getByText(/Added 1 × Forge Cotton Wraps/).waitFor();
await pause(700);

await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
await page.getByText(/Multiple brands in cart/i).waitFor();
await pause(1000);

await page.goto(`${base}/commission`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "1%", exact: true }).click();
await pause(500);
await page.getByRole("button", { name: "5%", exact: true }).click();
await pause(800);

await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
const siamSection = page.locator(".brand-cart").filter({ hasText: "Siam Strike Co." });
await siamSection.getByRole("button", { name: /Place simulated order/i }).click();
await page.waitForURL("**/order/**");
await page.locator(".eyebrow", { hasText: "Simulated order" }).waitFor();
await pause(1500);

await context.close();
await browser.close();

const { readdirSync, copyFileSync } = await import("fs");
const files = readdirSync(outDir).filter((name) => name.endsWith(".webm"));
if (!files.length) {
  console.error("No video recorded");
  process.exit(1);
}
const source = `${outDir}/${files[0]}`;
const target = "/opt/cursor/artifacts/purchase_flow_demo.webm";
copyFileSync(source, target);
console.log(`Saved ${target}`);
