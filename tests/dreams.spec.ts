import { expect, test, type Page } from "@playwright/test";

const tab = (page: Page, name: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${name}$`) });
async function signInAs(page: Page, full: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${full}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}
const title = (page: Page) => page.getByTestId("dream-title");

test("Home shows dreams that came true, newest first, and the card opens the event", async ({ page }) => {
  await signInAs(page, "Priya Sharma");
  await expect(page.getByTestId("dreams-spotlight")).toBeVisible();
  await expect(title(page)).toHaveText("Mehendi decor");
  await expect(page.getByTestId("dream-card")).toContainText("Anjali's Wedding · Sharma Family");
  await page.getByTestId("dream-card").click();
  await expect(page).toHaveURL(/\/event\/\?id=anjali-wedding$/);
});

test("it moves to the next dream every few seconds, and Pause stops it", async ({ page }) => {
  await page.clock.install();
  await signInAs(page, "Priya Sharma");
  await expect(title(page)).toHaveText("Mehendi decor");
  await page.clock.fastForward(4100);
  await expect(title(page)).toHaveText("Reading glasses");
  await page.getByRole("button", { name: "Pause the dreams slideshow" }).click();
  await page.clock.fastForward(9000);
  await expect(title(page)).toHaveText("Reading glasses");
  await page.getByRole("button", { name: "Play the dreams slideshow" }).click();
  await page.clock.fastForward(4100);
  await expect(title(page)).toHaveText("Mehendi decor");
});

test("with reduced motion it stays still and needs no pause button", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await signInAs(page, "Priya Sharma");
  await expect(page.getByRole("button", { name: /dreams slideshow/ })).toHaveCount(0);
  await page.clock.fastForward(9000);
  await expect(title(page)).toHaveText("Mehendi decor");
});

test("only my communities' dreams: a newcomer sees none", async ({ page }) => {
  await signInAs(page, "Ravi Kumar");
  await expect(page.getByTestId("dreams-spotlight")).toHaveCount(0);
});

test("a wish marked covered flashes to the front", async ({ page }) => {
  await signInAs(page, "Priya Sharma");
  await page.getByTestId("event-card").filter({ hasText: "Anjali's Wedding" }).click();
  await page.getByTestId("wish").filter({ hasText: "Wedding photography" }).getByRole("button", { name: "Mark covered" }).click();
  await page.getByRole("link", { name: "Sharma Family", exact: true }).click();
  await tab(page, "Home").click();
  await expect(title(page)).toHaveText("Wedding photography");
});

test("a reached goal shows as 'Goal reached'", async ({ page }) => {
  await signInAs(page, "Neha Verma");
  await page.getByTestId("event-card").filter({ hasText: "Dadi's 75th Birthday" }).click();
  await page.getByRole("button", { name: "Record a contribution" }).click();
  await page.getByLabel("Amount you gave (₹)").fill("9000");
  await page.getByRole("button", { name: "Record contribution" }).click();
  await page.getByRole("link", { name: "Sharma Family", exact: true }).click();
  await tab(page, "Home").click();
  await expect(page.getByTestId("dream-card")).toContainText("Goal reached");
  await expect(page.getByTestId("dream-card")).toContainText("Dadi's 75th Birthday");
});
