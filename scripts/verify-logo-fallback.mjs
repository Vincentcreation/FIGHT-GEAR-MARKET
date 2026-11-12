import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const EXPECTED_LOGO_PATH = "public/branding/fgm-logo.png";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

try {
  // Simulate logo load failure for both direct asset and Next image optimizer URLs.
  await page.route("**/branding/fgm-logo.png", async (route) => {
    await route.abort("failed");
  });
  await page.route("**/_next/image**", async (route) => {
    const url = route.request().url();
    if (/fgm-logo/i.test(url)) {
      await route.abort("failed");
      return;
    }
    await route.continue();
  });

  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".site-header .brand-mark--fallback", {
    state: "visible",
    timeout: 15000,
  });

  const fallback = page.locator(".site-header .brand-mark--fallback");
  assert(await fallback.isVisible(), "Fallback brand mark not visible");
  assert(
    (await page.locator(".site-header .brand-logo__img").count()) === 0,
    "Logo image should not remain visible after load failure",
  );
  assert(
    (await page.locator(".site-header .brand-mark__note").count()) === 0,
    "Technical logo path note must not appear in the header fallback",
  );

  const sourceText = (
    await fallback.locator(".brand-mark__word").evaluate((el) => el.textContent || "")
  ).trim();
  assert(
    sourceText === "Fight Gear Market",
    `Fallback source text should be "Fight Gear Market", got ${JSON.stringify(sourceText)}`,
  );
  assert(
    await page.getByRole("link", { name: /fight gear market/i }).first().isVisible(),
    "Fallback should be exposed as a Fight Gear Market home link",
  );

  const href = await fallback.getAttribute("href");
  assert(href === "/", `Fallback link should point to /, got ${href}`);

  await fallback.click();
  await page.waitForURL((url) => {
    const parsed = new URL(url);
    return parsed.pathname === "/";
  });
  assert(
    await page.locator(".site-header .brand-mark--fallback").isVisible(),
    "Fallback should still show after navigating home with logo blocked",
  );

  console.warn(
    `Logo load failure simulated. UI fallback OK. Expected PNG path for diagnostics: ${EXPECTED_LOGO_PATH}`,
  );
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}

if (failures.length) {
  console.error("LOGO FALLBACK VERIFY FAILED");
  for (const failure of failures) console.error("-", failure);
  process.exit(1);
}

console.log("LOGO FALLBACK VERIFY PASSED");
console.log(`Diagnostic expected asset: ${EXPECTED_LOGO_PATH}`);
