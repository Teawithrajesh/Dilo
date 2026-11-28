// Secret scan: fails if any tracked file (source, config, docs, built output) contains something that looks
// like a private key, token or connection string. Run: npm run test:secrets
// The Supabase *publishable* key is public by design (RLS allows INSERT only) and is the one allowed exception.
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PATTERNS = [
  ["Supabase secret key", /sb_secret_[A-Za-z0-9_-]{10,}/],
  ["JWT (e.g. Supabase service_role / anon JWT)", /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ["service_role key name with a value", /service_role[^\n]{0,20}[:=]\s*["'][^"']{20,}/i],
  ["Stripe secret / restricted key", /\b(sk|rk)_(live|test)_[A-Za-z0-9]{10,}/],
  ["Stripe webhook secret", /\bwhsec_[A-Za-z0-9]{10,}/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}/],
  ["Slack token", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{30,}/],
  ["OpenAI / Anthropic key", /\bsk-(proj-|ant-)?[A-Za-z0-9_-]{20,}/],
  ["SendGrid key", /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}/],
  ["Twilio key", /\bSK[0-9a-f]{32}\b/],
  ["Database URL with password", /\b(postgres(ql)?|mysql|mongodb(\+srv)?|redis):\/\/[^\s:@/]+:[^\s@/]+@/],
  ["Private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];

const files = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean)
  .filter((f) => !/\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|mp4|webm|pdf)$/i.test(f) && f !== "scripts/check-secrets.mjs");

let found = 0;
for (const f of files) {
  let text;
  try { text = readFileSync(f, "utf8"); } catch { continue; }
  for (const [name, re] of PATTERNS) {
    const m = text.match(re);
    if (m) { found++; console.log(`FOUND  ${name}  in ${f}  (${m[0].slice(0, 12)}…)`); }
  }
}
if (found) { console.log(`\n${found} possible secret(s). Move them to environment variables and rotate them.`); process.exit(1); }
console.log(`No secrets found in ${files.length} tracked files.`);
