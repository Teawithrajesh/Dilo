import { expect, test, type Page } from "@playwright/test";

// Damaged, old or blocked browser storage must never break a page.
async function signIn(page: Page, full: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${full}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

for (const [label, value] of [["garbage", "xx{"], ["wrong shape", "{}"], ["bad numbers", JSON.stringify({ balance: -5, streak: 99, last: "2026-13-45", history: "x" })]] as const) {
  test(`sparkles survive ${label} saved data`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript((v) => localStorage.setItem("dilo-sparkles-neha", v), value);
    await signIn(page, "Neha Verma");
    await page.goto("/sparkles/");
    await expect(page.getByTestId("sparkle-balance")).toHaveText("0");
    await expect(page.getByRole("button", { name: "Collect +10 Sparkles" })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("admin page survives damaged feedback entries (keeps the good one)", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem("dilo-feedback", JSON.stringify([{}, null, 5, { message: "hi", at: "bad", kind: "zzz", rating: 99 }])));
  await signIn(page, "DILO Admin");
  await page.goto("/admin/");
  await expect(page.getByTestId("admin-feedback")).toHaveCount(1);
  await expect(page.getByTestId("admin-feedback")).toContainText("hi");
  expect(errors).toEqual([]);
});

test("blocked storage (private mode): the app still works, nothing crashes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    const boom = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.getItem = boom; Storage.prototype.setItem = boom; Storage.prototype.removeItem = boom;
  });
  await signIn(page, "Neha Verma");
  await page.getByTestId("sparkles-card").click();
  await page.getByRole("button", { name: /Collect \+10/ }).click();
  await expect(page.getByTestId("next-collect")).toBeVisible();
  expect(errors).toEqual([]);
});

test("full storage when sending feedback shows a clear message", async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("full", "QuotaExceededError"); }; });
  await page.goto("/feedback/");
  await page.getByLabel("Your feedback or suggestion").fill("hello");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "couldn't save" })).toBeVisible();
});

test("text that looks like code is shown as text, never run", async ({ page }) => {
  let ran = false;
  page.on("dialog", async (d) => { ran = true; await d.dismiss(); });
  await signIn(page, "Neha Verma");
  await page.goto("/profile/");
  await page.getByRole("button", { name: "Edit profile" }).click();
  await page.getByLabel("Your name").fill("<img src=x onerror=alert(1)>");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("profile-name")).toHaveText("<img src=x onerror=alert(1)>");
  await page.waitForTimeout(300);
  expect(ran).toBe(false);
});

test("an unknown address shows the DILO 'page not found' with a way back", async ({ page }) => {
  const r = await page.goto("/no-such-page/");
  expect(r?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "This page isn't here" })).toBeVisible();
  await page.getByRole("link", { name: "About DILO" }).click();
  await expect(page).toHaveURL(/\/welcome\/$/);
});
