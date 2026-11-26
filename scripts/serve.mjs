// Tiny static file server for viewing the prototype on a phone (Termux).
// No dependencies. Listens on 127.0.0.1 only, so other devices on your Wi-Fi cannot reach it.
// Usage: node scripts/serve.mjs preview   then open http://localhost:8080 in Chrome.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const root = resolve(process.argv[2] ?? "preview");
const port = Number(process.env.PORT ?? 8080);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8", ".woff2": "font/woff2",
};

async function resolveFile(urlPath) {
  let p = resolve(join(root, decodeURIComponent(urlPath)));
  if (p !== root && !p.startsWith(root + sep)) return null; // block ../ tricks
  try {
    if ((await stat(p)).isDirectory()) p = join(p, "index.html");
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const urlPath = new URL(req.url ?? "/", "http://localhost").pathname;
  const file = (await resolveFile(urlPath)) ?? (await resolveFile("/404.html"));
  if (!file) { res.writeHead(404).end("Not found"); return; }
  const status = file.endsWith(`${sep}404.html`) && !urlPath.startsWith("/404") ? 404 : 200;
  res.writeHead(status, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
}).listen(port, "127.0.0.1", () => {
  console.log(`DILO preview: http://localhost:${port}  (serving ${root})`);
  console.log("Stop with Ctrl+C");
});
