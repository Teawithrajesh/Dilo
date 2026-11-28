// Builds two copies of the static site:
//   preview/ — for the phone (Termux) and the automated tests: everything stays on the device.
//   site/    — for dilowish.com (Cloudflare): feedback and early-access sign-ups go to Supabase.
// Run: npm run preview:update
import { execSync } from "node:child_process";
import { cpSync, readFileSync, rmSync } from "node:fs";

// Public Supabase settings for the live site: environment variables win; otherwise the public config file.
const pub = JSON.parse(readFileSync("config/public-supabase.json", "utf8"));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || pub.url;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || pub.publishableKey;

// Safety first: anything prefixed NEXT_PUBLIC_ ends up in the browser. Refuse a secret/service key.
const jwtRole = (k) => { try { return JSON.parse(Buffer.from(k.split(".")[1] ?? "", "base64url").toString()).role ?? ""; } catch { return ""; } };
if (/^sb_secret_/.test(key) || (/^eyJ/.test(key) && jwtRole(key) === "service_role")) {
  console.error("STOP: the Supabase key is a SECRET/service key. Only the publishable (or RLS-protected anon) key may be built into the site.");
  process.exit(1);
}

const run = (env) => execSync("npx next build", { stdio: "inherit", env: { ...process.env, ...env } });
const fresh = (to) => { rmSync(to, { recursive: true, force: true }); cpSync("out", to, { recursive: true }); };

run({ NEXT_PUBLIC_SUPABASE_URL: "", NEXT_PUBLIC_SUPABASE_ANON_KEY: "" });
fresh("preview");

run({ NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: key });
fresh("site");
console.log("Built preview/ (on-device) and site/ (live, Supabase).");
