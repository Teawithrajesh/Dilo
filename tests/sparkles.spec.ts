import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page, full: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${full}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}
const at = (d: string) => new Date(`${d}T10:00:00`);
async function newDay(page: Page, d: string) {
  await page.clock.setSystemTime(at(d));
  await page.reload();
}
async function collect(page: Page, amount: number) {
  await page.getByRole("button", { name: `Collect +${amount} Sparkles` }).click();
  await page.clock.runFor(2000); // let the count-up finish
}
const balance = (page: Page) => page.getByTestId("sparkle-balance");

test("Home nudges you; collect today's Sparkles; then a countdown to tomorrow", async ({ page }) => {
  await page.clock.install({ time: at("2026-12-01") });
  await signIn(page, "Neha Verma");
  await expect(page.getByTestId("sparkles-card")).toContainText("Collect today's +10 Sparkles");
  await page.getByTestId("sparkles-card").click();
  await expect(page).toHaveURL(/\/sparkles\/$/);
  await expect(balance(page)).toHaveText("0");
  await expect(page.getByTestId("day-1")).toHaveAttribute("data-state", "today");
  await collect(page, 10);
  await expect(balance(page)).toHaveText("10");
  await expect(page.getByTestId("day-1")).toHaveAttribute("data-state", "done");
  await expect(page.getByTestId("next-collect")).toContainText(/Next Sparkles in (13:59:\d\d|14:00:00)/);
  await expect(page.getByRole("button", { name: /Collect \+/ })).toHaveCount(0);
  await expect(page.getByTestId("sparkles-chip")).toContainText("10");
});

test("come back the next day: Day 2 gives +20; it's saved after a refresh", async ({ page }) => {
  await page.clock.install({ time: at("2026-12-01") });
  await signIn(page, "Neha Verma");
  await page.goto("/sparkles/");
  await collect(page, 10);
  await newDay(page, "2026-12-02");
  await expect(balance(page)).toHaveText("10");
  await expect(page.getByTestId("day-2")).toHaveAttribute("data-state", "today");
  await collect(page, 20);
  await expect(balance(page)).toHaveText("30");
  await page.getByRole("tab", { name: "History" }).click();
  await expect(page.getByTestId("sparkle-history")).toContainText("Day 2 of 7");
});

test("miss a day and the streak starts again at Day 1", async ({ page }) => {
  await page.clock.install({ time: at("2026-12-01") });
  await signIn(page, "Neha Verma");
  await page.goto("/sparkles/");
  await collect(page, 10);
  await newDay(page, "2026-12-03");
  await expect(page.getByTestId("streak-reset")).toBeVisible();
  await expect(page.getByTestId("day-1")).toHaveAttribute("data-state", "today");
  await collect(page, 10);
  await expect(balance(page)).toHaveText("20");
});

test("a full week ends with the +100 Day 7 bonus, then a new week begins", async ({ page }) => {
  await page.clock.install({ time: at("2026-12-01") });
  await signIn(page, "Neha Verma");
  await page.goto("/sparkles/");
  const rewards = [10, 20, 30, 40, 50, 60, 100];
  for (let i = 0; i < 7; i++) {
    if (i > 0) await newDay(page, `2026-12-0${i + 1}`);
    await collect(page, rewards[i]);
  }
  await expect(balance(page)).toHaveText("310");
  await newDay(page, "2026-12-08");
  await expect(page.getByTestId("streak-reset")).toHaveCount(0);
  await expect(page.getByTestId("day-1")).toHaveAttribute("data-state", "today");
  await expect(page.getByRole("button", { name: "Collect +10 Sparkles" })).toBeVisible();
});

test("demo: Priya is on a 3-day streak, so today is Day 4 (+40)", async ({ page }) => {
  await signIn(page, "Priya Sharma");
  await expect(page.getByTestId("sparkles-card")).toContainText("+40");
  await page.goto("/sparkles/");
  await expect(balance(page)).toHaveText("1,240");
  for (const d of [1, 2, 3]) await expect(page.getByTestId(`day-${d}`)).toHaveAttribute("data-state", "done");
  await expect(page.getByTestId("day-4")).toHaveAttribute("data-state", "today");
});

test("no promises about what Sparkles are for; clearly not money", async ({ page }) => {
  await signIn(page, "Neha Verma");
  await page.goto("/sparkles/");
  await expect(page.getByTestId("sparkles-coming")).toContainText("Something special is on its way");
  await expect(page.getByText("Sparkles aren't money")).toBeVisible();
  const text = (await page.locator("main").innerText()).toLowerCase();
  for (const word of ["redeem", "cash", "rupee", "₹", "coupon", "discount"]) expect(text).not.toContain(word);
});

test("the admin has no Sparkles", async ({ page }) => {
  await signIn(page, "DILO Admin");
  await expect(page.getByTestId("sparkles-card")).toHaveCount(0);
  await expect(page.getByTestId("sparkles-chip")).toHaveCount(0);
});

test("sparkles page: no side-scroll, 44 px targets", async ({ page }) => {
  await signIn(page, "Neha Verma");
  await page.goto("/sparkles/");
  await expect(balance(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const small = await page.locator("main a, main button, header a").evaluateAll((els) =>
    els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim()),
  );
  expect(small).toEqual([]);
});
