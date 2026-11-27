import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page, full: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${full}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

test("anyone can send feedback from the landing page; message is required", async ({ page }) => {
  await page.goto("/welcome/");
  await page.getByRole("link", { name: "Feedback", exact: true }).click();
  await expect(page).toHaveURL(/\/feedback\/$/);
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "write your feedback" })).toBeVisible();
  await page.getByRole("button", { name: "4 out of 5" }).click();
  await page.getByRole("button", { name: "Something didn't work" }).click();
  await page.getByLabel("Your feedback or suggestion").fill("The O button took me a second to notice.");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByTestId("feedback-thanks")).toBeVisible();
});

test("signed-in: name is filled in; 'without my name' hides it", async ({ page }) => {
  await signIn(page, "Neha Verma");
  await page.getByTestId("feedback-card").click();
  await expect(page.getByLabel("Name (optional)")).toHaveValue("Neha Verma");
  await page.getByText("Send without my name").click();
  await expect(page.getByLabel("Name (optional)")).toHaveCount(0);
  await page.getByLabel("Your feedback or suggestion").fill("Please add Hindi!");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByTestId("feedback-thanks")).toBeVisible();
});

test("feedback stays after a refresh; the admin can read, download and clear it", async ({ page }) => {
  await page.goto("/feedback/");
  await page.getByRole("button", { name: "5 out of 5" }).click();
  await page.getByRole("button", { name: "Idea / suggestion" }).click();
  await page.getByLabel("Your feedback or suggestion").fill("Add a Diwali theme, please.");
  await page.getByLabel("Name (optional)").fill("Sunita");
  await page.getByLabel("Phone or email (optional, if you'd like a reply)").fill("98xxxxxx10");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByTestId("feedback-thanks")).toBeVisible();

  await page.reload(); // still saved on this phone
  await signIn(page, "DILO Admin");
  await page.getByTestId("admin-card").click();
  const item = page.getByTestId("admin-feedback").filter({ hasText: "Diwali theme" });
  await expect(item).toContainText("★★★★★");
  await expect(item).toContainText("Idea / suggestion");
  await expect(item).toContainText("Sunita · 98xxxxxx10");

  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download (CSV)" }).click();
  const file = await dl;
  expect(file.suggestedFilename()).toBe("dilo-feedback.csv");
  const csv = Buffer.concat(await (await file.createReadStream()).toArray()).toString();
  expect(csv).toContain("Add a Diwali theme, please.");
  expect(csv).toContain('"Date","Rating","Type","Feedback","Name","Contact"');

  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(page.getByTestId("admin-feedback")).toHaveCount(0);
});

test("feedback page: banner, no side-scroll, 44 px targets", async ({ page }) => {
  await page.goto("/feedback/");
  await expect(page.getByRole("status").first()).toContainText("DEMO DATA");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const small = await page.locator("main a, main button, main label:has(input[type=checkbox])").evaluateAll((els) =>
    els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim() || e.getAttribute("aria-label")),
  );
  expect(small).toEqual([]);
});
