# Quality-Gate Static Validation — Clínica Aurora Landing Page

**Task:** `t_aa5654a0` — Validate static quality-gate evidence
**Reviewer profile:** qualitygate (static-review-no-browser policy)
**Branch / HEAD reviewed:** `feat/clinica-aurora` @ commit `4a269ce`
**Date:** 2026-08-22 (UTC)
**Spec sources:** `specs/features/clinica-aurora-landing/{spec.md,tasks.md,design.md}`, `specs/STATE.md`
**Peer evidence reviewed:** `qa/QA-STATIC-REVIEW.md` (`t_a9d98b2f`), security/code-review verdict (`t_dfa95cc6`)

---

## Verdict

# STATIC-CHANGES-REQUIRED

The deliverable is **not** ready for static approval. Two accessibility acceptance criteria are
**statically verifiable and fail** on committed HEAD, independent of any browser:

- **AC-A11Y-3 (text/accent contrast)** — FAIL (confirmed, blocking).
- **AC-A11Y-2 (keyboard operability / collapsed-panel exposure)** — FAIL.

These are established from source code + deterministic computation, not from a missing test — so the
correct verdict is `STATIC-CHANGES-REQUIRED`, not `STATIC-EVIDENCE-INCOMPLETE`. Every criterion that
is browser/visual/runtime-dependent is recorded `NOT-VERIFIABLE-STATIC` and never assumed to pass.

---

## Commands re-run independently on committed HEAD (author ≠ verifier, this session)

| Command | Result | Evidence |
|--------|--------|----------|
| `npm run lint` | exit 0 | ESLint + Stylelint + html-validate all pass |
| `npm run test` | exit 0, **12/12** | `tests/structural.spec.js` (Vitest + jsdom) |
| `npm run build` | exit 0 | Vite → `dist/`: `index.html` 15.22 kB · CSS 13.21 kB · JS 3.19 kB, gzip 4.24/3.57/1.32 kB |
| dist inline scan (grep) | INLINE_CLEAN | `dist/index.html` has **no** `<style>` block, inline `style=`, or `on*` handler; single `<script type="module" crossorigin src>` + `<link rel="stylesheet">` |
| Runtime deps check | ZERO | `package.json` has **no** `dependencies` field — only `devDependencies` |
| Secret scan (grep, excl. node_modules/dist/.git) | 0 real matches | Hits only in prose docs (`qa/QA-STATIC-REVIEW.md`, `spec.md`) — no credential/API-key/private-key values |
| Contrast computation (python, token-derived) | see AC-A11Y-3 | WCAG ratios from declared `:root` / `[data-theme="dark"]` tokens + `setAccent()` |

**Did NOT run (static policy):** `npm run test:a11y` (axe + real Chromium), `npm run test:e2e`
(Playwright), `npm audit` (network). Recorded as evidence limits, never asserted.

---

## Acceptance-criterion mapping

### Responsiveness (AC-RES-*)

| ID | Status | Evidence |
|----|--------|----------|
| AC-RES-1 | **NOT-VERIFIABLE-STATIC** | No-horizontal-overflow at 320/390/768/1024/1280 needs browser measurement; `tests/e2e.spec.js:3-16` asserts it but is browser-backed. Static signals only: `img{max-width:100%;display:block}` (styles.css:63), grid collapses (524/530), `.hero{overflow:hidden}` (160). |
| AC-RES-2 | **PASS (static structure) + NOT-VERIFIABLE-STATIC (render clause)** | Static: media queries at **480/760/900/1024** (≥4 breakpoints — styles.css:523/533/551/558); nav collapses to a mobile menu ≤1024 (`.nav-links{display:none}` + `.nav-toggle{display:block}`, 533-548). "Renders correctly at all breakpoints" is runtime → not statically provable. |
| AC-RES-3 | **PASS (static, mobile scope) / residual LOW (D4)** | 44px floor applied and met at the mobile bump `@media (max-width:760px)`: `.swatch` 44px (554-555), `.theme-toggle button`/`.nav-toggle` min-height 44px (555), `.btn` min-height 44 (111), `.form input` min-height 44 (432), `details.faq summary` min-height 44 (357), mobile `.nav-links a` ~50px (547). **Residual:** above 760px (761–1024 tablet band, traced in AC-RES-1/a11y viewports) `.swatch` stays 38px (494-495) and `.theme-toggle button` 40px (510) — a fixed, always-visible panel. |
| AC-RES-4 | **NOT-VERIFIABLE-STATIC** | Per-section render without overlap/collapse is runtime. Static: `object-fit:cover` (190/390), `img{max-width:100%}` (63), `min-width:0` on grid children (242/299/324/388). |
| AC-RES-5 | **NOT-VERIFIABLE-STATIC** | Fixed `.tweaks-panel` overlap/scroll-safety is runtime. Static: `position:fixed; bottom:78px; right:20px; width:252px; max-height:calc(100vh-110px); z-index:60` (462-478) vs sticky top nav `z-index:50`. Direct nav overlap unlikely (bottom vs top), but overlap with CTA/footer is runtime. |

### New sections & organization (AC-SEC-*)

| ID | Status | Evidence |
|----|--------|----------|
| AC-SEC-1 | **PASS (static)** | `<section id="como-funciona">` + `<ol class="steps">` = 3 ordered steps with numbered markers `.step-num` and connector line `.step::before` (styles.css:277-286). Timeline/steps, not a card grid. |
| AC-SEC-2 | **PASS (static)** | `<section id="depoimentos">`: asymmetric featured quote `figure.t-featured` + `.t-side` two shorter `figure.t-quote` (index.html:157-183). No uniform card grid. |
| AC-SEC-3 | **PASS (static)** | `<section id="faq">` with **5** `details.faq`/`summary` (index.html:195-214) — within 4–6 range; native disclosure semantics. |
| AC-SEC-4 | **PASS (static)** | Nav order matches spec (Tratamentos → Como funciona → Depoimentos → FAQ → Sobre → Agendar, index.html:22-27); footer subset (281-286); every section has an `id` and is linked; `structural.spec.js:78-85` asserts nav anchors resolve. |

### Organization (AC-ORG-*)

| ID | Status | Evidence |
|----|--------|----------|
| AC-ORG-1 | **PASS (static)** | Six distinct compositions: numbered rows (`.service-list`), timeline (`.steps`), asymmetric featured+side quotes (`.testimonials`), accordion (`details.faq`), image+copy split (`.about-grid`), centered panel (`.cta-panel`). No repeated uniform card grid. |
| AC-ORG-2 | **PASS (static, structure) w/ caveat** | One `<h1>` (index.html:43); heading levels not skipped (`structural.spec.js:45-51`); consistent eyebrow/lead/CTA rhythm; brand tokens intact on default themes. **Caveat:** the accent-switch path regresses dark-mode contrast — see AC-A11Y-3 / D1. |

### Accessibility (AC-A11Y-*)

| ID | Status | Evidence |
|----|--------|----------|
| AC-A11Y-1 | **PASS (static)** | One `<h1>` (43); `html lang="pt-BR"` (2); landmarks `header`/`main`/`footer` + two labeled `nav`s (18/36/275/21/281); `structural.spec.js:18-31` asserts. |
| AC-A11Y-2 | **FAIL (static)** | Skip-link to `#main` present (15, css:86-97); `:focus-visible` outline (66-70); all interactive elements native `<a>/<button>/<details>/<input>` with explicit `type`. **Defect D2:** `.tweaks-panel` (index.html:292) carries **no** `aria-hidden`/`hidden`/`inert`; it is collapsed only via `opacity:0` + `pointer-events:none` (styles.css:462-480). `opacity:0` does **not** remove controls from the tab order or the accessibility tree, so the swatch/theme/motion controls stay keyboard-focusable and AT-exposed while invisible. **Defect D3 (related, design §5):** `#formStatus` (index.html:268) has no `role="status"`/`aria-live` → success message not announced. |
| AC-A11Y-3 | **FAIL (static) — BLOCKING** | Default token pairs pass both themes (table below). **But** `setAccent()` (main.js:33-39) overrides `--accent`/`--accent-ink` globally with **no** theme awareness and does **not** set `--on-accent`. Reachable accent-switch states fail AA (computed): dark theme + any picked accent → 1.85–4.04:1; light theme + sálvia → 4.23:1. All < 4.5:1 for `.95rem`/600 button text. `tests/a11y.spec.js:36-43` only exercises **default-dark (no accent)** — the failing states go untested. |
| AC-A11Y-4 | **PASS (static)** | Both `<img>` have meaningful `alt` (52, 223). **No `<svg>` in the document** (count 0 via grep), so the decorative-SVG `aria-hidden`/`focusable` sub-requirement is N/A. |
| AC-A11Y-5 | **PASS (static declarations); runtime NOT-VERIFIABLE-STATIC** | `@media (prefers-reduced-motion: reduce)` kills transitions/animations + `scroll-behavior:auto` (css:567-570); `body.no-motion *` (571-574); JS reads `matchMedia('(prefers-reduced-motion: reduce)')` and wires the Motion checkbox (main.js:73-88); default honors reduced motion (`savedMotion === null` branch). Actual suppression behavior is runtime. |

### Automation / project standards (AC-AUTO-*)

| ID | Status | Evidence |
|----|--------|----------|
| AC-AUTO-1 | **PASS (static)** | `npm run lint` → **exit 0** (re-run). ESLint `eslint.config.js`, Stylelint `stylelint.config.js`, html-validate `.htmlvalidate.json`. html-validate enforces one `<main>`/`<h1>`, landmarks, `lang`, alt, `no-implicit-button-type`, `heading-level`, `wcag/h30/h32/h37`. |
| AC-AUTO-2 | **PASS (static)** | `npm run build` → **exit 0** (re-run). `dist/index.html` inline-clean (grep); assets externalized to `dist/assets/index-*.css|js`; **zero runtime deps** (no `dependencies` field in package.json). |
| AC-AUTO-3 | **PASS (static)** | `npm run test` → **exit 0, 12/12** (re-run) — spec-defined markup outcomes (one h1, landmarks, lang, skip link, section anchors, heading order, labels, FAQ disclosure, alt, button types, nav anchors). |
| AC-AUTO-4 | **NOT-VERIFIABLE-STATIC** | axe via `@axe-core/playwright` + real Chromium is browser-backed (policy forbids `test:a11y`). `tests/a11y.spec.js` declares the 0-critical/serious expectation, but it was not run here; author≠verifier so prior "6/6 PASS" is not used as evidence. |

### Security & delivery (AC-SEC-*)

| ID | Status | Evidence |
|----|--------|----------|
| AC-SEC-1 | **PASS (static)** | No backend/external integration: only `devDependencies`; no `fetch`/`XMLHttpRequest`/`WebSocket`/`sendBeacon`/`axios` anywhere (repo grep). Form fails closed: `submit` → `e.preventDefault()` then `formStatus.hidden=false` + `demoForm.reset()` (main.js:125-129); inputs `required` (index.html:261,265). No `.env` tracked; secret scan clean (prose false-positives only). |
| AC-SEC-2 | **PASS (static declaration); transmission NOT-VERIFIABLE-STATIC** | `_headers` and `netlify.toml` declare **identical** CSP (`default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. Authoring is CSP-compliant (no inline script/style/on*). **Actual header transmission depends on the Netlify deploy (runtime) → NOT-VERIFIABLE-STATIC.** |
| AC-SEC-3 | **PASS (static)** | Non-goals honored: no booking/CRM/payment/auth code. Form is demonstrative and never persisted to a network; `connect-src 'self'` + no network calls. `localStorage` only keys `accent`/`theme`/`motion` (main.js:53/64/81) — PII not stored. |

---

## Static contrast evidence (WCAG 2.1 AA, source-derived)

Computed from declared custom-property values in `assets/css/styles.css` (`:root` = light, `[data-theme="dark"]` = dark). Python WCAG relative-luminance formula; non-browser.

| Pair (fg on bg) | Light | Dark | Verdict |
|-----------------|-------|------|---------|
| `--ink` on `--bg` (body) | 15.80 | 15.97 | ≥4.5 PASS |
| `--muted` on `--bg` (lead) | 5.62 | 8.20 | ≥4.5 PASS |
| `--muted` on `--surface` | 5.80 | 7.53 | ≥4.5 PASS |
| `--accent` on `--bg` (eyebrow) | 4.77 | 6.05 | ≥4.5 PASS |
| `--accent` on `--surface` | 4.93 | 5.55 | ≥4.5 PASS |
| `--on-accent` on `--accent` (btn-primary) | 4.72 | 5.81 | ≥4.5 PASS |
| `--on-accent` on `--accent-ink` (hover) | 7.76 | 8.59 | ≥4.5 PASS |
| `--accent-ink` on `--tint` (avatar) | 6.97 | 7.57 | ≥4.5 PASS |
| `--line` on `--bg` (non-text border) | 1.29 | 1.37 | OBSERVATION (O1) |

**Explicit-recompute of the accent-switch state (the failing case):**

| Theme + accent | Label token on accent | Ratio | Verdict |
|----------------|------------------------|-------|---------|
| dark + terracota `#A85B4B` | `--on-accent` dark `#21150F` | 3.62 | <4.5 FAIL |
| dark + sálvia `#6E7D5E` | `#21150F` | 4.04 | <4.5 FAIL |
| dark + vinho `#6E3143` | `#21150F` | 1.85 | <4.5 FAIL |
| dark + petróleo `#2E5857` | `#21150F` | 2.25 | <4.5 FAIL |
| light + sálvia `#6E7D5E` | `--on-accent` light `#FFF9F4` | 4.23 | <4.5 FAIL |
| light + terracota/vinho/petróleo | `#FFF9F4` | 4.72–9.21 | ≥4.5 PASS |
| dark + accent (no pick, default `#C9816F`) | `#21150F` | 5.81 | ≥4.5 PASS |
| light + accent (no pick, `#A85B4B`) | `#FFF9F4` | 4.72 | ≥4.5 PASS |

Derived hover `--accent-ink = shade(accent,-18)` on `--on-accent` dark: 1.05–2.02:1 (transient, below even the 3:1 large-text floor).

---

## Divergence reconciliation (security card vs QA review)

The security card (`t_dfa95cc6`) reported **AC-A11Y-3 PASS** and **touch targets ≥44px PASS**. The QA
review (`t_a9d98b2f`) reported **AC-A11Y-3 FAIL (D1)** and **AC-RES-3 FAIL (D4)**. Reconcile as follows:

1. **AC-A11Y-3 — security card PASS is REFUTED.** The security card's a11y evidence came from axe on
   the **default** states (default-light, default-dark) and from the `a11y.spec.js` dark test that sets
   `localStorage.theme='dark'` but **no accent**. Those states pass. The card did **not** cover the
   accent-switch states, which are reachable via the tweaks panel and which I independently computed to
   fail (dark+any accent 1.85–4.04; light+sálvia 4.23). So "PASS" is valid only for the tested default
   states, not the full reachable state space. The QA review is correct; defect **confirmed**. I extend
   it: light theme + sálvia also fails and the derived hover states fall to ~1–2:1.
2. **AC-RES-3 / D4 — neither card is fully right.** The spec's 44px touch-target floor is explicitly
   scoped **"on mobile"**, and at the mobile bump (≤760px) every target meets 44px. So the criterion as
   written **passes** the mobile scope. The QA review's "FAIL at ~768px" treats a tablet width as mobile,
   which overstates the criterion. But the security card's blanket "≥44px PASS" also overstates: at the
   768–1024px tablet band the fixed tweaks panel's `.swatch` (38px) and `.theme-toggle button` (40px) are
   below 44px. Verdict: **AC-RES-3 = PASS (static) for the mobile scope, with D4 as a low-severity
   residual** (non-blocking) rather than a criterion failure.

**Net:** the security card's APPROVAL was conditional on default-state a11y and did not exercise the
real accent/theme interaction; the QA review's D1 is the decisive, statically-confirmed blocker.

---

## Ranked gaps / defects

| Rank | ID | Severity | Static basis | AC |
|------|----|----------|--------------|----|
| 1 | D1 | **HIGH (blocking)** | `setAccent()` (main.js:33-39) is theme-agnostic and never sets `--on-accent`; dark+accent label contrast computed 1.85–4.04:1, light+sálvia 4.23:1 (all <4.5). `a11y.spec.js` only tests default-dark → failing states untested. | AC-A11Y-3 |
| 2 | D2 | **MEDIUM** | `.tweaks-panel` (index.html:292) hides via `opacity:0`+`pointer-events:none` (styles.css:462-480) with no `aria-hidden`/`hidden`/`inert` → invisible controls stay in tab order / AT-exposed. | AC-A11Y-2 |
| 3 | D3 | **MEDIUM** | `#formStatus` (index.html:268) lacks `role="status"`/`aria-live` → "Recebido!" not announced; violates design §5 "accessible status message". | AC-A11Y-2 / design §5 |
| 4 | D4 | **LOW** | `.swatch` 38px / `.theme-toggle button` 40px above 760px (styles.css:494-495,510); only 44px at ≤760 (554-555). Mobile scope passes; tablet band below floor. | AC-RES-3 |
| 5 | D5 | **LOW** | `tel:+551\*\*\*\*9999` (index.html:249) is a masked, non-dialable placeholder that differs from `wa.me/5511999999999` (250); sample data per design §7 A-4. | (data, no AC) |
| 6 | D6 | **LOW** | design §4 wanted a 3-col desktop timeline; CSS never sets a column template on `.steps` → stays 1-col vertical. AC-SEC-1 still met (timeline). | design/impl deviation |

**Observations (non-blocking):**
- **O1** WCAG 1.4.11 non-text contrast: `--line` on `--bg` = 1.29:1 (light) / 1.37:1 (dark), used as `.form input` + card borders; if treated as a control boundary, 3:1 may not be met (focus outline mitigates). Text-based AC-A11Y-3 unaffected.
- **O2** JS `shade('#A85B4B',-18)` yields `--accent-ink #7a2d1d` vs static light token `#7C3E32` — cosmetic token inconsistency, contrast unchanged.
- **O3** `data-theme="light"` hardcoded + module at end of body → saved theme/accent applies after first paint (runtime flash). Not an AC failure.

---

## Evidence limits

1. **Browser/visual/runtime criteria — NOT-VERIFIABLE-STATIC.** AC-RES-1, AC-RES-2 (render clause),
   AC-RES-4, AC-RES-5, AC-AUTO-4, and the runtime half of AC-A11Y-5 / AC-SEC-2 require real Chromium/
   Playwright, screenshots, or a live deploy. Per policy, no `test:a11y`/`test:e2e`/screenshots/vision/
   network were used; these are recorded not-verifiable and never asserted pass.
2. **No real-browser axe output.** The contrast table in this report is a source-derived, deterministic
   substitute for axe `color-contrast`; it is evidence for the default-state PASS and the accent-state
   FAIL, but is **not** an axe result.
3. **Header transmission not verified.** AC-SEC-2 config is verified; the bytes a browser receives
   depend on the Netlify deploy (runtime), not exercised.
4. **No network calls** (no `npm audit`, no package fetch). Dependency audit status untested.
5. **CI configuration verified, CI run not observed.** `.github/workflows/ci.yml` is well-formed
   (install → lint → test → a11y → e2e → build → audit, audit `continue-on-error`). No push/PR CI
   result was observed; there is **no configured `git remote`** and `design.md` §7 A-2 lists the GitHub
   remote as a stakeholder open question. CI is therefore configuration-only evidence.
6. **Working tree was not pristine at read time.** A concurrent process in this shared `workspace_kind=dir`
   briefly created `.github/workflows/pages.yml` and touched `vite.config.js` (mtimes 22:46:58). At
   report time `vite.config.js` content-hash equals HEAD exactly, `git diff` is empty, the tree is clean
   except untracked `qa/`, and `pages.yml` was a transient artifact that is **not** in the committed
   deliverable and is out of scope here.

---

## Recommendation

- **Blocking:** fix `setAccent()` to be theme-aware so every reachable accent/theme combination keeps
  `--on-accent`/`--accent-ink` at ≥4.5:1 (or recompute per-theme on-accent), and extend the a11y plan to
  exercise at least one dark+accent and one light+sálvia state. This is the single change required to
  unblock AC-A11Y-3.
- **Medium:** add `aria-hidden`/`inert` (or `hidden`) + `visibility:hidden` to the collapsed tweaks
  panel (D2), and `role="status"` (`aria-live="polite"`) to `#formStatus` (D3).
- **Low:** make `.swatch`/`.theme-toggle button` 44px at base (or extend the ≤760 bump to ≤1024) (D4);
  reconcile the `tel:` placeholder vs WhatsApp number with real contact data (D5, A-4); implement the
  design's 3-col `.steps` desktop layout or amend `design.md` (D6).
- **Not blocking (record, don't fix blindly):** all `NOT-VERIFIABLE-STATIC` criteria await a real-browser
  run or a live deploy; no runtime faults were injected and none should be added.
