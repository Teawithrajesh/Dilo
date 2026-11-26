import { expect, test, type Page } from "@playwright/test";

async function noHorizontalScroll(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.describe("splash", () => {
  test("pressing the O while it gently moves still opens the app", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Enter DILO" }).click({ force: true });
    await expect(page).toHaveURL(/\/welcome\/$/);
  });

  test("tapping the O opens the landing page", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" }); // no breathing animation
    await page.goto("/");
    await expect(page.getByRole("status")).toContainText("DEMO DATA");
    await page.getByRole("link", { name: "Enter DILO" }).click();
    // the O sinks, a chime plays, then the app opens (~260 ms)
    await expect(page).toHaveURL(/\/welcome\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("ordinary gifts");
  });

  test("the O hotspot sits over the O, not the symbol", async ({ page }) => {
    await page.goto("/");
    const logo = await page.getByRole("img", { name: "DILO" }).boundingBox();
    const o = await page.getByRole("link", { name: "Enter DILO" }).boundingBox();
    expect(logo && o).toBeTruthy();
    // O is in the bottom-right part of the logo
    expect(o!.y).toBeGreaterThan(logo!.y + logo!.height * 0.6);
    expect(o!.x).toBeGreaterThan(logo!.x + logo!.width * 0.5);
  });
});

test.describe("landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/welcome/");
  });

  test("has the demo banner and no horizontal scroll", async ({ page }) => {
    await expect(page.getByRole("status")).toContainText("DEMO DATA");
    await noHorizontalScroll(page);
  });

  test("has all 10 sections", async ({ page }) => {
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("main > section")).toHaveCount(8);
    await expect(page.locator("footer")).toHaveCount(1);
  });

  test("Create Your Community goes to demo sign-in", async ({ page }) => {
    await page.getByRole("link", { name: "Create Your Community" }).first().click();
    await expect(page).toHaveURL(/\/signin\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Try DILO as…");
  });

  test("Discover How DILO Works scrolls to How it works", async ({ page }) => {
    await page.getByRole("link", { name: "Discover How DILO Works" }).click();
    await expect(page).toHaveURL(/#how$/);
    await expect(page.locator("#how h2")).toBeInViewport();
  });

  test("Join button goes to demo sign-in", async ({ page }) => {
    await page.getByRole("link", { name: "Join", exact: true }).click();
    await expect(page).toHaveURL(/\/signin\/$/);
  });

  test("every link points somewhere real", async ({ page, request }) => {
    const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    expect(hrefs.length).toBeGreaterThan(5);
    for (const href of new Set(hrefs)) {
      if (href.startsWith("#")) {
        await expect(page.locator(href), `anchor ${href}`).toHaveCount(1);
      } else {
        expect((await request.get(href)).status(), `link ${href}`).toBe(200);
      }
    }
  });

  test("FAQ items open and close", async ({ page }) => {
    const first = page.locator("#faq details").first();
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
    await first.locator("summary").click();
    await expect(first).not.toHaveAttribute("open", "");
  });

  test("visible tap targets are at least 44 px tall", async ({ page }) => {
    const small = await page.locator("a, button, summary").evaluateAll((els) =>
      els
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.height < 44;
        })
        .map((e) => e.textContent?.trim()),
    );
    expect(small).toEqual([]);
  });

  test("never claims DILO handles money", async ({ page }) => {
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["donate now", "verified by dilo", "payment received"]) {
      expect(text).not.toContain(banned);
    }
  });

  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});
