<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The site is a faithful port of a static HTML site: src/styles.css is the original sheet verbatim (no Tailwind), copy lives in src/lib/i18n.ts, points in src/lib/data.ts — keep original class names so the sheet applies.
- Keep phone adaptations in scoped media queries appended to the original stylesheet so desktop composition and static-site class names stay intact.
- Public pages and map popups have no account dependency; keep navigation and point details usable without authentication.
- Build is SPA mode (tanstackStart.spa): dist/client is a static site with index.html shell + public/.htaccess fallback, so it can run on plain shared hosting; never add server functions or server routes.
- `npm run build` runs scripts/static-pages.mjs, which copies the shell to <page>/index.html for every route file plus 404.html, because nginx hosts ignore .htaccess and would 404 on direct page links.
