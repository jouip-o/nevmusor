// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, nitro, env injection, @ alias — do NOT add them manually.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const pages = ["/", "/guide", "/faq", "/why", "/volunteer", "/about", "/feedback", "/point", "/account"];

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // Static output: every page is rendered to HTML at build time; the app then runs fully in the browser.
    pages: pages.map((path) => ({ path })),
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
