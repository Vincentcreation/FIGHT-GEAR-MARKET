import { chromium } from "playwright";
import { copyFileSync, existsSync } from "fs";
import path from "path";
import { ensureDir, resolveArtifactsDir, resolveWorkDir } from "./lib/paths.mjs";

const base = process.env.BASE_URL || "http://localhost:3000";
const artifactsDir = ensureDir(resolveArtifactsDir());
const workDir = ensureDir(resolveWorkDir("branding", artifactsDir));

const EXPECTED = {
  header: "rgb(247, 243, 235)", // #F7F3EB ivory
  footer: "rgb(24, 24, 23)", // #181817 charcoal
  primary: "rgb(154, 28, 35)", // #9A1C23 brick
};

const browser = await chromium.launch({ headless: true });
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

async function assertLogoVisible(page, label) {
  await page.waitForSelector(".site-header .brand-logo__img, .site-header .brand-mark--fallback", {
    state: "visible",
    timeout: 10000,
  });

  const logo = page.locator(".site-header .brand-logo__img");
  const fallback = page.locator(".site-header .brand-mark--fallback");

  if (await logo.count()) {
    assert(await logo.isVisible(), `${label}: header logo image not visible`);
    await page.waitForFunction(() => {
      const img = document.querySelector(".site-header .brand-logo__img");
      return Boolean(img && img.complete && img.naturalWidth > 0);
    }, { timeout: 10000 });
    const metrics = await logo.evaluate((img) => ({
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentSrc: img.currentSrc || img.src,
    }));
    assert(metrics.complete, `${label}: logo image not complete`);
    assert(metrics.naturalWidth > 0, `${label}: logo naturalWidth is 0`);
    assert(
      /fgm-logo\.png|branding%2Ffgm-logo/i.test(metrics.currentSrc),
      `${label}: logo src does not reference fgm-logo.png (got ${metrics.currentSrc})`,
    );
    return "image";
  }

  assert(
    await fallback.isVisible(),
    `${label}: neither logo image nor text fallback visible`,
  );
  assert(
    await fallback.getByText("Fight Gear Market").isVisible(),
    `${label}: fallback should show Fight Gear Market home link text`,
  );
  console.warn(
    `${label}: logo missing in UI; fallback shown. Expected file: public/branding/fgm-logo.png`,
  );
  return "fallback";
}

async function assertThemeColors(page, label) {
  const colors = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const header = getComputedStyle(document.querySelector(".site-header"));
    const footer = getComputedStyle(document.querySelector(".site-footer"));
    const cartBadge = document.querySelector(".cart-count");
    const primaryBtn = document.querySelector(".btn-primary");
    return {
      brickVar: root.getPropertyValue("--brick").trim(),
      deepVar: root.getPropertyValue("--brick-deep").trim(),
      charcoalVar: root.getPropertyValue("--charcoal").trim(),
      ivoryVar: root.getPropertyValue("--ivory").trim(),
      warmGrayVar: root.getPropertyValue("--warm-gray").trim(),
      headerBg: header.backgroundColor,
      footerBg: footer.backgroundColor,
      primaryBg: primaryBtn
        ? getComputedStyle(primaryBtn).backgroundColor
        : cartBadge
          ? getComputedStyle(cartBadge).backgroundColor
          : "",
    };
  });

  assert(colors.brickVar.toLowerCase() === "#9a1c23", `${label}: --brick expected #9a1c23, got ${colors.brickVar}`);
  assert(colors.deepVar.toLowerCase() === "#76151b", `${label}: --brick-deep expected #76151b, got ${colors.deepVar}`);
  assert(colors.charcoalVar.toLowerCase() === "#181817", `${label}: --charcoal expected #181817, got ${colors.charcoalVar}`);
  assert(colors.ivoryVar.toLowerCase() === "#f7f3eb", `${label}: --ivory expected #f7f3eb, got ${colors.ivoryVar}`);
  assert(colors.warmGrayVar.toLowerCase() === "#615b53", `${label}: --warm-gray expected #615b53, got ${colors.warmGrayVar}`);
  assert(colors.headerBg === EXPECTED.header, `${label}: header expected ${EXPECTED.header}, got ${colors.headerBg}`);
  assert(colors.footerBg === EXPECTED.footer, `${label}: footer expected ${EXPECTED.footer}, got ${colors.footerBg}`);
  assert(colors.primaryBg === EXPECTED.primary, `${label}: primary/brick surface expected ${EXPECTED.primary}, got ${colors.primaryBg}`);
  console.log(`${label} colors ok header=${colors.headerBg} footer=${colors.footerBg} primary=${colors.primaryBg}`);
}

async function capture(viewport, name) {
  const page = await browser.newPage({ viewport });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForSelector(".brand-logo__img, .brand-mark--fallback");
  const logoMode = await assertLogoVisible(page, name);
  await assertThemeColors(page, `${name}/home`);
  await page.screenshot({
    path: path.join(workDir, `${name}_home.png`),
    fullPage: false,
  });

  await page.goto(`${base}/catalog?brand=siam-strike&category=gloves`, {
    waitUntil: "networkidle",
  });
  await assertLogoVisible(page, `${name}/catalog`);
  await assertThemeColors(page, `${name}/catalog`);
  await page.screenshot({
    path: path.join(workDir, `${name}_catalog.png`),
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
  assert(
    await page.getByText("Local demo. One brand per simulated order.").isVisible(),
    `${name}: English footer copy missing`,
  );
  await assertLogoVisible(page, `${name}/cart`);
  await assertThemeColors(page, `${name}/cart`);
  await page.screenshot({
    path: path.join(workDir, `${name}_cart.png`),
    fullPage: false,
  });

  const siam = page.locator(".brand-cart").filter({ hasText: "Siam Strike Co." });
  await siam.getByRole("button", { name: /Place simulated order/i }).click();
  await page.waitForURL("**/order/**");
  assert(
    await page.locator(".eyebrow", { hasText: "Simulated order" }).isVisible(),
    `${name}: order confirmation missing`,
  );
  await page.screenshot({
    path: path.join(workDir, `${name}_order.png`),
    fullPage: false,
  });
  await page.close();
  return logoMode;
}

try {
  const desktopMode = await capture({ width: 1440, height: 900 }, "desktop_1440");
  const mobileMode = await capture({ width: 375, height: 812 }, "mobile_375");

  const logoAsset = await (async () => {
    const page = await browser.newPage();
    const res = await page.goto(`${base}/branding/fgm-logo.png`);
    const status = res?.status() ?? 0;
    const contentType = res?.headers()["content-type"] ?? "";
    await page.close();
    return { status, contentType };
  })();
  assert(logoAsset.status === 200, "public/branding/fgm-logo.png not served (HTTP)");
  assert(
    contentTypeLooksLikePng(logoAsset.contentType),
    `logo content-type should be image/png, got ${logoAsset.contentType}`,
  );
  console.log(`logo modes: desktop=${desktopMode} mobile=${mobileMode}`);
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}

function contentTypeLooksLikePng(value) {
  return String(value).toLowerCase().includes("image/png");
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
  const source = path.join(workDir, from);
  if (!existsSync(source)) {
    failures.push(`Missing capture file: ${source}`);
    continue;
  }
  copyFileSync(source, path.join(artifactsDir, to));
}

console.log(`Artifacts written to ${artifactsDir}`);

if (failures.length) {
  console.error("BRANDING VERIFY FAILED");
  for (const failure of failures) console.error("-", failure);
  process.exit(1);
}

console.log("BRANDING VERIFY PASSED");
