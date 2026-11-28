import { expect, test } from "@playwright/test";

test("the splash logo pieces all load and finish in under 3 seconds", async ({ page }) => {
  await page.goto("/");
  const imgs = page.locator('[role=img][aria-label="DILO"] img');
  await expect(imgs).toHaveCount(5);
  expect(await imgs.evaluateAll((els) => els.every((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0))).toBe(true);
  const longest = await page.evaluate(() =>
    Math.max(...document.getAnimations().filter((a) => (a as CSSAnimation).animationName?.startsWith("logo-")).map((a) => {
      const t = a.effect!.getComputedTiming();
      return Number(t.delay) + Number(t.duration);
    })),
  );
  expect(longest).toBeLessThanOrEqual(3000);
});

test("the O can be pressed straight away, even while the logo is still animating", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Enter DILO" }).click({ force: true, timeout: 1000 });
  await expect(page).toHaveURL(/\/welcome\/$/);
});

test("with reduced motion the full logo shows at once (no intro)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const running = await page.evaluate(() => document.getAnimations().filter((a) => (a as CSSAnimation).animationName?.startsWith("logo-")).length);
  expect(running).toBe(0);
  const opacities = await page.locator('[role=img][aria-label="DILO"] img').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(opacities.every((o) => o === "1")).toBe(true);
});

test("the 'Press the O' hint uses the O's pink→orange colours", async ({ page }) => {
  await page.goto("/");
  const hint = page.getByTestId("press-hint");
  await expect(hint).toHaveText(/Press the O to begin/i);
  const style = await hint.locator("span").first().evaluate((el) => { const s = getComputedStyle(el); return { bg: s.backgroundImage, clip: s.backgroundClip || s.webkitBackgroundClip, color: s.color }; });
  expect(style.bg).toContain("linear-gradient");
  expect(style.bg).toContain("rgb(255, 79, 143)");
  expect(style.bg).toContain("rgb(254, 143, 2)");
  expect(style.clip).toBe("text");
});
