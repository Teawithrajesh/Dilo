import { expect, test } from "@playwright/test";

const ALL = ["Birthday", "Engagement", "Wedding", "Anniversary"];
// 1×1 PNG
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", "base64");

test("landing shows exactly the four celebrations", async ({ page }) => {
  await page.goto("/welcome/");
  const tiles = page.locator("#celebrations a");
  await expect(tiles).toHaveText(ALL);
  const text = (await page.locator("body").innerText()).toLowerCase();
  for (const gone of [/\blaptop/, /\btrip\b/, /\bgoa\b/]) expect(text).not.toMatch(gone);
});

for (const name of ALL) {
  const slug = name.toLowerCase();

  test(`${name}: tile opens its themed page with all four fields`, async ({ page }) => {
    await page.goto("/welcome/");
    await page.locator("#celebrations a", { hasText: name }).click();
    await expect(page).toHaveURL(new RegExp(`/celebrate/${slug}/$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page.getByTestId("photo-input")).toBeAttached();
    await expect(page.getByTestId("invite-input")).toBeAttached();
    await expect(page.getByLabel("Dream wish")).toBeVisible();
    await expect(page.getByLabel("Estimated budget")).toBeVisible();
    await expect(page.getByRole("status").first()).toContainText("DEMO DATA");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("photo and invitation previews appear in their frames", async ({ page }) => {
  await page.goto("/celebrate/birthday/");
  await page.getByTestId("photo-input").setInputFiles({ name: "me.png", mimeType: "image/png", buffer: PNG });
  await expect(page.getByTestId("photo-preview")).toBeVisible();
  await page.getByTestId("invite-input").setInputFiles({ name: "card.png", mimeType: "image/png", buffer: PNG });
  await expect(page.getByTestId("invite-preview")).toBeVisible();
});

test("non-image files are refused", async ({ page }) => {
  await page.goto("/celebrate/wedding/");
  await page.getByTestId("photo-input").setInputFiles({ name: "x.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF") });
  await expect(page.getByRole("alert").filter({ hasText: "JPG, PNG or WebP" })).toBeVisible();
  await expect(page.getByTestId("photo-preview")).toHaveCount(0);
});

test("wish and budget are required; budget is whole rupees", async ({ page }) => {
  await page.goto("/celebrate/engagement/");
  const submit = page.getByRole("button", { name: /Create engagement dream/ });
  await submit.click();
  await expect(page.getByRole("alert").filter({ hasText: "dream wish" })).toBeVisible();
  await page.getByLabel("Dream wish").fill("Matching rings");
  await submit.click();
  await expect(page.getByRole("alert").filter({ hasText: "budget" })).toBeVisible();
  await page.getByLabel("Estimated budget").fill("75000.50abc");
  await expect(page.getByLabel("Estimated budget")).toHaveValue("75,00,050");
  await page.getByLabel("Estimated budget").fill("75000");
  await expect(page.getByLabel("Estimated budget")).toHaveValue("75,000");
  await submit.click();
  await expect(page.getByText("Your engagement dream is ready")).toBeVisible();
});

test("back link returns to the celebrations section", async ({ page }) => {
  await page.goto("/celebrate/anniversary/");
  await page.getByRole("link", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/welcome\/#celebrations$/);
});
