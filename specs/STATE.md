# State — Clínica Aurora project (spec-driven memory)

> Project memory for `/opt/data/workspace/www/clinica-aurora`. Read `## Handoff` to resume; `## Decisions` for active constraints.

## Decisions log

**AD-001 — Technical stack & delivery approach (techlead, 2026-08-22).**
- Static **HTML5 + modern CSS (native custom properties) + minimal vanilla JS (ES modules)**. No framework, no CSS framework.
- Dev tooling only: **Vite** (dev + build), **Vitest + jsdom** (structural), **@axe-core/playwright** (axe a11y gate), **ESLint / Stylelint / html-validate** (lint). `dist/` ships **zero runtime deps**.
- **No backend / no external integration.** Demo form stays client-side only. CTAs = `tel:` / WhatsApp / in-page anchors.
- **GitHub Actions** CI (lint → test → a11y → e2e → build → audit); deploy via **Netlify** (custom `_headers`) with Cloudflare/Vercel as acceptable fallback.
- **CSP-compliant authoring:** externalize JS/CSS; no inline script/style/`on*` handlers.
- Decisions detail + rejected alternatives: `specs/features/clinica-aurora-landing/design.md` (mirrors team `ADR-0001` standard).

## Handoff

**Feature:** Clínica Aurora landing page improvement (responsive, more sections, organization).
**Status:** SPEC/DESIGN/TASKS authored by techlead; **frontend build DONE and gate GREEN** (t_dc81a9db, branch `feat/clinica-aurora`). Ready for downstream QA + security + qualitygate.

- **Feature scope:** `/opt/data/workspace/www/clinica-aurora` (single repo, not cross-repo).
- **Frontend deliverable (committed):** externalized `index.html` + `assets/css/styles.css` + `assets/js/main.js` (CSP-safe, zero inline JS/style/`on*`), sections: nav → hero → trust → `#tratamentos` → `#como-funciona` (NEW) → `#depoimentos` (NEW) → `#faq` (NEW) → `#sobre` → `#agendar` → footer, plus the tweaks appearance panel. New nav/footer IA; accordion FAQ via `<details>/<summary>`.
- **Green gate (run from project root):** `npm run lint && npm run test && npm run test:a11y && npm run test:e2e && npm run build`
  - lint: ESLint + Stylelint + html-validate — pass
  - test: Vitest+jsdom structural — 12/12 pass
  - test:a11y: axe (real Chromium) — 6/6 pass, 0 critical/serious (≤480/~768/~1024/≥1200, reduced-motion, dark theme)
  - test:e2e: Playwright — 8/8 pass (no horizontal scroll 320–1280; nav/FAQ/landmarks)
  - build: Vite → `dist/` with zero runtime deps.
- **Spec artifacts:**
  - `specs/features/clinica-aurora-landing/spec.md` — requirements (AC-*) + AC→command traceability.
  - `specs/features/clinica-aurora-landing/design.md` — stack decisions (D-*), repo structure, varied-composition plan, assumptions/open questions.
  - `specs/features/clinica-aurora-landing/tasks.md` — T1–T8 build tasks + verification.
  - `SPEC_BREAKDOWN` in the techlead task summary: `t_891d21f0` → `frontend` → `qa` + `security` → `qualitygate`.
- **Next step (downstream, do NOT run here):** independent QA card (`t_a9d98b2f`) + security card (`t_dfa95cc6`) — re-run the gate + manual viewport/keyboard evidence + code/security review; then quality-gate (`t_aa5654a0`) approves against `spec.md` ACs. Deployment/hosting + real contact data remain open questions (design.md §7 A-2 / A-4).

### Cross-project links
- Sibling (Nimbus demo) project — different feature/product, **not** part of this feature. Its `ADR-0001` was reused as the generic static-site standard. Do **not** re-write or copy Nimbus content into Clínica Aurora.
