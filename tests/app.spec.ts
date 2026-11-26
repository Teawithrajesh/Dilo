import { expect, test, type Page } from "@playwright/test";

const fullName: Record<string, string> = { Priya: "Priya Sharma", Amit: "Amit Sharma", Neha: "Neha Verma", Ravi: "Ravi Kumar" };

async function signInAs(page: Page, name: string, { skipOnboarding = true } = {}) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await expect(page).toHaveURL(/\/onboarding\/$/);
  if (skipOnboarding) {
    await page.getByRole("button", { name: "Skip" }).click();
    await expect(page).toHaveURL(/\/home\/$/);
  }
}

const tab = (page: Page, name: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${name}$`) });

test("signed-out visitors are sent to demo sign-in", async ({ page }) => {
  for (const path of ["/home/", "/communities/", "/notifications/", "/profile/", "/communities/sharma-family/"]) {
    await page.goto(path);
    await expect(page, path).toHaveURL(/\/signin\/$/);
  }
});

test("sign-in lists the four demo people", async ({ page }) => {
  await page.goto("/signin/");
  for (const n of ["Priya Sharma", "Amit Sharma", "Neha Verma", "Ravi Kumar"]) {
    await expect(page.getByRole("button", { name: new RegExp(`^${n}`) })).toBeVisible();
  }
  await expect(page.getByRole("status").first()).toContainText("DEMO DATA");
});

test("onboarding: three cards, then Get started", async ({ page }) => {
  await signInAs(page, "Neha", { skipOnboarding: false });
  for (const title of ["Dream", "Share", "Support"]) {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await page.getByRole("button", { name: title === "Support" ? "Get started" : "Next" }).click();
  }
  await expect(page).toHaveURL(/\/home\/$/);
});

test("bottom tabs open each section and mark the active one", async ({ page }) => {
  await signInAs(page, "Priya");
  for (const [name, path] of [["Communities", "/communities/"], ["Notifications", "/notifications/"], ["Profile", "/profile/"], ["Home", "/home/"]]) {
    await tab(page, name).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(tab(page, name)).toHaveAttribute("aria-current", "page");
  }
});

test("Owner Priya: sees Sharma Family, its celebrations and the join-requests panel", async ({ page }) => {
  await signInAs(page, "Priya");
  await expect(page.getByText("Pending invites")).toHaveCount(0);
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await expect(page.getByTestId("admin-panel")).toBeVisible();
  await expect(page.getByTestId("event-card")).toHaveCount(3);
});

test("Moderator Amit: can see join requests", async ({ page }) => {
  await signInAs(page, "Amit");
  await page.goto("/communities/sharma-family/");
  await expect(page.getByTestId("admin-panel")).toBeVisible();
});

test("Member Neha: no join-requests panel in Sharma Family, but owner of Delhi Friends", async ({ page }) => {
  await signInAs(page, "Neha");
  await page.goto("/communities/sharma-family/");
  await expect(page.getByTestId("event-card").first()).toBeVisible();
  await expect(page.getByTestId("admin-panel")).toHaveCount(0);
  await page.goto("/communities/delhi-friends/");
  await expect(page.getByTestId("admin-panel")).toBeVisible();
});

test("Newcomer Ravi: sees only the invite (name + cover), not the private community", async ({ page }) => {
  await signInAs(page, "Ravi");
  await expect(page.getByTestId("invite-card")).toContainText("Sharma Family");
  await expect(page.getByTestId("event-card")).toHaveCount(0);
  await page.goto("/communities/sharma-family/");
  await expect(page.getByTestId("private-wall")).toBeVisible();
  await expect(page.getByTestId("event-card")).toHaveCount(0);
  await expect(page.getByText("Anjali's Wedding")).toHaveCount(0);
});

test("Ravi requests to join, then Priya sees 1 waiting request", async ({ page }) => {
  await signInAs(page, "Ravi");
  await page.getByRole("button", { name: "Request to join" }).click();
  await expect(page.getByTestId("invite-card")).toContainText("Request sent");
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").first()).toContainText("request to join was sent");
  // switch person without reloading (demo state lives in this tab)
  await tab(page, "Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: /^Priya Sharma/ }).click();
  await expect(page).toHaveURL(/\/home\/$/); // already onboarded in this tab
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await expect(page.getByTestId("request-count")).toHaveText("1");
});

test("notifications: unread badge clears with Mark all read", async ({ page }) => {
  await signInAs(page, "Priya");
  await expect(tab(page, "Notifications")).toContainText("2");
  await tab(page, "Notifications").click();
  await page.getByRole("button", { name: "Mark all read" }).click();
  await expect(page.getByText("All caught up")).toBeVisible();
  await expect(page.locator('[data-testid="notice"][data-unread]')).toHaveCount(0);
});

test("app screens: banner, no side-scroll, 44 px tap targets, no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await signInAs(page, "Priya");
  for (const path of ["/home/", "/communities/", "/communities/sharma-family/", "/notifications/", "/profile/"]) {
    await page.goto(path); // the chosen person is kept for this tab
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("status").first()).toContainText("DEMO DATA");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    const small = await page.locator("main a, main button, nav a").evaluateAll((els) =>
      els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim()),
    );
    expect(small, path).toEqual([]);
  }
  expect(errors).toEqual([]);
});
