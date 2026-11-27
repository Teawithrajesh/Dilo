import { expect, test, type Page, type Request } from "@playwright/test";

// The live website build (site/). Supabase is FAKED here, so tests never write to the real database.
test.use({ baseURL: "http://localhost:4174" });

const SUPABASE = "https://ieaczkseiggwyaetjcdd.supabase.co/rest/v1/";

async function fakeSupabase(page: Page, status = 201) {
  const calls: Request[] = [];
  await page.route(`${SUPABASE}**`, async (route) => {
    calls.push(route.request());
    await route.fulfill({ status, body: "" });
  });
  return calls;
}

test("feedback on the live site goes to Supabase (insert only, public key)", async ({ page }) => {
  const calls = await fakeSupabase(page);
  await page.goto("/feedback/");
  await expect(page.getByText("Your feedback goes straight to the DILO founder.")).toBeVisible();
  await page.getByRole("button", { name: "4 out of 5" }).click();
  await page.getByLabel("Your feedback or suggestion").fill("Loved the wedding page");
  await page.getByLabel("Name (optional)").fill("Sunita");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByTestId("feedback-thanks")).toBeVisible();
  expect(calls).toHaveLength(1);
  const r = calls[0];
  expect(r.method()).toBe("POST");
  expect(r.url()).toBe(`${SUPABASE}feedback`);
  expect(r.headers()["apikey"]).toMatch(/^sb_publishable_/);
  expect(r.headers()["authorization"]).toBeUndefined();
  expect(r.postDataJSON()).toEqual({ rating: 4, kind: "idea", message: "Loved the wedding page", name: "Sunita", contact: null, source: "demo" });
  // nothing kept on the device
  expect(await page.evaluate(() => localStorage.getItem("dilo-feedback"))).toBeNull();
});

test("early access on the live site goes to Supabase with consent", async ({ page }) => {
  const calls = await fakeSupabase(page);
  await page.goto("/early-access/");
  await page.getByLabel("Email", { exact: true }).fill("sunita@example.com");
  await page.getByLabel("City (optional)").fill("Jaipur");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Join the early-access list" }).click();
  await expect(page.getByTestId("early-access-done")).toContainText("You're on the list!");
  expect(calls).toHaveLength(1);
  expect(calls[0].url()).toBe(`${SUPABASE}early_access`);
  expect(calls[0].postDataJSON()).toEqual({ email: "sunita@example.com", name: null, city: "Jaipur", consent: true, consent_text_version: "v1" });
});

test("an email already on the list is recognised (Supabase says 409)", async ({ page }) => {
  await fakeSupabase(page, 409);
  await page.goto("/early-access/");
  await page.getByLabel("Email", { exact: true }).fill("sunita@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Join the early-access list" }).click();
  await expect(page.getByTestId("early-access-done")).toContainText("already on the list");
});

test("no internet: a clear message, and sending again works", async ({ page }) => {
  let fail = true;
  await page.route(`${SUPABASE}**`, async (route) => (fail ? route.abort() : route.fulfill({ status: 201, body: "" })));
  await page.goto("/feedback/");
  await page.getByLabel("Your feedback or suggestion").fill("hello");
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "check your internet" })).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Send feedback" }).click();
  await expect(page.getByTestId("feedback-thanks")).toBeVisible();
});

test("the live admin page points to Supabase for feedback", async ({ page }) => {
  await page.goto("/signin/");
  await page.getByRole("button", { name: /^DILO Admin/ }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByTestId("admin-card").click();
  await expect(page.getByTestId("supabase-link")).toHaveAttribute("href", /supabase\.com\/dashboard\/project\/ieaczkseiggwyaetjcdd/);
});
