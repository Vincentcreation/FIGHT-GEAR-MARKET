import { chromium } from "playwright";

const base = process.env.BASE_URL || "http://localhost:3000";
const productName = `Camp Smoke Gloves ${Date.now().toString(36)}`;
const revisedName = `${productName} Revised`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

async function signInAs(label) {
  await page.goto(`${base}/portal`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: label }).click();
}

async function assertAbsentFromCatalog(name) {
  await page.goto(`${base}/catalog`, { waitUntil: "networkidle" });
  assert(
    (await page.getByRole("link", { name }).count()) === 0,
    `Product should be absent from catalog: ${name}`,
  );
}

async function expectStatus(label) {
  const status = (await page.getByTestId("listing-status").innerText()).trim();
  assert(
    status.toLowerCase() === label.toLowerCase(),
    `Expected listing status "${label}", got "${status}"`,
  );
}

try {
  // 1. Create draft as Nak Muay Forge; absent from catalog; submit; status matches feedback.
  await signInAs(/Nak Muay Forge supplier/i);
  await page.waitForURL("**/supplier");
  await page.getByRole("link", { name: /New product draft/i }).click();
  await page.waitForURL("**/supplier/products/new");
  await page.getByLabel("Product name").fill(productName);
  await page.getByLabel("Summary").fill("Supplier draft for rejection/resubmit demo.");
  await page
    .getByLabel("Description")
    .fill("Created by the supplier portal verify script.");
  await page.getByLabel("Category").selectOption("gloves");
  await page.getByRole("button", { name: /Save draft/i }).click();
  await page.waitForURL(/\/supplier\/products\/listing-/);

  const listingUrl = page.url();
  const listingId = listingUrl.split("/").pop();
  await expectStatus("Draft");
  // Ensure draft is persisted before leaving the editor.
  await page.waitForFunction(() => {
    try {
      const raw = window.localStorage.getItem("fgm-portal-listings");
      return Boolean(raw && raw.includes('"status":"draft"'));
    } catch {
      return false;
    }
  });

  await assertAbsentFromCatalog(productName);
  await page.goto(listingUrl, { waitUntil: "networkidle" });
  await expectStatus("Draft");
  assert(
    await page.getByRole("button", { name: /Submit for review/i }).isVisible(),
    "Submit for review button missing on draft",
  );

  await page.getByRole("button", { name: /Submit for review/i }).click();
  await page
    .getByTestId("listing-feedback")
    .filter({ hasText: /Submitted for admin review|Could not submit/i })
    .waitFor();
  const firstSubmitFeedback = (
    await page.getByTestId("listing-feedback").innerText()
  ).trim();
  assert(
    firstSubmitFeedback === "Submitted for admin review.",
    `Unexpected submit feedback: ${firstSubmitFeedback}`,
  );
  await expectStatus("Pending review");

  await page.reload({ waitUntil: "networkidle" });
  await expectStatus("Pending review");
  await assertAbsentFromCatalog(productName);

  // 2. Admin rejects; supplier sees note, revises, resubmits; still absent.
  await signInAs(/Marketplace Admin/i);
  await page.waitForURL("**/admin");
  const pendingRow = page
    .locator(".listing-table li")
    .filter({ hasText: productName })
    .filter({ has: page.getByRole("button", { name: /Reject/i }) });
  assert(await pendingRow.first().isVisible(), "Pending listing missing in admin");
  await pendingRow.first().getByRole("button", { name: /Reject/i }).click();
  assert(
    await page
      .locator(".listing-table li")
      .filter({ hasText: productName })
      .filter({ hasText: /Rejected/i })
      .first()
      .isVisible(),
    "Rejected listing should show Rejected",
  );

  await signInAs(/Nak Muay Forge supplier/i);
  await page.waitForURL("**/supplier");
  await page.goto(`${base}/supplier/products/${listingId}`, { waitUntil: "networkidle" });
  await expectStatus("Rejected");
  assert(await page.getByTestId("admin-note").isVisible(), "Admin rejection note missing");

  await page.getByLabel("Product name").fill(revisedName);
  await page.getByLabel("Summary").fill("Revised after admin rejection.");
  await page.getByRole("button", { name: /Submit for review/i }).click();
  await page
    .getByTestId("listing-feedback")
    .filter({ hasText: "Submitted for admin review." })
    .waitFor();
  await expectStatus("Pending review");
  await page.reload({ waitUntil: "networkidle" });
  await expectStatus("Pending review");
  await assertAbsentFromCatalog(revisedName);
  await assertAbsentFromCatalog(productName);

  // 3. Isolation: other brand blocked from edit URL and /admin.
  await signInAs(/Siam Strike Co\. supplier/i);
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
  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  assert(
    await page.getByRole("heading", { name: /Access denied|Sign in required/i }).isVisible(),
    "Supplier must be denied on /admin",
  );

  // 4. Approve; signed-out shopper sees catalog, product page, add to cart.
  await signInAs(/Marketplace Admin/i);
  await page.waitForURL("**/admin");
  const reviewRow = page
    .locator(".listing-table li")
    .filter({ hasText: revisedName })
    .filter({ has: page.getByRole("button", { name: /Approve/i }) });
  assert(await reviewRow.first().isVisible(), "Resubmitted listing missing in admin");
  await reviewRow.first().getByRole("button", { name: /Approve/i }).click();
  assert(
    await page
      .locator(".listing-table li")
      .filter({ hasText: revisedName })
      .filter({ hasText: /Published/i })
      .first()
      .isVisible(),
    "Approved listing should show Published",
  );

  await page.goto(`${base}/portal`, { waitUntil: "networkidle" });
  if (await page.getByRole("button", { name: /Sign out/i }).count()) {
    await page.getByRole("button", { name: /Sign out/i }).click();
  } else {
    await page.evaluate(() => {
      window.localStorage.removeItem("fgm-portal-session");
    });
    await page.reload({ waitUntil: "networkidle" });
  }

  await page.goto(`${base}/catalog`, { waitUntil: "networkidle" });
  const catalogLink = page.getByRole("link", { name: revisedName }).first();
  assert(await catalogLink.isVisible(), "Approved product missing from catalog");
  await catalogLink.click();
  await page.waitForURL(/\/products\//);
  assert(
    await page.getByRole("heading", { name: revisedName }).isVisible(),
    "Product page missing after approval",
  );

  await page.getByRole("button", { name: /12 oz/i }).click();
  await page.getByRole("button", { name: /Add to cart/i }).click();
  assert(
    await page.getByText(/Added 1 × .+ \(12 oz\)/i).isVisible(),
    "Add to cart feedback missing for approved listing",
  );
  assert((await page.locator(".cart-count").innerText()) === "1", "Cart count should be 1");
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
console.log(`Rejected, revised, and published: ${revisedName}`);
