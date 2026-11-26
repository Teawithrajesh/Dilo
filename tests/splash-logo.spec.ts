import { expect, test } from "@playwright/test";

test("the splash logo pieces all load and finish in under 2 seconds", async ({ page }) => {
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
  expect(longest).toBeLessThanOrEqual(2000);
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
