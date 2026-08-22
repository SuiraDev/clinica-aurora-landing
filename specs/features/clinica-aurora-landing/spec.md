# Spec — Clínica Aurora Landing Page (melhoria responsiva + mais seções)

**Document type:** Feature specification (WHAT / WHY) — requirements with traceable IDs
**Owner / Author:** Tech Lead (task `t_891d21f0`)
**Status:** Baseline for downstream build ([frontend]), QA ([qa]), security/review ([security]) and quality gate ([qualitygate])
**Last updated:** 2026-08-22 (UTC)

> **Project root / storage contract:** all spec artifacts live under `<project-root>/specs/` at the repository root.
> **Baseline assets (current state):** `/opt/data/workspace/www/clinica-aurora/index.html` — single-page, inline HTML5 + CSS + vanilla JS, no build tooling, not yet a git repo.

---

## 1. Objective

The stakeholder (Clínica Aurora, estética avançada) wants the single-page landing page improved:

1. **Responsividade** — solid mobile/tablet/desktop behavior with no horizontal overflow at any viewport.
2. **Mais seções** — add *"Como funciona"*, *"Depoimentos"* and *"FAQ"* sections.
3. **Organização** — clearer information architecture, consistent hierarchy, and **varied composition per section** (not a generic card grid everywhere), all while keeping the professional, elegant, trustworthy tone of the aesthetic clinic brand.

## 2. Current state (baseline)

Existing sections in order: sticky nav → hero → trust band (3 items) → services/`tratamentos` (numbered rows: Limpeza de pele, Harmonização e bioestimuladores, Protocolos faciais e corporais, Skincare personalizado) → about/`sobre` (image + checks) → CTA/`agendar` (phone, WhatsApp, demo form) → footer → *tweaks* appearance panel (accent swatches, light/dark theme, motion toggle).

Current strengths to preserve:
- Design tokens (`:root` custom properties) + light/dark theme + accent override already implemented.
- Semantic sections, one `<h1>`, `header/nav/main/footer` landmarks, `prefers-reduced-motion` handling.
- Mobile nav (760px) and two-column→one-column collapses already present.

Current gaps (the work):
- **Inline script + `onerror` handlers + inline `style` on swatches** — conflicts with the team's CSP standard (`script-src 'self'` / `style-src 'self'`); must be externalized.
- **No "Como funciona" / "Depoimentos" / "FAQ"** sections.
- **Responsiveness is unverified** — the fixed *tweaks* panel and the 3-column service rows may overflow sub-480px widths; needs real-browser evidence.
- Composition is uniform (numbered list + image + CTA); the new sections must introduce varied layouts to satisfy the "organização / composição variada" ask.
- No git repo, no tooling (lint/tests/build), so the "lint/tests verdes no PR" acceptance criterion requires establishing the toolchain + CI (see `design.md`).

## 3. Requirements (traceable IDs)

### 3.1 Responsiveness
| ID | Requirement |
|----|-------------|
| AC-RES-1 | No horizontal overflow / no page-level horizontal scroll at **320, 390, 768, 1024, 1280** px. |
| AC-RES-2 | Responsive layout across **≥4 breakpoints** (≤480, ~768, ~1024, ≥1200); nav collapses into a mobile menu on small screens. |
| AC-RES-3 | Touch targets ≥ 44×44 CSS px on mobile (nav toggle, links, swatches, FAQ buttons). |
| AC-RES-4 | Every section (existing + new) must render correctly at all breakpoints without collapse/overlap/overflow; images scale with `max-width:100%` and correct `object-fit`. |
| AC-RES-5 | The fixed *tweaks* panel must not overlap / break navigation on mobile (reposition or make it scroll-safe). |

### 3.2 New sections & organization
| ID | Requirement |
|----|-------------|
| AC-SEC-1 | Add **"Como funciona"** section: a step-by-step flow (e.g. avaliação → plano → acompanhamento) using a timeline/steps layout — **not** a plain card grid. |
| AC-SEC-2 | Add **"Depoimentos"** (testimonials) section: realistic clinic testimonials presented with **varied composition** (e.g. alternating quote/feature layout, asymmetric grid) — **not** a generic card grid. |
| AC-SEC-3 | Add **"FAQ"** section: accessible disclosure/accordion (`<details>`/`<summary>`, or `button` + `aria-expanded` + `role=region`), with 4–6 clinic-relevant questions. |
| AC-SEC-4 | Update **information architecture**: nav links + footer reflect all sections; consistent section ordering; each new section gets an `id` anchor and appears in the nav. |
| AC-ORG-1 | **Varied composition per section** — a deliberate mix of layouts (numbered rows, timeline, asymmetric feature, testimonial quotes, accordion, image+copy split) instead of repeated uniform cards; retains elegant/professional brand tone. |
| AC-ORG-2 | Visual hierarchy consistent and clear: one `h1`, correct heading levels, consistent eyebrow/lead/CTA patterns; no style regressions in the existing brand tokens. |

### 3.3 Accessibility (WCAG 2.1 AA)
| ID | Requirement |
|----|-------------|
| AC-A11Y-1 | Exactly one `<h1>`; no skipped heading levels; landmarks `header`/`nav`/`main`/`footer` present; `<html lang="pt-BR">`. |
| AC-A11Y-2 | Keyboard operable: all interactive elements reachable & activatable, visible focus indicators, a skip link to `#main`. |
| AC-A11Y-3 | Text color contrast ≥ 4.5:1 (normal) / 3:1 (large) in both light and dark themes; accent on-background contrast verified. |
| AC-A11Y-4 | Images have meaningful `alt`; decorative SVGs `aria-hidden="true"`/`focusable="false"`. |
| AC-A11Y-5 | `prefers-reduced-motion` respected; the in-page Motion toggle works and default state honors reduced-motion. |

### 3.4 Automation / project standards
| ID | Requirement |
|----|-------------|
| AC-AUTO-1 | Lint green: **ESLint** (JS), **Stylelint** (CSS), **html-validate** (HTML) — semantic structure (one `<main>`, one `<h1>`, landmarks, `lang`, alt, no empty links). |
| AC-AUTO-2 | Build green: **Vite** → `dist/` with **zero runtime dependencies**; no inline scripts/styles/event handlers (CSP `script-src 'self'` / `style-src 'self'`). |
| AC-AUTO-3 | Structural/unit tests green (**Vitest + jsdom**) asserting **spec-defined markup outcomes** (sections present, heading order, landmarks, one h1, accordion state), not implementation details. |
| AC-AUTO-4 | axe (via **@axe-core/playwright**, real Chromium) reports **0 critical/serious** at all breakpoints (≤480, ~768, ~1024, ≥1200) **and** with `prefers-reduced-motion: reduce`. |

### 3.5 Security & delivery
| ID | Requirement |
|----|-------------|
| AC-SEC-1 | No backend / no external app integration; the demo form is client-side only and must fail closed (no real data sent); no secrets/credentials in the repo. |
| AC-SEC-2 | Security headers configured (CSP, X-Content-Type-Options, Referrer-Policy, etc.) via static-host `_headers` (Netlify) or equivalent. |
| AC-SEC-3 | Explicit non-goals: no real booking/CRM/payment/auth; PII entry (form) is demonstrative and not persisted. |

## 4. Acceptance-criteria → command traceability

| Acceptance | Verification |
|-----------|--------------|
| AC-RES-1/2/4/5 | `npm run test:e2e` (Playwright viewport/overflow checks) + QA viewport screenshots (see `qa` card + `tests/`) |
| AC-RES-2 | Manual QA evidence at 320/768/1024/1280 |
| AC-SEC-1/2/3 | `npm run test` (structural: sections/anchors/accordion) — spec-anchored |
| AC-A11Y-1/4/5 | `npm run test:a11y` (axe) + `html-validate .` + structural tests |
| AC-A11Y-2/3 | `npm run test:a11y` (axe: color-contrast, aria) + manual keyboard walkthrough in QA |
| AC-AUTO-1/2/3/4 | `npm run lint && npm run test && npm run test:a11y && npm run build` |
| AC-SEC-1/2 | `npm run test:e2e` (headers on preview) + security card audit |

Build tasks with exact commands: see `tasks.md`. Full architecture & stack: see `design.md`.
