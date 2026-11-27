import { expect, test } from "@playwright/test";

test("landing and sign-in lead to early access", async ({ page }) => {
  await page.goto("/welcome/");
  await page.getByRole("link", { name: "Get early access" }).click();
  await expect(page).toHaveURL(/\/early-access\/$/);
  await page.goto("/signin/");
  await page.getByTestId("early-access-cta").click();
  await expect(page).toHaveURL(/\/early-access\/$/);
});

test("join the list: valid email and consent are required; duplicates are recognised", async ({ page }) => {
  await page.goto("/early-access/");
  const join = page.getByRole("button", { name: "Join the early-access list" });
  await join.click();
  await expect(page.getByRole("alert").filter({ hasText: "valid email" })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("not-an-email");
  await join.click();
  await expect(page.getByRole("alert").filter({ hasText: "valid email" })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill("Sunita@Example.com");
  await join.click();
  await expect(page.getByRole("alert").filter({ hasText: "tick the box" })).toBeVisible();
  await page.getByLabel("Name (optional)").fill("Sunita");
  await page.getByLabel("City (optional)").fill("Jaipur");
  await page.getByRole("checkbox").check();
  await join.click();
  await expect(page.getByTestId("early-access-done")).toContainText("You're on the list!");

  await page.reload();
  await page.getByLabel("Email", { exact: true }).fill("sunita@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Join the early-access list" }).click();
  await expect(page.getByTestId("early-access-done")).toContainText("already on the list");
});

test("privacy notice explains what, why, where, how long and your rights", async ({ page }) => {
  await page.goto("/early-access/");
  await page.getByRole("link", { name: "Privacy notice" }).click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  for (const h of ["What we collect, and why", "Where it's kept and who can see it", "How long", "Your choices", "Age"]) {
    await expect(page.getByRole("heading", { name: h })).toBeVisible();
  }
  await expect(page.getByText("Digital Personal Data Protection Act, 2023")).toBeVisible();
  const mail = page.getByRole("link", { name: "hello@dilowish.com" });
  await expect(mail).toHaveAttribute("href", "mailto:hello@dilowish.com");
});

test("the demo is kept out of search engines", async ({ request }) => {
  const html = await (await request.get("/welcome/")).text();
  expect(html).toContain('<meta name="robots" content="noindex, nofollow"/>');
});

test("early access + privacy: banner, no side-scroll, 44 px targets", async ({ page }) => {
  for (const path of ["/early-access/", "/privacy/"]) {
    await page.goto(path);
    await expect(page.getByRole("status").first()).toContainText("DEMO DATA");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    const small = await page.locator("main a, main button").evaluateAll((els) =>
      els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44 && !e.closest("p, li, span"); }).map((e) => e.textContent?.trim()),
    );
    expect(small, path).toEqual([]);
  }
});
