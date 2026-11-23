# SoulOcta — Destiny Matrix static site

Production-quality static website. No framework, no backend, no database.
Every calculation runs in the visitor's browser.

## Maths
- reduce22(n): digit-sum while n > 22; 0 becomes 22; 22 stays 22.
- A = day, B = month, C = digit-sum(year) reduced.
- Centre D = reduce22(A + B + C). Corners: F = A+B, G = B+C, H = C+D, I = D+A.
- Verified: 14 Jun 1995 -> A14 B6 C6 centre 8 (Justice).
  14 Mar 1990 -> A14 B3 C19 centre 9, F17 G22 H10 I5.
  Note: some schools define centre as reduce22(A+B+C+D); this site uses
  reduce22(A+B+C) and says so on the how-to page.

## Files
- index.html — main calculator (blank by default; a ghost example chart for 14 Jun 1995 is shown at low opacity until you calculate)
- assets/arcana-justice.webp — the one designed image (VIII — Justice); assets/social-card.png — 1200×630 og:image; assets/fonts/ — Fraunces WOFF2, self-hosted, no external requests
- compatibility.html, portrait-zone.html, money-line.html, karmic-tail.html
- what-is-destiny-matrix.html, how-to-calculate.html, 22-arcana.html, 2027-personal-year.html
- about.html, contact.html, privacy.html, terms.html, disclaimer.html
- assets/style.css, assets/matrix.js
- sitemap.xml, robots.txt (ads.txt REMOVED from the deploy until AdSense issues a real publisher ID — do not re-add a placeholder)
- build.py — regenerates every page: `python3 build.py`
- tests/test_matrix.py — maths tests (run: `python3 tests/test_matrix.py`)

## Palette (v9 — single source: PALETTE in build.py, M2)
Paper ground #efe6d2, deeper paper #e7dcc2, card #f8f2e2; ink #2a2115
(12.75:1), muted #6e6046 (4.94:1), faint #6b5c43 (5.23:1); one accent,
muted terracotta rust #a04d28 (4.72:1; cream on rust 5.24:1), deep rust
#7e3a1d, soft rust #c98a5f; brass #8f7422 (3.61:1) is hairlines only,
never text (L2). Decorative hairlines #c9b78f (1.59:1) and #b39b6a
(2.17:1) are 1px rules / link underlines, not text — do not darken them
into visible rules (L7). Grain is a feTurbulence SVG data-URI at ~9%
opacity, z-index 0 (below header and focus ring, M5). Arcana cards and
the social card are generated from this same palette by
make_arcana_cards() / make_social_card() in build.py (H3); their
dominant pixel must be light paper, never (11, 9, 5).

## HOSTING DECISION (Security Audit Round 2, S1/H1 — read before deploying)
GitHub Pages CANNOT set real response headers. That means, on GitHub Pages:
- HTTP is served with no redirect and no HSTS unless "Enforce HTTPS" is ON
  in repo Settings → Pages (H1, HIGH — turn it on before deploy, then verify
  `curl -I http://soulocta.me/` returns 301 to https://).
- The site CAN be iframed cross-origin: the frame-buster in
  assets/framebuster.js does NOT work cross-origin in modern Chrome
  (verified in a real browser), and a <meta> CSP cannot carry
  frame-ancestors. Do NOT claim the site is clickjacking-proof while it
  is on GitHub Pages. The honest fix is moving hosting to Cloudflare Pages
  or Netlify (both free) and setting real headers: frame-ancestors 'none',
  Strict-Transport-Security, X-Content-Type-Options. That is a decision
  for the site owner, not a code fix — the code cannot do it.
- CSP note (S4, extended L2): `img-src 'self' data:` is an accepted,
  necessary exception with TWO consumers — (1) the PNG download and share
  preview render the chart via data:image/svg+xml -> canvas, and (2) the
  paper-grain texture is a data:image/svg+xml background-image in the CSS.
  Removing `data:` would silently break both. No user-controlled <img src>
  exists anywhere; if one is ever added, re-audit this first.
- After this deploy: delete `.github/workflows/unzip.yml` (M2), enable
  branch protection on main, and use a GitHub noreply email for future
  commits (M3 — the owner's personal Gmail is in all past commits).

## v12 (15 Nov 2026) — Round-5 fixes (PSYCHOLOGY-AUDIT-5, SECURITY-AUDIT-5,
## CODE-AUDIT-4, SEO-AUDIT-V11 — all fixed in build.py, re-tested, NOT deployed)
- Personal info: ZERO personal info anywhere on the site — no name, no city,
  no university, no employer, no GitHub handle, in visible text, JSON-LD or
  meta tags. Author is Organization "SoulOcta" everywhere; NO Person schema
  anywhere. About is written entirely in brand voice. (User override, 15 Nov
  2026: "meri sari info ha yhn — mojhy reveal ni krna".)
- Calculator buried (A1): the mobile flex-order block is DELETED — DOM order
  is hero -> calculator -> article on every page. 360px card offset gate:
  < 1,200px on every tool page.
- Payoff scroll (A2/A3/H6): scrolls the #calculator card / result into view
  (block:start, scroll-margin-top 84px) ONLY on a user submit, never on a
  ?dob= load. 2027.js renders NOTHING on load.
- First screen (H2): a compact date input + Calculate button lives inside
  the hero on index + every single-date tool page; tool-page heroes shrunk
  (H1 max 54px, hero padding 48px, arcana image 140px).
- ads.txt: NOT in the build and NOT in the deploy zip. The live placeholder
  (pub-0000000000000000) survives only in the GitHub repo — DELETE it from
  the repo (git rm ads.txt) at the next deploy; re-add only with a real
  AdSense publisher ID.
- _headers ships in the deploy zip (HSTS, frame-ancestors 'none', nosniff,
  Referrer-Policy, Permissions-Policy, real CSP header). It does NOTHING on
  GitHub Pages — it takes effect at the Cloudflare Workers cutover.
- Cloudflare Web Analytics beacon: TURN IT OFF. Dashboard -> Websites ->
  soulocta.me -> Analytics & Logs -> Web Analytics -> Disable. The site's
  meta CSP (script-src 'self') blocks the beacon anyway, so leaving it on
  only adds a blocked external request + a console violation on every page.
  Do NOT whitelist the beacon in the CSP.

## CLEAN-URL MIGRATION — CLOSED / SKIPPED (Phase 0 U4, decision 23 Nov 2026)
- The user decided: keep .html canonicals as-is. The Workers migration was
  cancelled permanently, so there is no cutover that could carry clean URLs;
  GitHub Pages has no redirects, so renaming would leave .html duplicates live
  (or 404s) and break every Pinterest pin / TikTok link already published.
- Do NOT list this as pending anywhere. If clean URLs are ever revisited, it
  needs a host with real 301 redirects and a one-deploy swap of links,
  canonicals, sitemap, og:url, JSON-LD @ids and llms.txt — never a mixed state.
- DECISION 23 Nov 2026 (accepted, no work): http://www.soulocta.me 301s to
  https://www.soulocta.me/ (2 hops to apex). Do not spend cycles on Cloudflare
  redirect rules for this.

## BEFORE DEPLOYMENT — do these, in order
1. Domain is live: soulocta.me (registered 15 Nov 2026, expires 15 Nov 2027,
   GitHub Pages). SITE in build.py is already https://soulocta.me. The contact
   email hello@soulocta.me is live via Cloudflare Email Routing (verified
   23 Nov 2026). ads.txt is NOT in the deploy: add it
   only after AdSense gives you a real publisher ID — never with a fake ID.
2. Host the files as static hosting (any static host; no server code needed).
   Check the site loads over HTTPS and that /sitemap.xml and /robots.txt work.
3. Google Search Console: add the property, verify ownership, submit sitemap.xml.
   Check that index.html is indexed and that the FAQ rich results are eligible.
4. Test on a real phone: calculator, chart taps, PNG download, share link.
5. Content: read every guide page once. Nothing here promises AdSense approval
   or earnings. Do NOT add paid checkout until the payment route (Payoneer) is
   wired up and tested with a real $1 transaction.
6. AdSense: apply only after the site has its 15+ pages live, trust pages live,
   and some organic traffic. If rejected, fix the reason given and reapply —
   do not reapply unchanged.

## Notes for future auditors (do not "fix" these)
- `twitter:site` is deliberately omitted: SoulOcta has no X/Twitter account,
  and inventing a handle would be a lie. Add it only when a real account exists.
- No `hreflang` yet: Spanish is Phase 2. When the first Spanish page ships,
  use the `/es/` subfolder (e.g. `/es/calculadora-matriz-destino.html`) and add
  `hreflang="x-default"` on the English index. Do not fake hreflang before then.
- `img-src 'self' data:` is an accepted exception (see HOSTING DECISION above).

## Paid plans (PLANNED, not live)
$7 single reading, $9-14 full PDF, $19 bundle. No checkout code exists yet.
