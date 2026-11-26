// Checks every allowed colour pair in brand/tokens.json against WCAG AA.
// Exits with an error if any pair is below its minimum. Run: npm run test:contrast
import { readFileSync } from "node:fs";

const tokens = JSON.parse(readFileSync(new URL("../brand/tokens.json", import.meta.url)));
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

let failed = 0;
for (const { fg, bg, min, use } of tokens.pairs) {
  const r = ratio(tokens.colors[fg], tokens.colors[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2)}:1 (need ${min})  ${fg} on ${bg}  — ${use}`);
}
for (const { fg, bg, why } of tokens.avoid) {
  console.log(`AVOID ${ratio(tokens.colors[fg], tokens.colors[bg]).toFixed(2)}:1  ${fg} on ${bg}  — ${why}`);
}
console.log(failed ? `\n${failed} pair(s) failed` : `\nAll ${tokens.pairs.length} pairs pass WCAG AA`);
process.exit(failed ? 1 : 0);
