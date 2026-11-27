import { defineConfig, devices } from "@playwright/test";

// Tests run against the built `preview/` folder, exactly what the phone serves.
// Run: npm run preview:update && npm test
export default defineConfig({
  testDir: "tests",
  reporter: "list",
  use: { baseURL: "http://localhost:4173", trace: "off" },
  webServer: [
    { command: "node scripts/serve.mjs preview", env: { PORT: "4173" }, url: "http://localhost:4173", reuseExistingServer: true },
    // The live build (site/) that Cloudflare serves; its Supabase calls are faked in tests/live-site.spec.ts.
    { command: "node scripts/serve.mjs site", env: { PORT: "4174" }, url: "http://localhost:4174", reuseExistingServer: true },
  ],
  projects: [
    { name: "phone", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
});
