// Builds two copies of the static site:
//   preview/ — for the phone (Termux) and the automated tests: everything stays on the device.
//   site/    — for dilowish.com (Cloudflare): feedback and early-access sign-ups go to Supabase.
// Run: npm run preview:update
import { execSync } from "node:child_process";
import { cpSync, readFileSync, rmSync } from "node:fs";

const run = (env) => execSync("npx next build", { stdio: "inherit", env: { ...process.env, ...env } });
const fresh = (to) => { rmSync(to, { recursive: true, force: true }); cpSync("out", to, { recursive: true }); };

run({ NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "" });
fresh("preview");

const pub = JSON.parse(readFileSync("config/public-supabase.json", "utf8"));
run({ NEXT_PUBLIC_SUPABASE_URL: pub.url, NEXT_PUBLIC_SUPABASE_ANON_KEY: pub.publishableKey });
fresh("site");
console.log("Built preview/ (on-device) and site/ (live, Supabase).");
