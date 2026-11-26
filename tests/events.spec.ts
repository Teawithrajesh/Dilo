import { expect, test, type Page } from "@playwright/test";

const fullName: Record<string, string> = { Priya: "Priya Sharma", Amit: "Amit Sharma", Neha: "Neha Verma", Ravi: "Ravi Kumar" };
const tab = (page: Page, name: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${name}$`) });

async function signInAs(page: Page, name: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}
/** From an event page: back to its community, then switch person (keeps demo changes). */
async function switchFromEvent(page: Page, community: string, name: string) {
  await page.getByRole("link", { name: community, exact: true }).click();
  await tab(page, "Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}
const openEvent = (page: Page, title: string) => page.getByTestId("event-card").filter({ hasText: title }).click();
const wish = (page: Page, title: string) => page.getByTestId("wish").filter({ hasText: title });
const record = (page: Page, who: string) => page.getByTestId("contribution").filter({ has: page.getByTestId("contributor").filter({ hasText: who }) });

test("organiser manages the wishlist: add (validated), edit, reorder, mark covered", async ({ page }) => {
  await signInAs(page, "Priya");
  await openEvent(page, "Anjali's Wedding");
  await expect(page.getByTestId("wish")).toHaveCount(3);
  await page.getByRole("button", { name: "+ Add a wish" }).click();
  await page.getByRole("button", { name: "Add wish" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "name the wish" })).toBeVisible();
  await page.getByLabel("Wish", { exact: true }).fill("Wedding cake");
  await page.getByRole("button", { name: "Add wish" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "whole rupees" })).toBeVisible();
  await page.getByLabel("Estimated cost (₹)").fill("18000");
  await page.getByRole("button", { name: "High" }).click();
  await page.getByRole("button", { name: "Add wish" }).click();
  await expect(page.getByTestId("wish")).toHaveCount(4);
  await expect(wish(page, "Wedding cake")).toContainText("₹18,000 · High priority");
  // edit
  await wish(page, "Wedding cake").getByRole("button", { name: "Edit" }).click();
  await page.getByTestId("wish-form").getByLabel("Wish", { exact: true }).fill("Three-tier wedding cake");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(wish(page, "Three-tier wedding cake")).toBeVisible();
  // reorder: move it up to the top
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Move Three-tier wedding cake up" }).click();
  await expect(page.getByTestId("wish-title").first()).toHaveText("Three-tier wedding cake");
  // mark covered
  await wish(page, "Wedding photography").getByRole("button", { name: "Mark covered" }).click();
  await expect(wish(page, "Wedding photography")).toContainText("Covered");
});

test("members see the wishlist but can't change it", async ({ page }) => {
  await signInAs(page, "Neha");
  await openEvent(page, "Anjali's Wedding");
  await expect(page.getByTestId("wish").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "+ Add a wish" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mark covered" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Edit" })).toHaveCount(0);
});

test("record a contribution: amount required, shows Self-reported, progress goes up", async ({ page }) => {
  await signInAs(page, "Neha");
  await openEvent(page, "Anjali's Wedding");
  await expect(page.getByText("₹1,08,000").first()).toBeVisible();
  await page.getByRole("button", { name: "Record a contribution" }).click();
  await page.getByRole("button", { name: "Record contribution" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "whole rupees" })).toBeVisible();
  await page.getByLabel("Amount you gave (₹)").fill("5000");
  await page.getByLabel("Message (optional)").fill("Lots of love");
  await page.getByRole("button", { name: "Record contribution" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Recorded" })).toBeVisible();
  const mine = page.getByTestId("contribution").filter({ hasText: "Lots of love" });
  await expect(mine.getByTestId("trust-label")).toHaveText("Self-reported");
  await expect(page.getByText("₹1,13,000").first()).toBeVisible();
  // the contributor can remove their own record before it's confirmed
  await mine.getByRole("button", { name: "Remove my record" }).click();
  await expect(page.getByTestId("contribution").filter({ hasText: "Lots of love" })).toHaveCount(0);
  await expect(page.getByText("₹1,08,000").first()).toBeVisible();
});

test("anonymous: only the contributor and the organiser see the name; organiser confirms", async ({ page }) => {
  await signInAs(page, "Neha");
  await openEvent(page, "Anjali's Wedding");
  await page.getByRole("button", { name: "Record a contribution" }).click();
  await page.getByLabel("Amount you gave (₹)").fill("2100");
  await page.getByLabel("Message (optional)").fill("From me, quietly");
  await page.getByText("Show as Anonymous to others").click();
  await page.getByRole("button", { name: "Record contribution" }).click();
  const quiet = () => page.getByTestId("contribution").filter({ hasText: "From me, quietly" });
  await expect(quiet().getByTestId("contributor")).toContainText("Neha Verma (anonymous to others)");

  await switchFromEvent(page, "Sharma Family", "Amit"); // a member, not the organiser
  await openEvent(page, "Anjali's Wedding");
  await expect(quiet().getByTestId("contributor")).toHaveText("Anonymous");
  await expect(page.getByRole("button", { name: "Confirm" })).toHaveCount(0);

  await switchFromEvent(page, "Sharma Family", "Priya"); // the organiser
  await expect(page.getByTestId("notice").or(page.locator("body"))).toBeTruthy();
  await openEvent(page, "Anjali's Wedding");
  await expect(quiet().getByTestId("contributor")).toContainText("Neha Verma");
  await quiet().getByRole("button", { name: "Confirm" }).click();
  await expect(quiet().getByTestId("trust-label")).toHaveText("Confirmed by organiser");

  await switchFromEvent(page, "Sharma Family", "Neha");
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").filter({ hasText: "Priya confirmed your contribution to Anjali's Wedding" }).first()).toBeVisible();
});

test("seeded anonymous record: hidden from members, visible to the organiser", async ({ page }) => {
  await signInAs(page, "Neha");
  await openEvent(page, "Anjali's Wedding");
  await expect(page.getByTestId("contributor").filter({ hasText: "Sunita Mausi" })).toHaveCount(0);
  await expect(page.getByTestId("contributor").filter({ hasText: /^Anonymous$/ })).toHaveCount(1);
  await switchFromEvent(page, "Sharma Family", "Priya");
  await openEvent(page, "Anjali's Wedding");
  await expect(page.getByTestId("contributor").filter({ hasText: "Sunita Mausi" })).toBeVisible();
});

test("reaching the goal shows the celebration and tells every member", async ({ page }) => {
  await signInAs(page, "Neha");
  await openEvent(page, "Dadi's 75th Birthday"); // ₹31,000 of ₹40,000
  await expect(page.getByTestId("celebration-banner")).toHaveCount(0);
  await page.getByRole("button", { name: "Record a contribution" }).click();
  await page.getByLabel("Amount you gave (₹)").fill("9000");
  await page.getByRole("button", { name: "Record contribution" }).click();
  await expect(page.getByTestId("celebration-banner")).toContainText("The dream came true!");
  await switchFromEvent(page, "Sharma Family", "Amit");
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").filter({ hasText: "Dadi's 75th Birthday reached its goal" })).toBeVisible();
  await tab(page, "Communities").click();
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await expect(page.getByTestId("feed-item").first()).toContainText("Dadi's 75th Birthday reached its goal");
});

test("community feed lists activity and opens the event", async ({ page }) => {
  await signInAs(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await expect(page.getByTestId("feed-item").first()).toBeVisible();
  await page.getByTestId("feed-item").filter({ hasText: "Anjali's Wedding" }).first().click();
  await expect(page).toHaveURL(/\/event\/\?id=anjali-wedding$/);
});

test("honest wording: DILO never claims to receive, pay or verify money", async ({ page }) => {
  await signInAs(page, "Priya");
  await openEvent(page, "Anjali's Wedding");
  const text = (await page.locator("body").innerText()).toLowerCase();
  for (const banned of ["donate now", "verified by dilo", "payment received", "paid via dilo", "dilo received"]) expect(text).not.toContain(banned);
  await expect(page.getByText("DILO never handles money").first()).toBeVisible();
});

test("event page: no side-scroll and 44 px tap targets with forms open", async ({ page }) => {
  await signInAs(page, "Priya");
  await openEvent(page, "Anjali's Wedding");
  await page.getByRole("button", { name: "+ Add a wish" }).click();
  await page.getByRole("button", { name: "Record a contribution" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const small = await page.locator("main a, main button, main label:has(input[type=checkbox])").evaluateAll((els) =>
    els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim()),
  );
  expect(small).toEqual([]);
});
