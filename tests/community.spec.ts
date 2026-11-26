import { expect, test, type Page } from "@playwright/test";

const fullName: Record<string, string> = { Priya: "Priya Sharma", Amit: "Amit Sharma", Neha: "Neha Verma", Ravi: "Ravi Kumar" };
const tab = (page: Page, name: string) => page.getByRole("navigation", { name: "App" }).getByRole("link", { name: new RegExp(`${name}$`) });

async function signInAs(page: Page, name: string) {
  await page.goto("/signin/");
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

/** Switch person without reloading, so demo changes stay. */
async function switchTo(page: Page, name: string) {
  await tab(page, "Profile").click();
  await page.getByRole("button", { name: "Switch demo person" }).click();
  await page.getByRole("button", { name: new RegExp(`^${fullName[name]}`) }).click();
  await expect(page).toHaveURL(/\/home\/$/);
}

async function openSharmaMembers(page: Page) {
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await page.getByTestId("admin-panel").click();
  await expect(page).toHaveURL(/\/community\/members\/\?id=sharma-family$/);
}

test("owner creates an invite link, shares it and switches it off", async ({ page }) => {
  await signInAs(page, "Priya");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await page.getByRole("link", { name: "Invite" }).click();
  await expect(page.getByTestId("invite-link")).toHaveCount(1); // seeded live link
  await page.getByRole("button", { name: "Create new invite link" }).click();
  await expect(page.getByTestId("invite-link")).toHaveCount(2);
  const code = (await page.getByTestId("invite-code").first().innerText()).trim();
  expect(code).toMatch(/^[A-Z2-9]{8}$/);
  const wa = page.getByRole("link", { name: "Share on WhatsApp" }).first();
  await expect(wa).toHaveAttribute("href", new RegExp(`^https://wa\\.me/\\?text=.*${code}`));
  await page.getByRole("button", { name: "Switch off this link" }).first().click();
  await expect(page.getByTestId("invite-link")).toHaveCount(1);
  await expect(page.getByTestId("old-link").filter({ hasText: code })).toContainText("Switched off");
  await expect(page.getByTestId("old-link").filter({ hasText: "OLDLINK1" })).toContainText("Expired");
});

test("invite landing: shows only name + cover; expired and unknown links are refused", async ({ page }) => {
  await page.goto("/join/?code=SHARMA7Q");
  await expect(page.getByTestId("invite-preview")).toContainText("Sharma Family");
  await expect(page.getByText("Anjali's Wedding")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sign in to ask to join" })).toBeVisible();
  await page.goto("/join/?code=OLDLINK1");
  await expect(page.getByTestId("invite-invalid")).toContainText("expired");
  await page.goto("/join/?code=NOPE1234");
  await expect(page.getByTestId("invite-invalid")).toContainText("isn't valid");
});

test("newcomer joins through a link: sign in, then request", async ({ page }) => {
  await page.goto("/join/?code=SHARMA7Q");
  await page.getByRole("link", { name: "Sign in to ask to join" }).click();
  await page.getByRole("button", { name: /^Ravi Kumar/ }).click();
  await expect(page).toHaveURL(/\/join\/\?code=SHARMA7Q$/);
  await page.getByRole("button", { name: "Request to join" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Request sent" })).toBeVisible();
});

test("approve: Ravi becomes a member and can see the celebrations", async ({ page }) => {
  await signInAs(page, "Ravi");
  await page.getByRole("button", { name: "Request to join" }).click();
  await switchTo(page, "Priya");
  await openSharmaMembers(page);
  await expect(page.getByTestId("request")).toHaveCount(1);
  await page.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Ravi is now a member" })).toBeVisible();
  await expect(page.getByTestId("member").filter({ hasText: "Ravi Kumar" })).toContainText("Member");
  await switchTo(page, "Ravi");
  await expect(page.getByTestId("invite-card")).toHaveCount(0);
  await expect(page.getByTestId("event-card").first()).toBeVisible();
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").first()).toContainText("Welcome! You are now a member of Sharma Family");
});

test("reject: Ravi stays outside and is told", async ({ page }) => {
  await signInAs(page, "Ravi");
  await page.getByRole("button", { name: "Request to join" }).click();
  await switchTo(page, "Amit"); // a moderator can decide too
  await openSharmaMembers(page);
  await page.getByRole("button", { name: "Reject" }).click();
  await expect(page.getByTestId("request")).toHaveCount(0);
  await switchTo(page, "Ravi");
  await expect(page.getByTestId("event-card")).toHaveCount(0);
  await tab(page, "Notifications").click();
  await expect(page.getByTestId("notice").first()).toContainText("was not approved");
});

test("owner changes roles; nobody can change or remove the owner", async ({ page }) => {
  await signInAs(page, "Priya");
  await openSharmaMembers(page);
  const neha = page.getByTestId("member").filter({ hasText: "Neha Verma" });
  await neha.getByRole("button", { name: "Make moderator" }).click();
  await expect(neha.getByTestId("member-role")).toHaveText("Moderator");
  await neha.getByRole("button", { name: "Make member" }).click();
  await expect(neha.getByTestId("member-role")).toHaveText("Member");
  const me = page.getByTestId("member").filter({ hasText: "Priya Sharma" });
  await expect(me.getByRole("button")).toHaveCount(0);
});

test("the last owner cannot leave", async ({ page }) => {
  await signInAs(page, "Priya");
  await openSharmaMembers(page);
  await page.getByRole("button", { name: "Leave community" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "last owner" })).toBeVisible();
  await expect(page).toHaveURL(/\/community\/members\//);
});

test("moderator can approve and remove members, but not the owner or roles", async ({ page }) => {
  await signInAs(page, "Amit");
  await openSharmaMembers(page);
  await expect(page.getByRole("button", { name: "Make moderator" })).toHaveCount(0);
  await expect(page.getByTestId("member").filter({ hasText: "Priya Sharma" }).getByRole("button")).toHaveCount(0);
  page.once("dialog", (d) => d.accept());
  await page.getByTestId("member").filter({ hasText: "Neha Verma" }).getByRole("button", { name: "Remove" }).click();
  await expect(page.getByTestId("member").filter({ hasText: "Neha Verma" })).toHaveCount(0);
});

test("a member sees no Invite or Manage, and the invite page is closed to them", async ({ page }) => {
  await signInAs(page, "Neha");
  await page.getByRole("link", { name: /Sharma Family/ }).first().click();
  await expect(page.getByRole("link", { name: "Invite" })).toHaveCount(0);
  await expect(page.getByTestId("admin-panel")).toHaveCount(0);
  await page.goto("/community/invite/?id=sharma-family");
  await expect(page.getByTestId("private-wall")).toBeVisible();
});

test("create a community: name required, private, you are the owner", async ({ page }) => {
  await signInAs(page, "Neha");
  await tab(page, "Communities").click();
  await page.getByRole("link", { name: "+ Create community" }).click();
  await page.getByRole("button", { name: "Create community" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "name" })).toBeVisible();
  await page.getByLabel("Community name").fill("Verma Cousins");
  await page.getByRole("button", { name: "Friends" }).click();
  await page.getByRole("button", { name: "Cover 2" }).click();
  await page.getByRole("button", { name: "Create community" }).click();
  await expect(page).toHaveURL(/\/community\/\?id=verma-cousins-[a-z0-9]+$/);
  await expect(page.getByText("You: Owner")).toBeVisible();
  await expect(page.getByText(/Private · Friends/)).toBeVisible();
  await tab(page, "Communities").click();
  await expect(page.getByRole("link", { name: /Verma Cousins/ })).toBeVisible();
});

test("new screens: banner, no side-scroll, 44 px tap targets", async ({ page }) => {
  await signInAs(page, "Priya");
  for (const path of ["/community/?id=sharma-family", "/community/members/?id=sharma-family", "/community/invite/?id=sharma-family", "/communities/new/", "/join/?code=SHARMA7Q"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.getByRole("status").first()).toContainText("DEMO DATA");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path).toBe(true);
    const small = await page.locator("main a, main button, nav a").evaluateAll((els) =>
      els.filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 44; }).map((e) => e.textContent?.trim() || e.getAttribute("aria-label")),
    );
    expect(small, path).toEqual([]);
  }
});
