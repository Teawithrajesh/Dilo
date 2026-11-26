import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const tab = (page: Page, name: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${name}$`) });

test("a new member gets the founder's welcome letter and can read it in English or Hindi", async ({ page }) => {
  await page.goto("/signin/");
  await page.getByRole("button", { name: /^Neha Verma/ }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await tab(page, "Notifications").click();
  const notice = page.getByTestId("notice").filter({ hasText: "welcome letter" });
  await expect(notice).toHaveCount(1);
  await notice.getByRole("link").click();
  await expect(page).toHaveURL(/\/letter\/$/);
  await expect(page.getByTestId("letter-subject")).toHaveText("Welcome to DILO, Neha");
  await expect(page.getByTestId("letter")).toContainText("Hi Neha,");
  await expect(page.getByTestId("letter")).toContainText("went into a cupboard and stayed there");
  await expect(page.getByTestId("letter")).toContainText("DILO never touches your money");
  await page.getByRole("tab", { name: "हिंदी" }).click();
  await expect(page.getByTestId("letter")).toContainText("नमस्ते Neha जी,");
  await expect(page.getByTestId("letter")).toHaveAttribute("lang", "hi");
});

test("the letter is sent once per person, not on every sign-in", async ({ page }) => {
  await page.goto("/signin/");
  await page.getByRole("button", { name: /^Amit Sharma/ }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await tab(page, "Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: /^Amit Sharma/ }).click();
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").filter({ hasText: "welcome letter" })).toHaveCount(1);
});

test("the welcome email templates match the letter and use the name placeholder", () => {
  for (const lang of ["en", "hi"]) {
    const html = readFileSync(`emails/welcome.${lang}.html`, "utf8");
    const txt = readFileSync(`emails/welcome.${lang}.txt`, "utf8");
    expect(html).toContain("{{first_name}}");
    expect(txt).toContain("{{first_name}}");
    expect(html).toContain(lang === "en" ? "DILO never touches your money" : "DILO आपके पैसों को कभी नहीं छूता");
  }
});

test("letter page: no side-scroll, 44 px targets", async ({ page }) => {
  await page.goto("/signin/");
  await page.getByRole("button", { name: /^Priya Sharma/ }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await page.goto("/letter/");
  await expect(page.getByTestId("letter")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const small = await page.locator("main a, main button, nav a").evaluateAll((els) =>
    els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim()),
  );
  expect(small).toEqual([]);
});
