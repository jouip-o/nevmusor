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
- Accounts use passwordless email links via Lovable Cloud auth; profile name in profiles, saved points in favorites (RLS per user). The /account page handles both signed-out and signed-in states, so no gated route layout is needed.
- Render map favourite controls through a React portal into Yandex balloon footer slots, sharing useFavorites with account and point pages so all saves use the same owner-scoped persistence.
