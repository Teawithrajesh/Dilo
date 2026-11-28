import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The first-visit guided tour. These tests start as brand-new visitors (nothing remembered on the device).
test.use({ storageState: { cookies: [], origins: [] } });

async function signInAs(page: Page, full: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${full}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}
const card = (page: Page) => page.getByRole("dialog");
const title = (page: Page) => page.locator("#tour-title");
const count = (page: Page) => page.getByTestId("tour-count");
const next = (page: Page) => card(page).getByRole("button", { name: /^(Show me around|Next|Finish)$/ });

test("a new person gets the home tour once; it walks through the whole app and is remembered", async ({ page }) => {
  await signInAs(page, "Priya Sharma");
  await expect(card(page)).toBeVisible();
  await expect(card(page)).toHaveAttribute("aria-modal", "true");
  await expect(title(page)).toHaveText("Welcome to DILO, Priya!");
  await expect(count(page)).toHaveText("1 of 9");
  await expect(page.getByText("DEMO DATA · Prototype only, nothing is saved")).toBeVisible();

  const titles: string[] = [];
  for (let k = 0; k < 9; k++) {
    titles.push((await title(page).textContent()) ?? "");
    if (k > 0) await expect(page.getByTestId("tour-spotlight")).toBeVisible();
    await next(page).click();
  }
  expect(titles).toEqual([
    "Welcome to DILO, Priya!", "Daily Sparkles", "Dreams that came true", "Your communities", "Start your own community",
    "Upcoming celebrations", "Communities tab", "Notifications", "Your profile",
  ]);
  await expect(page.getByTestId("tour")).toHaveCount(0);

  // the page works normally afterwards, and the tour doesn't come back
  await page.getByRole("navigation", { name: "App" }).getByRole("link", { name: /Communities$/ }).click();
  await expect(page).toHaveURL(/\/communities\/$/);
  await page.goto("/home/");
  await page.waitForTimeout(1200);
  await expect(page.getByTestId("tour")).toHaveCount(0);
});

test("the highlight sits on the right thing, and Back goes back", async ({ page }) => {
  await signInAs(page, "Priya Sharma");
  await next(page).click(); // → Daily Sparkles
  await expect(title(page)).toHaveText("Daily Sparkles");
  await page.waitForTimeout(800);
  const spot = await page.getByTestId("tour-spotlight").boundingBox();
  const target = await page.getByTestId("sparkles-card").boundingBox();
  expect(spot && target).toBeTruthy();
  expect(Math.abs(spot!.x + spot!.width / 2 - (target!.x + target!.width / 2))).toBeLessThan(3);
  expect(Math.abs(spot!.y + spot!.height / 2 - (target!.y + target!.height / 2))).toBeLessThan(3);
  await card(page).getByRole("button", { name: "Back" }).click();
  await expect(title(page)).toHaveText("Welcome to DILO, Priya!");
  await expect(card(page).getByRole("button", { name: "Back" })).toHaveCount(0);
});

test("Skip, Esc and the keyboard: the tour ends and stays ended", async ({ page }) => {
  await signInAs(page, "Priya Sharma");
  await expect(next(page)).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(count(page)).toHaveText("2 of 9");
  await page.keyboard.press("ArrowLeft");
  await expect(count(page)).toHaveText("1 of 9");
  // Tab stays inside the card
  for (let k = 0; k < 4; k++) await page.keyboard.press("Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("tour")).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(1200);
  await expect(page.getByTestId("tour")).toHaveCount(0);

  // Skip works too, for another person; each person has their own tour
  await page.goto("/profile/");
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: /^Neha Verma/ }).click();
  await expect(card(page)).toBeVisible();
  await expect(title(page)).toHaveText("Welcome to DILO, Neha!");
  await card(page).getByRole("button", { name: "Skip tour" }).click();
  await expect(page.getByTestId("tour")).toHaveCount(0);
});

test("steps that aren't on the page are skipped (the admin has no Sparkles or communities)", async ({ page }) => {
  await signInAs(page, "DILO Admin");
  await expect(card(page)).toBeVisible();
  const seen: string[] = [];
  for (let k = 0; k < 12 && (await page.getByTestId("tour").count()); k++) {
    seen.push((await title(page).textContent()) ?? "");
    await next(page).click();
  }
  await expect(page.getByTestId("tour")).toHaveCount(0);
  expect(seen).not.toContain("Daily Sparkles");
  expect(seen[0]).toBe("Welcome to DILO, Admin!");
  expect(seen.at(-1)).toBe("Your profile");
});

test("first visit to a celebration shows the celebration tour", async ({ page }) => {
  await signInAs(page, "Neha Verma");
  await card(page).getByRole("button", { name: "Skip tour" }).click();
  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).first().click();
  await expect(page).toHaveURL(/\/event\/\?id=anjali-wedding$/);
  await expect(card(page)).toBeVisible();
  const titles: string[] = [];
  for (let k = 0; k < 4; k++) {
    await expect(count(page)).toHaveText(`${k + 1} of 4`);
    titles.push((await title(page).textContent()) ?? "");
    await next(page).click();
  }
  expect(titles).toEqual(["How close is the dream?", "The dream wish", "Wishlist", "Record your contribution"]);
  await expect(page.getByTestId("tour")).toHaveCount(0);
  // and it doesn't repeat on another celebration
  await page.goto("/event/?id=dadi-birthday");
  await page.waitForTimeout(1200);
  await expect(page.getByTestId("tour")).toHaveCount(0);
});

test("Profile → Take the app tour starts it again", async ({ page }) => {
  await signInAs(page, "Priya Sharma");
  await card(page).getByRole("button", { name: "Skip tour" }).click();
  await page.goto("/profile/");
  await page.getByRole("button", { name: /Take the app tour/ }).click();
  await expect(page).toHaveURL(/\/home\/$/);
  await expect(card(page)).toBeVisible();
  await expect(count(page)).toHaveText("1 of 9");
});

test("tour card: fits the screen, 44 px buttons, no accessibility problems", async ({ page }) => {
  await signInAs(page, "Priya Sharma");
  const vw = page.viewportSize()!.width, vh = page.viewportSize()!.height;
  for (let k = 0; k < 9; k++) {
    await page.waitForTimeout(450);
    const b = (await card(page).boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(vw + 0.5);
    expect(b.y).toBeGreaterThanOrEqual(0);
    expect(b.y + b.height).toBeLessThanOrEqual(vh + 0.5);
    for (const btn of await card(page).getByRole("button").all()) expect((await btn.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    if (k === 1) {
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes[0]?.target.join(" ")}`)).toEqual([]);
    }
    await next(page).click();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
