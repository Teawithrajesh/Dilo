import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Automated accessibility check (WCAG 2.1 A/AA rules) on the main screens.
// Fails on "serious" or "critical" problems. TalkBack itself still needs a check on a real phone.

async function signInAsPriya(page: Page) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: /^Priya Sharma/ }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

async function audit(page: Page, name: string) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(bad.map((v) => `${name}: ${v.id} — ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target.join(" ")}`)).toEqual([]);
}

test("public screens", async ({ page }) => {
  for (const path of ["/", "/welcome/", "/signin/", "/celebrate/wedding/", "/join/?code=SHARMA7Q", "/feedback/"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await audit(page, path);
  }
});

test("signed-in screens", async ({ page }) => {
  await signInAsPriya(page);
  for (const path of ["/home/", "/communities/", "/community/?id=sharma-family", "/community/members/?id=sharma-family", "/community/invite/?id=sharma-family", "/event/?id=anjali-wedding", "/notifications/", "/profile/", "/settings/", "/moderation/", "/communities/new/", "/letter/"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("main")).toBeVisible();
    await audit(page, path);
  }
});
