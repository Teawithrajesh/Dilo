import { expect, test, type Page } from "@playwright/test";

const fullName: Record<string, string> = { Priya: "Priya Sharma", Amit: "Amit Sharma", Neha: "Neha Verma", Ravi: "Ravi Kumar" };
const tab = (page: Page, name: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${name}$`) });

async function signInAs(page: Page, name: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}
async function switchTo(page: Page, name: string) {
  await tab(page, "Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

test("shared links carry the DILO image and slogan (link preview tags)", async ({ page, request }) => {
  const html = await (await request.get("/join/?code=SHARMA7Q")).text();
  expect(html).toMatch(/<meta property="og:image" content="[^"]*\/og\/dilo-share\.png"/);
  expect(html).toMatch(/<meta property="og:title" content="DILO — Together, We Make Dreams Come True\."/);
  expect(html).toContain('<meta name="twitter:card" content="summary_large_image"/>');
  expect((await request.get("/og/dilo-share.png")).status()).toBe(200);
  await page.goto("/join/?code=SHARMA7Q");
  await expect(page.getByText("Together, We Make Dreams Come True.")).toBeVisible();
});

test("the WhatsApp message starts with the DILO slogan", async ({ page }) => {
  await signInAs(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await page.getByRole("link", { name: "Invite" }).click();
  const href = await page.getByRole("link", { name: "Share on WhatsApp" }).first().getAttribute("href");
  const text = decodeURIComponent(href!.split("text=")[1]);
  expect(text).toContain("DILO — Together, We Make Dreams Come True.");
  expect(text).toContain("SHARMA7Q");
});

test("someone joining by invite is offered their own community, and can create it", async ({ page }) => {
  await page.goto("/join/?code=SHARMA7Q");
  await page.getByRole("link", { name: "Sign in to ask to join" }).click();
  await page.getByRole("button", { name: /^Ravi Kumar/ }).click();
  await page.getByRole("button", { name: "Request to join" }).click();
  await expect(page.getByTestId("own-community-nudge")).toBeVisible();
  await page.getByRole("link", { name: "+ Create my own community" }).click();
  await expect(page).toHaveURL(/\/communities\/new\/$/);
  await page.getByLabel("Community name").fill("Ravi's In-laws");
  await page.getByRole("button", { name: "Create community" }).click();
  await expect(page.getByText("You: Owner")).toBeVisible();
});

test("Home always offers 'Start your own community'", async ({ page }) => {
  await signInAs(page, "Ravi"); // newcomer, not in any community yet
  await expect(page.getByTestId("create-own")).toBeVisible();
  await switchTo(page, "Neha"); // already a member and an owner
  await expect(page.getByTestId("create-own")).toBeVisible();
});

test("a new celebration notifies every member of that community", async ({ page }) => {
  await signInAs(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await page.getByTestId("add-celebration").getByRole("link", { name: "Birthday" }).click();
  await expect(page).toHaveURL(/\/celebrate\/birthday\/\?community=sharma-family$/);
  await expect(page.getByLabel("Community")).toHaveValue("sharma-family");
  // validation
  await page.getByRole("button", { name: /Create birthday dream/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "name" })).toBeVisible();
  await page.getByLabel("Celebration name").fill("Riya's 12th Birthday");
  const d = new Date(Date.now() + 20 * 86_400_000).toISOString().slice(0, 10);
  await page.getByLabel("Date").fill(d);
  await page.getByLabel("Dream wish").fill("Her first guitar");
  await page.getByLabel("Estimated budget").fill("12000");
  await page.getByRole("button", { name: /Create birthday dream/ }).click();
  await expect(page).toHaveURL(/\/event\/\?id=riya-s-12th-birthday-/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Riya's 12th Birthday");
  await expect(page.getByTestId("dream")).toContainText("guitar");
  // back to the community, then check the others' notifications
  await page.getByRole("link", { name: "Sharma Family" }).click();
  await expect(page.getByTestId("event-card").filter({ hasText: "Riya's 12th Birthday" })).toBeVisible();
  for (const member of ["Neha", "Amit"]) {
    await switchTo(page, member);
    await tab(page, "Notifications").click();
    await expect(page.getByTestId("notice").first()).toContainText("Priya added a new celebration in Sharma Family: Riya's 12th Birthday");
    await tab(page, "Home").click();
    await expect(page.getByTestId("event-card").filter({ hasText: "Riya's 12th Birthday" })).toBeVisible();
  }
  // a non-member hears nothing
  await switchTo(page, "Ravi");
  await tab(page, "Notifications").click();
  await expect(page.getByText("Riya's 12th Birthday")).toHaveCount(0);
});

test("when someone is approved, the existing members are told", async ({ page }) => {
  await signInAs(page, "Ravi");
  await page.getByRole("button", { name: "Request to join" }).click();
  await switchTo(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await page.getByTestId("admin-panel").click();
  await page.getByRole("button", { name: "Approve" }).click();
  await switchTo(page, "Neha");
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").first()).toContainText("Ravi Kumar joined Sharma Family");
});

test("a past date is refused", async ({ page }) => {
  await signInAs(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await page.getByTestId("add-celebration").getByRole("link", { name: "Wedding" }).click();
  await page.getByLabel("Celebration name").fill("Test");
  await page.getByLabel("Date").fill("2020-01-01");
  await page.getByRole("button", { name: /Create wedding dream/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "future date" })).toBeVisible();
});
