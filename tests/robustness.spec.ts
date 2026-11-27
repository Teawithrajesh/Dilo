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

// A finger can double-tap before the screen updates. Each action must happen once.
const doubleTap = (loc: import("@playwright/test").Locator) => loc.evaluate((el) => { (el as HTMLElement).click(); (el as HTMLElement).click(); });

test("double-tap safety: wish, contribution, invite, community, approve, feedback", async ({ page }) => {
  await signIn(page, "Priya Sharma");
  const tab = (n: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${n}$`) });

  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).click();
  await expect(page.getByTestId("wish")).toHaveCount(3);
  await page.getByRole("button", { name: "+ Add a wish" }).click();
  await page.getByLabel("Wish", { exact: true }).fill("Once only");
  await page.getByLabel("Estimated cost (₹)").fill("500");
  await doubleTap(page.getByRole("button", { name: "Add wish" }));
  await expect(page.getByTestId("wish")).toHaveCount(4);

  await expect(page.getByTestId("contribution")).toHaveCount(4);
  await page.getByRole("button", { name: "Record a contribution" }).click();
  await page.getByLabel("Amount you gave (₹)").fill("500");
  await doubleTap(page.getByRole("button", { name: "Record contribution" }));
  await expect(page.getByTestId("contribution")).toHaveCount(5);

  await page.getByRole("link", { name: "Sharma Family", exact: true }).click();
  await page.getByRole("link", { name: "Invite" }).click();
  await expect(page.getByTestId("invite-link")).toHaveCount(1);
  await doubleTap(page.getByRole("button", { name: "Create new invite link" }));
  await expect(page.getByTestId("invite-link")).toHaveCount(2);

  await tab("Communities").click();
  await expect(page.getByTestId("community-link")).toHaveCount(1);
  await page.getByRole("link", { name: "+ Create community" }).click();
  await page.getByLabel("Community name").fill("Only One");
  await doubleTap(page.getByRole("button", { name: "Create community" }));
  await page.waitForURL(/\/community\/\?id=only-one-/);
  await tab("Communities").click();
  await expect(page.getByTestId("community-link")).toHaveCount(2);

  // approve twice → one membership
  await tab("Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: /^Ravi Kumar/ }).click();
  await page.getByRole("button", { name: "Request to join" }).click();
  await tab("Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: /^Priya Sharma/ }).click();
  await page.getByTestId("community-link").filter({ hasText: "Sharma Family" }).click();
  await page.getByTestId("admin-panel").click();
  await doubleTap(page.getByRole("button", { name: "Approve" }));
  await expect(page.getByTestId("member").filter({ hasText: "Ravi Kumar" })).toHaveCount(1);
});

test("double-tap safety: feedback is saved once", async ({ page }) => {
  await page.goto("/feedback/");
  await page.getByLabel("Your feedback or suggestion").fill("once");
  await doubleTap(page.getByRole("button", { name: "Send feedback" }));
  await expect(page.getByTestId("feedback-thanks")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("dilo-feedback") || "[]").length)).toBe(1);
});

test("double-tap safety: marking a wish covered doesn't flip it back", async ({ page }) => {
  await signIn(page, "Priya Sharma");
  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).click();
  const w = page.getByTestId("wish").filter({ hasText: "Wedding photography" });
  await doubleTap(w.getByRole("button", { name: "Mark covered" }));
  await expect(w).toContainText("Covered");
});
