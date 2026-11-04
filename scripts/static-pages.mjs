// After `vite build`, give every page its own folder with index.html
// (dist/client/about/index.html, ...). Plain static hosts such as nginx without
// an SPA fallback then open /about, /account etc. directly instead of 404.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const out = "dist/client";
const shell = join(out, "index.html");
if (!existsSync(shell)) {
  console.error(`[static-pages] ${shell} not found — run vite build first`);
  process.exit(1);
}

const pages = readdirSync("src/routes")
  .filter((f) => f.endsWith(".tsx") && !f.startsWith("__") && f !== "index.tsx")
  .map((f) => f.replace(/\.tsx$/, ""))
  .filter((name) => /^[a-z0-9-]+$/.test(name));

for (const page of pages) {
  mkdirSync(join(out, page), { recursive: true });
  copyFileSync(shell, join(out, page, "index.html"));
}
// Unknown addresses on hosts that use 404.html still load the app.
copyFileSync(shell, join(out, "404.html"));
console.log(`[static-pages] created ${pages.map((p) => `/${p}/`).join(", ")} and 404.html`);
