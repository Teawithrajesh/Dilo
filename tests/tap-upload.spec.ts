import { expect, test, type Page } from "@playwright/test";

// Real taps on the upload buttons (not direct file injection), so overlapping layers are caught.
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", "base64");

async function signInAsPriya(page: Page) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: /^Priya Sharma/ }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

async function tapAndPick(page: Page, label: string) {
  const chooser = page.waitForEvent("filechooser");
  await page.getByLabel(label, { exact: true }).click({ timeout: 5000 });
  await (await chooser).setFiles({ name: "x.png", mimeType: "image/png", buffer: PNG });
}

test("tapping Add cover and the photo camera opens the picker (community page)", async ({ page }) => {
  await signInAsPriya(page);
  await page.getByTestId("community-link").filter({ hasText: "Sharma Family" }).first().click();
  await tapAndPick(page, "Change cover photo");
  await expect(page.getByTestId("cover-image")).toBeVisible();
  await tapAndPick(page, "Change community photo");
  await expect(page.getByTestId("community-photo").first()).toBeVisible();
});

test("tapping Add cover and the photo camera opens the picker (create community)", async ({ page }) => {
  await signInAsPriya(page);
  await page.goto("/communities/new/");
  await tapAndPick(page, "Add cover photo");
  await expect(page.getByTestId("cover-image")).toBeVisible();
  await tapAndPick(page, "Add community photo");
  await expect(page.getByTestId("community-photo")).toBeVisible();
});

test("tapping upload on celebration frames opens the picker", async ({ page }) => {
  await page.goto("/celebrate/wedding/");
  const chooser = page.waitForEvent("filechooser");
  await page.getByText("Upload photo", { exact: true }).click({ timeout: 5000 });
  await (await chooser).setFiles({ name: "x.png", mimeType: "image/png", buffer: PNG });
  await expect(page.getByTestId("photo-preview")).toBeVisible();
});
