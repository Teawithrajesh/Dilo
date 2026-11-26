// Builds the welcome email (HTML + plain text, English + Hindi) from lib/welcomeLetter.ts,
// so the app and the email always say the same thing.
// Run: node --experimental-strip-types scripts/build-emails.mjs
import { writeFileSync } from "node:fs";
import { welcomeLetter } from "../lib/welcomeLetter.ts";

const NAME = "{{first_name}}"; // filled in by the email service (Phase 2)
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

for (const lang of ["en", "hi"]) {
  const l = welcomeLetter(NAME, lang);
  const font = lang === "hi" ? "'Noto Sans Devanagari','Mangal',Arial,sans-serif" : "Georgia,'Times New Roman',serif";
  const p = (t) => `<p style="margin:0 0 16px;font-family:${font};font-size:17px;line-height:1.7;color:#2b2118;">${esc(t)}</p>`;
  const html = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(l.subject)}</title></head>
<body style="margin:0;padding:0;background:#0a1440;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a1440;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#f8f1e6;border-radius:16px;">
<tr><td style="padding:32px 28px 8px;">
<p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#6f5428;">DILO &middot; Together, We Make Dreams Come True</p>
<p style="margin:0 0 16px;font-family:${font};font-size:17px;font-weight:bold;color:#2b2118;">${esc(l.greeting)}</p>
${l.paragraphs.map(p).join("\n")}
<ul style="margin:0 0 16px;padding-left:22px;">${l.points.map((t) => `<li style="margin:0 0 8px;font-family:${font};font-size:17px;line-height:1.7;color:#2b2118;">${esc(t)}</li>`).join("")}</ul>
${l.closing.map(p).join("\n")}
<p style="margin:8px 0 0;font-family:${font};font-size:17px;color:#2b2118;">${esc(l.signoff[0])}</p>
<p style="margin:4px 0 0;font-family:Georgia,serif;font-size:26px;font-style:italic;color:#7a1f3d;">${esc(l.signoff[1])}</p>
<p style="margin:2px 0 28px;font-family:Arial,sans-serif;font-size:14px;color:#5c4630;">${esc(l.signoff[2])}</p>
</td></tr>
</table>
<p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#c9cde0;">You're getting this because you joined DILO. Your community is private and DILO never handles money.</p>
</td></tr>
</table>
</body>
</html>
`;
  const text = [l.greeting, "", ...l.paragraphs.flatMap((t) => [t, ""]), ...l.points.map((t) => `- ${t}`), "", ...l.closing.flatMap((t) => [t, ""]), ...l.signoff].join("\n") + "\n";
  writeFileSync(new URL(`../emails/welcome.${lang}.html`, import.meta.url), html);
  writeFileSync(new URL(`../emails/welcome.${lang}.txt`, import.meta.url), `Subject: ${l.subject}\n\n${text}`);
  console.log(`emails/welcome.${lang}.html + .txt`);
}
