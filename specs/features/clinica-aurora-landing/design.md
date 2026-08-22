# Design / Technical Delivery Plan — Clínica Aurora Landing Page

**Owner / Author:** Tech Lead (task `t_891d21f0`)
**Status:** Baseline for the frontend build + downstream QA/security/quality-gate
**References:** `spec.md` (requirements), sibling standard `ADR-0001` (Nimbus demo — same team, generic static-site stack, reused below).

---

## 1. Summary of decisions

| ID | Decision |
|----|----------|
| D-1 | **Stack:** static HTML5 + modern CSS (native custom properties) + minimal vanilla JS (ES modules). No framework, no CSS framework. |
| D-2 | **Build/dev tooling (dev-time only):** Vite (dev server + build), Vitest + jsdom (structural/unit), @axe-core/playwright (a11y gate), ESLint + Stylelint + html-validate (lint). Shipped `dist/` has **zero runtime dependencies**. |
| D-3 | **Repo structure:** split `index.html`, `assets/css/styles.css`, `assets/js/main.js` (+ design tokens in CSS). No inline `<script>`, no inline `on*` handlers, no inline `style=` (CSP-compliant). |
| D-4 | **Accessibility gate:** axe-core via Playwright in real Chromium at all four breakpoints + `prefers-reduced-motion: reduce`. |
| D-5 | **Lint:** ESLint (JS), Stylelint (CSS), html-validate (HTML) — semantic enforcement (one `<main>`, one `<h1>`, landmarks, `lang`, alt, no empty links). |
| D-6 | **CI/CD:** GitHub Actions — install → lint → test → test:a11y → test:e2e → build → security/audit scan on push & PR. |
| D-7 | **Deployment:** static host (Netlify recommended — custom `_headers`; Cloudflare Pages/Vercel acceptable fallback). **Assumption/OQ:** hosting account + GitHub remote must be provisioned by the stakeholder (see §7). |
| D-8 | **Backend/integration:** **None.** Fully static, public. The existing form stays a client-side demo; CTAs use `tel:` / WhatsApp / in-page anchors. |
| D-9 | **Appearance panel:** keep the existing accent/theme/motion controls (a real differentiator) but ensure they remain CSP-safe and accessible. |

## 2. Frontend stack decision

**Why static, not a framework** — single marketing page, fast initial paint, minimal attack surface, highest a11y control (hand-authored semantic markup + verified contrast tokens), portable to any static host. Same rationale as the team's `ADR-0001`.

**Runtime & quality budget:** small JS payload (mobile-nav, FAQ disclosure, appearance tweaks, demo-form state); no analytics, no external runtime CDN dependencies.

## 3. Repository structure (target)

```
<project-root>/                       (= /opt/data/workspace/www/clinica-aurora)
├── index.html                        # semantic single page (links assets, no inline JS/style)
├── assets/
│   ├── css/styles.css                # tokens + layout + components + responsive
│   └── js/main.js                    # ES module: nav, FAQ disclosure, tweaks, demo form
├── tests/
│   ├── structural.spec.js            # Vitest + jsdom, spec-anchored markup assertions
│   ├── a11y.spec.js                  # @axe-core/playwright gate (0 crit/serious)
│   └── e2e.spec.js                   # Playwright: viewport/overflow, nav, FAQ, headers
├── vite.config.js                    # outDir: dist
├── eslint.config.js / stylelint.config.js / .htmlvalidate.json
├── playwright.config.js
├── .github/workflows/ci.yml          # install → lint → test → a11y → e2e → build → audit
├── netlify.toml + _headers           # deliver security headers / build settings
├── package.json
└── specs/                            # this feature's spec artifacts (this folder)
```

`git init` at the project root; work on branch **`feat/clinica-aurora`**.

## 4. Approach to the new sections (varied composition — satisfy AC-ORG-1)

Avoid repeating the same card grid. Distinct composition per section, on a shared token system:

- **Serviços (`#tratamentos`)** — keep numbered editorial rows (already varied). Do not regress.
- **Como funciona (`#como-funciona`, NEW)** — vertical **timeline/steps**: 3 steps (Avaliação individual → Plano personalizado → Acompanhamento contínuo) with a connecting line, numbered markers, and an alternating icon+copy rhythm. Layout: 1-col mobile → 3-col desktop with a progress line.
- **Depoimentos (`#depoimentos`, NEW)** — **asymmetric feature quote**: one large featured testimonial (serif quote + author) beside a column of two shorter quotes; no uniform card grid. Alternate: quote-marks, subtle serif, author avatar/initials.
- **FAQ (`#faq`, NEW)** — **accessible accordion**, 4–6 clinic questions (e.g. "A avaliação é paga?", "Preciso de preparo antes de um procedimento?", "Resultados são permanentes?", "Quais formas de pagamento?", "Posso agendar por WhatsApp?"). Use `<details>/<summary>` (native disclosure state, minimal JS) or `button[aria-expanded]+region`. Ensure keyboard + screen-reader handling.
- **About (`#sobre`)** — keep image+copy split (varied from others).
- **Cta / `#agendar`** — keep the existing centered panel + demo form.

**Composition variety checklist:** numbered rows (serviços), timeline steps (como funciona), asymmetric featured quote + side quotes (depoimentos), accordion (FAQ), image+copy split (sobre), centered panel (cta). That is the "composição variada" the stakeholder asked for.

## 5. Accessibility requirements (WCAG 2.1 AA)

- **Semantic structure:** one `<main>`, one `<h1>`, landmarks `header/nav/main/footer`, skip-link `#main`, `lang="pt-BR"`.
- **Keyboard:** all interactive elements reachable/activatable; visible focus (`:focus-visible`); FAQ and nav operate by keyboard; the appearance panel toggles are buttons with labels.
- **Forms/disclosure:** demo form has `<label>` for each input and an accessible status message; FAQ disclosure uses native semantics or correct ARIA.
- **Images/SVG:** meaningful `alt`; decorative SVG (brand mark) `aria-hidden="true" focusable="false"`.
- **Contrast:** token values verified for text + interactive states in light and dark themes (axe `color-contrast`).
- **Metadata/motion:** `<meta viewport>`, `color-scheme`, `prefers-reduced-motion` respected.

## 6. Automated verification (author ≠ verifier)

Run locally / in CI: `npm run lint` → `npm run test` → `npm run test:a11y` → `npm run test:e2e` → `npm run build`. The independent **QA** card re-runs these + manual viewport/keyboard evidence; the **quality-gate** card co-verifies the evidence against `spec.md` acceptance criteria before approving. An independent Verifier performs the spec-anchored check + discrimination sensor (see `tasks.md` last task).

## 7. Assumptions / open questions

| Ref | Item | Type |
|-----|------|------|
| A-1 | Third-party hero/testimonial/acne imagery via Unsplash keeps working (already used); either keep remote with valid `alt` or add local fallback. | assumption |
| A-2 | Hosting account + GitHub remote for PR/preview deploy must be provisioned by the stakeholder (Netlify preferred). | open question |
| A-3 | The demo form stays non-persistent; a real booking/CRM integration is out of scope (v1.1+). | assumption |
| A-4 | The clinic address/phone/WhatsApp/hours shown in the baseline are sample data — confirm real contact details before go-live. | open question |

*End of design plan. Tasks referencing this plan: see `tasks.md`.*
