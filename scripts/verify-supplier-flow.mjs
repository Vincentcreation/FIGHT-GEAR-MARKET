import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const productName = `Camp Smoke Gloves ${Date.now().toString(36)}`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

try {
  await page.goto(`${base}/portal`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Nak Muay Forge supplier/i }).click();
  await page.waitForURL("**/supplier");

  await page.getByRole("link", { name: /New product draft/i }).click();
  await page.waitForURL("**/supplier/products/new");
  await page.getByLabel("Product name").fill(productName);
  await page.getByLabel("Summary").fill("Supplier draft for approval demo.");
  await page.getByLabel("Description").fill("Created by the supplier portal verify script.");
  await page.getByLabel("Category").selectOption("gloves");
  await page.getByRole("button", { name: /Save draft/i }).click();
  await page.waitForURL(/\/supplier\/products\/listing-/);

  assert(await page.getByText("Draft", { exact: true }).first().isVisible(), "Draft status missing");
  await page.getByRole("button", { name: /Submit for review/i }).click();
  await page.getByText(/Submitted for admin review/i).waitFor();

  const listingUrl = page.url();
  const listingId = listingUrl.split("/").pop();

  await page.goto(`${base}/supplier`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Sign out/i }).click();
  await page.goto(`${base}/portal`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Marketplace Admin/i }).click();
  await page.waitForURL("**/admin");
  assert(await page.getByText(productName).first().isVisible(), "Pending listing missing in admin");

  const row = page.locator(".listing-table li").filter({ hasText: productName });
  await row.getByRole("button", { name: /Approve/i }).click();
  assert(
    await page
      .locator(".listing-table li")
      .filter({ hasText: productName })
      .getByText(/Published/i)
      .first()
      .isVisible(),
    "Approved listing should show Published",
  );

  await page.goto(`${base}/catalog`, { waitUntil: "networkidle" });
  const catalogLink = page.getByRole("link", { name: productName }).first();
  assert(await catalogLink.isVisible(), "Approved product missing from catalog");

  await catalogLink.click();
  await page.waitForURL(/\/products\//);
  assert(await page.getByRole("heading", { name: productName }).isVisible(), "Product page missing");

  // Isolation: other brand cannot open the listing editor.
  await page.goto(`${base}/portal`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Siam Strike Co\. supplier/i }).click();
  await page.waitForURL("**/supplier");
  await page.goto(`${base}/supplier/products/${listingId}`, { waitUntil: "networkidle" });
  assert(
    await page.getByRole("heading", { name: /Access denied|Listing not found/i }).isVisible(),
    "Other brand should not access this listing",
  );
  assert(
    (await page.getByRole("button", { name: /Submit for review/i }).count()) === 0,
    "Other brand must not manage foreign listing",
  );
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  await browser.close();
}

if (failures.length) {
  console.error("SUPPLIER FLOW FAILED");
  for (const failure of failures) console.error("-", failure);
  process.exit(1);
}

console.log("SUPPLIER FLOW PASSED");
console.log(`Created and published: ${productName}`);
