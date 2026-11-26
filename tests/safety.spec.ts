import { expect, test, type Page } from "@playwright/test";

const fullName: Record<string, string> = { Priya: "Priya Sharma", Amit: "Amit Sharma", Neha: "Neha Verma", Ravi: "Ravi Kumar", Admin: "DILO Admin" };
const tab = (page: Page, name: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${name}$`) });
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==", "base64");

async function signInAs(page: Page, name: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}
async function switchTo(page: Page, name: string) {
  await tab(page, "Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

test("edit profile: name required, name + intro + photo saved", async ({ page }) => {
  await signInAs(page, "Neha");
  await tab(page, "Profile").click();
  await page.getByRole("button", { name: "Edit profile" }).click();
  await page.getByLabel("Your name").fill("");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "enter your name" })).toBeVisible();
  await page.getByLabel("Your name").fill("Neha V. Sharma");
  await page.getByLabel("Short intro (optional)").fill("Loves planning surprises.");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("profile-name")).toHaveText("Neha V. Sharma");
  await expect(page.getByTestId("profile-bio")).toHaveText("Loves planning surprises.");
  const chooser = page.waitForEvent("filechooser");
  await page.getByLabel("Change profile photo", { exact: true }).click();
  await (await chooser).setFiles({ name: "me.png", mimeType: "image/png", buffer: PNG });
  await expect(page.getByTestId("avatar-photo").first()).toBeVisible();
  // the new name shows to others too
  await switchTo(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await expect(page.getByText("Neha V. Sharma").first()).toBeVisible();
});

test("privacy: anonymous by default pre-ticks the contribution form", async ({ page }) => {
  await signInAs(page, "Neha");
  await tab(page, "Profile").click();
  await page.getByRole("link", { name: "Privacy & safety" }).click();
  await page.getByRole("switch").check();
  await tab(page, "Home").click();
  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).click();
  await page.getByRole("button", { name: "Record a contribution" }).click();
  await expect(page.getByTestId("contribution-form").getByRole("checkbox")).toBeChecked();
});

test("download my data gives a JSON file with my profile", async ({ page }) => {
  await signInAs(page, "Neha");
  await tab(page, "Profile").click();
  await page.getByRole("link", { name: "Privacy & safety" }).click();
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download my data" }).click();
  const file = await dl;
  expect(file.suggestedFilename()).toBe("dilo-my-data.json");
  const json = JSON.parse(await (await file.createReadStream()).toArray().then((b) => Buffer.concat(b).toString()));
  expect(json.profile.name).toBe("Neha Verma");
  expect(json.communities.length).toBe(2);
});

test("delete account: blocked for a last owner, works for others", async ({ page }) => {
  await signInAs(page, "Priya");
  await tab(page, "Profile").click();
  await page.getByRole("link", { name: "Privacy & safety" }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete my account" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "only owner of Sharma Family" })).toBeVisible();
  await switchTo(page, "Amit");
  await tab(page, "Profile").click();
  await page.getByRole("link", { name: "Privacy & safety" }).click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Delete my account" }).click();
  await expect(page).toHaveURL(/\/welcome\/\?deleted=1$/);
  await expect(page.getByTestId("account-deleted")).toBeVisible();
});

test("report a record → moderator removes it → reporter is told", async ({ page }) => {
  await signInAs(page, "Neha");
  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).click();
  const vikram = page.getByTestId("contribution").filter({ hasText: "Vikram Chacha" });
  await vikram.getByRole("button", { name: "Report" }).click();
  await page.getByRole("button", { name: "Send report" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "choose a reason" })).toBeVisible();
  await page.getByLabel("Fake or wrong record").check();
  await page.getByRole("button", { name: "Send report" }).click();
  await expect(page.getByRole("status").filter({ hasText: "moderators will review" })).toBeVisible();

  await page.getByRole("link", { name: "Sharma Family", exact: true }).click();
  await switchTo(page, "Amit");
  await tab(page, "Profile").click();
  await page.getByRole("link", { name: "Moderation" }).click();
  const r = page.getByTestId("report").filter({ hasText: "₹11,000" }).first();
  await expect(r).toBeVisible();
  await r.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Removed" })).toBeVisible();

  await switchTo(page, "Neha");
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").first()).toContainText("The content was removed");
  await tab(page, "Home").click();
  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).click();
  await expect(page.getByTestId("contribution").filter({ hasText: "Vikram Chacha" })).toHaveCount(0);
});

test("block hides their messages from me; unblock from settings", async ({ page }) => {
  await signInAs(page, "Neha");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await page.getByRole("link", { name: "See all" }).click();
  await page.getByTestId("member").filter({ hasText: "Amit Sharma" }).getByRole("button", { name: "Block" }).click();
  await tab(page, "Home").click();
  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).click();
  await expect(page.getByText("Blessings to Anjali!")).toHaveCount(0);
  await page.getByRole("link", { name: "Sharma Family", exact: true }).click();
  await tab(page, "Profile").click();
  await page.getByRole("link", { name: "Privacy & safety" }).click();
  await expect(page.getByTestId("blocked")).toContainText("Amit Sharma");
  await page.getByRole("button", { name: "Unblock" }).click();
  await expect(page.getByTestId("blocked")).toHaveCount(0);
});

test("platform admin: totals and reports only, can't open private communities, can suspend", async ({ page }) => {
  await signInAs(page, "Admin");
  await page.getByTestId("admin-card").click();
  await expect(page.getByTestId("admin-stats")).toContainText("Communities");
  await expect(page.getByTestId("admin-report").first()).toContainText("Anjali's Wedding (₹11,000)");
  // no private content on the admin page
  await expect(page.getByText("I don't think this was given.")).toHaveCount(0);
  await expect(page.getByText("Wedding photography")).toHaveCount(0);
  await page.goto("/community/?id=sharma-family");
  await expect(page.getByTestId("private-wall")).toBeVisible();
  await page.goBack();
  page.once("dialog", (d) => d.accept());
  await page.getByTestId("admin-community").filter({ hasText: "Sharma Family" }).getByRole("button", { name: "Suspend" }).click();
  await expect(page.getByTestId("admin-community").filter({ hasText: "Sharma Family" })).toContainText("Suspended");
  await switchTo(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await expect(page.getByTestId("suspended-wall")).toBeVisible();
});

test("the admin page is closed to everyone else", async ({ page }) => {
  await signInAs(page, "Priya");
  await page.goto("/admin/");
  await expect(page.getByTestId("admin-only")).toBeVisible();
  await expect(page.getByTestId("admin-stats")).toHaveCount(0);
});

test("new screens: banner, no side-scroll, 44 px tap targets", async ({ page }) => {
  await signInAs(page, "Priya");
  for (const path of ["/profile/", "/settings/", "/moderation/"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("status").first()).toContainText("DEMO DATA");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    const small = await page.locator("main a, main button, nav a").evaluateAll((els) =>
      els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim() || e.getAttribute("aria-label")),
    );
    expect(small, path).toEqual([]);
  }
});
