# Tasks — Clínica Aurora Landing Page (frontend build)

**Owner:** Tech Lead (task `t_891d21f0`) — authored for the [frontend] worker.
**Spec:** `spec.md` | **Design:** `design.md` | **Baseline:** `/opt/data/workspace/www/clinica-aurora/index.html`
**Contract:** one atomic commit per task; gate (tests green) decides done — never self-assessment; never weaken/skip/delete tests to force green.

Each task ends by running, from the project root: `npm run lint && npm run test && npm run test:a11y && npm run test:e2e && npm run build`. All must be green.

---

## Task T1 — Establish toolchain + git repo
- `git init` at the project root on branch `feat/clinica-aurora`; add `.gitignore` (`node_modules`, `dist`, `test-results`, `playwright-report`, `.axe-results`).
- `package.json` with scripts: `lint`, `test`, `test:a11y`, `test:e2e`, `build`; add `vite`, `vitest`, `jsdom`, `@axe-core/playwright`, `playwright`, `eslint`, `stylelint`, `html-validate` as devDependencies.
- Add `vite.config.js`, `eslint.config.js`, `stylelint.config.js`, `.htmlvalidate.json`, `playwright.config.js`.
- Add `.github/workflows/ci.yml` (install → lint → test → a11y → e2e → build → audit) and `netlify.toml` + `_headers` (CSP, X-Content-Type-Options, Referrer-Policy).
- **Verify:** `npm install` succeeds; `npm run lint` passes on a trivial scaffold.

## Task T2 — Split assets, externalize JS/CSS (CSP-safe)
- Split the inline `<style>` → `assets/css/styles.css`; the inline `<script>` → `assets/js/main.js` (ES module, `defer`).
- Remove inline `onerror="..."` handlers and inline `style="..."` on swatches (set them from JS/classes instead).
- Keep the design tokens, light/dark theme, accent override, motion toggle, and mobile-nav behavior **working exactly as before**.
- **Verify:** `npm run build` produces `dist/` with zero runtime deps; `html-validate` passes (no inline script/style).

## Task T3 — Responsiveness hardening (AC-RES-1..5)
- Verify no horizontal overflow at 320/390/768/1024/1280.
- Fix the fixed *tweaks* panel so it never overlaps nav or forces overflow on small screens.
- Ensure mobile nav toggle + FAQ bullets + swatches meet ≥44px touch targets; images scale; grid collapses don't overlap.
- Add `e2e.spec.js` asserting no page-level horizontal scroll at the four viewport widths (Playwright `document.documentElement.scrollWidth <= clientWidth`).
- **Verify:** `npm run test:e2e` green (overflow checks).

## Task T4 — Add "Como funciona" (AC-SEC-1)
- New `<section id="como-funciona">` with eyebrow + heading + **3-step timeline** (Avaliação individual → Plano personalizado → Acompanhamento contínuo), connecting line, numbered markers; 1-col mobile → 3-col desktop.
- Add to nav + footer.
- **Verify:** structural test asserts section + anchors exist; a11y + e2e green.

## Task T5 — Add "Depoimentos" (AC-SEC-2)
- New `<section id="depoimentos">` with **asymmetric featured-quote layout**: one large serif featured quote + 2 shorter quotes beside; author names + initials avatars; no uniform card grid.
- **Verify:** structural test asserts section + heading + roles; a11y green.

## Task T6 — Add "FAQ" (AC-SEC-3)
- New `<section id="faq">` as an **accessible accordion** (4–6 questions) using `<details>/<summary>` (or `button[aria-expanded]`+`role=region`); keyboard + screen-reader correct; one open at a time optional.
- Use real clinic questions (evaluation cost, preparation, permanence of results, payment, WhatsApp booking).
- **Verify:** structural tests assert disclosure markup + heading order; axe green (aria), e2e green.

## Task T7 — Navigation & IA update (AC-SEC-4)
- Update nav links + footer to include `#como-funciona`, `#depoimentos`, `#faq` in a sensible order (Tratamentos → Como funciona → Depoimentos → FAQ → Sobre → Agendar).
- Ensure consistent anchors, active/focus states, no dead links.
- **Verify:** structural tests assert each nav anchor resolves to an existing section `id`; a11y green.

## Task T8 — Structural (Vitest) tests + final full gate (AC-AUTO-1..4, AC-ORG, AC-A11Y)
- Write `tests/structural.spec.js` asserting **spec-defined outcomes** (not implementation): exactly one `<h1>`; landmark order; each required section present with correct `id`; heading levels not skipped; form labels; FAQ disclosure markup.
- Confirm **contrast** tokens satisfy WCAG AA in light + dark (axe `color-contrast`).
- Run the **full gate** (`lint` + `test` + `test:a11y` + `test:e2e` + `build`). All green = task done.
- **Verify (author ≠ verifier):** independent Verifier performs the spec-anchored outcome check + a **discrimination sensor** (mutator injects behavior-level faults in scratch state, confirms tests kill them, discards mutations; survivors become fix tasks). Writes `specs/features/clinica-aurora-landing/validation.md` (PASS/FAIL, per-AC evidence, sensor result, diff range).

---

## Repo/repo map (execution context)
- **Current project:** `/opt/data/workspace/www/clinica-aurora` (single repo — no cross-repo split for this feature).
- **Downstream cards:** [frontend] runs T1–T8; [qa] runs independent QA + evidence; [security] runs code+security review; [qualitygate] verifies evidence vs `spec.md` and approves.
- **Chaining:** `t_891d21f0` → frontend → (qa, security) → qualitygate.
