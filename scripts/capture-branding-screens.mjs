import { chromium } from "playwright";
import { mkdirSync, copyFileSync } from "fs";

const base = process.env.BASE_URL || "http://localhost:3000";
const tmp = "/tmp/fgm-branding";
mkdirSync(tmp, { recursive: true });
mkdirSync("/opt/cursor/artifacts", { recursive: true });

const browser = await chromium.launch({ headless: true });
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

async function capture(viewport, name) {
  const page = await browser.newPage({ viewport });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForSelector(".brand-logo__img, .brand-mark--fallback");
  await page.screenshot({
    path: `${tmp}/${name}_home.png`,
    fullPage: false,
  });

  await page.goto(`${base}/catalog?brand=siam-strike&category=gloves`, {
    waitUntil: "networkidle",
  });
  await page.screenshot({
    path: `${tmp}/${name}_catalog.png`,
    fullPage: false,
  });

  await page.goto(`${base}/products/siam-strike-velocity-gloves`, {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: /12 oz/i }).click();
  await page.getByRole("button", { name: /Add to cart/i }).click();
  await page.getByText(/Added 1 × Velocity Training Gloves/).waitFor();

  await page.goto(`${base}/products/nak-muay-forge-cotton-wraps`, {
    waitUntil: "networkidle",
  });
  await page.locator(".variant-option", { hasText: "4.5 m" }).click();
  await page.getByRole("button", { name: /Add to cart/i }).click();
  await page.getByText(/Added 1 × Forge Cotton Wraps/).waitFor();

  await page.goto(`${base}/cart`, { waitUntil: "networkidle" });
  assert(
    await page.getByText(/Multiple brands in cart/i).isVisible(),
    `${name}: multi-brand callout missing`,
  );
  await page.screenshot({
    path: `${tmp}/${name}_cart.png`,
    fullPage: false,
  });

  const headerBg = await page.locator(".site-header").evaluate((el) =>
    getComputedStyle(el).backgroundColor,
  );
  const footerBg = await page.locator(".site-footer").evaluate((el) =>
    getComputedStyle(el).backgroundColor,
  );
  const btnBg = await page.locator(".btn-primary").first().evaluate((el) =>
    getComputedStyle(el).backgroundColor,
  );
  console.log(`${name} header=${headerBg} footer=${footerBg} primary=${btnBg}`);

  const siam = page.locator(".brand-cart").filter({ hasText: "Siam Strike Co." });
  await siam.getByRole("button", { name: /Place simulated order/i }).click();
  await page.waitForURL("**/order/**");
  assert(
    await page.locator(".eyebrow", { hasText: "Simulated order" }).isVisible(),
    `${name}: order confirmation missing`,
  );
  await page.screenshot({
    path: `${tmp}/${name}_order.png`,
    fullPage: false,
  });
  await page.close();
}

try {
  await capture({ width: 1440, height: 900 }, "desktop_1440");
  await capture({ width: 375, height: 812 }, "mobile_375");

  const logoOk = await (async () => {
    const page = await browser.newPage();
    const res = await page.goto(`${base}/branding/fgm-logo.png`);
    const status = res?.status() ?? 0;
    await page.close();
    return status === 200;
  })();
  assert(logoOk, "public/branding/fgm-logo.png not served");
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}

const files = [
  ["desktop_1440_home.png", "branding_desktop_1440_home.png"],
  ["desktop_1440_catalog.png", "branding_desktop_1440_catalog.png"],
  ["desktop_1440_cart.png", "branding_desktop_1440_cart.png"],
  ["mobile_375_home.png", "branding_mobile_375_home.png"],
  ["mobile_375_catalog.png", "branding_mobile_375_catalog.png"],
  ["mobile_375_cart.png", "branding_mobile_375_cart.png"],
  ["desktop_1440_order.png", "branding_desktop_1440_order.png"],
  ["mobile_375_order.png", "branding_mobile_375_order.png"],
];

for (const [from, to] of files) {
  copyFileSync(`${tmp}/${from}`, `/opt/cursor/artifacts/${to}`);
}

if (failures.length) {
  console.error("BRANDING VERIFY FAILED");
  for (const failure of failures) console.error("-", failure);
  process.exit(1);
}

console.log("BRANDING VERIFY PASSED");
