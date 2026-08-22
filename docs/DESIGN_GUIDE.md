# Clínica Aurora — Design System Guide

**Version:** 1.0 · **Date:** 2026-08-22 (UTC)
**Author:** Design (task `t_bb03149b`) · **Consumers:** Frontend build (`t_bf950b46`), QA validation (`t_9db62463`)
**Scope:** A complete, actionable standard for rebuilding the Clínica Aurora landing page from scratch with a high-end, gallery-like aesthetic. Every value below is a **decision** a frontend developer can implement directly; placeholders and assumptions are explicitly flagged in §13.

> Reading order: principles (§1) → anti-AI-slop rules (§2) → brand concept (§3) → tokens (§4–§7) → components (§9) → per-section composition (§10) → responsive (§11) → accessibility (§12) → content placeholders (§13) → implementation checklist (§14).

---

## 1. Design principles

The Clínica Aurora brand is a high-end aesthetics clinic. The visual language should feel like a small, exacting beauty house — warm, calm, editorial — **not** a generic SaaS template. Five principles govern every decision below:

1. **Warmth first.** The palette is built on warm ivory/cream neutrals and a single refined terracotta accent. Never reach for a cool indigo, violet, or blue "tech" gradient. Cold palettes read as software, not as care.
2. **Editorial hierarchy.** Typography is the hero. A display serif for headlines, a warm humanist sans for body and UI. Whitespace and scale differences carry hierarchy, not boxes.
3. **One idea per section.** Every section makes exactly one visual point with one distinctive composition. Never repeat a uniform card grid across sections — variety is a requirement (§10).
4. **Craft over decoration.** Every visual device must earn its place (hairline rules, quote marks, a timeline). Nothing decorative, nothing that fakes substance. If it doesn't communicate, remove it.
5. **Calm confidence.** Generous rhythm, restrained motion, high contrast. The page should feel assured and unhurried.

---

## 2. Anti-AI-slop rules (hard prohibitions)

These are **blocking** — the Frontend build must not ship any of these patterns, and QA must fail the build if it finds them.

| # | Forbidden pattern | Definition | What to do instead |
|---|-------------------|-----------|--------------------|
| P1 | Generic blue/violet gradient | Any linear/radial gradient using indigo, violet, lavender, or blue as a hero, panel, or section background | Use flat warm neutrals and hairline rules. A subtle warm radial "dawn glow" in the hero (ivory → terracotta tint, ≤8% accent) is the ONLY permitted gradient, used in exactly one place (§10.1). |
| P2 | Generic icon–headline–sentence card grid | A repeated row/column of identical cards, each = icon + heading + sentence | Use a varied composition per section (§10): index rows, timeline, asymmetric quotes, accordion, image+copy split, centered invitation. |
| P3 | Default indigo/violet accent | `#6366f1`, `#8b5cf6`, `#6d28d9`, violet/purple/blue as the primary accent | Use the single refined terracotta accent (§4.1). |
| P4 | Decorative glassmorphism | Frosted-glass blur (`backdrop-filter: blur(...)`) used purely decoratively on panels/cards with no functional need | Glassmorphism is allowed only on the `header.nav` sticky bar, where a `color-mix` + subtle blur is functional (content scrolls beneath it). No other element may use `backdrop-filter`. |
| P5 | Fake decor metrics / numbers | Unverified or purely decorative stat counters ("+8 anos", "500+ clientes", "98% satisfação") used as hero/CTA ornament | Use NO fabricated numbers. If the clinic supplies a real, verifiable metric, use at most ONE, in §10.3 only. Otherwise replace with a non-numeric trust cue (§10.1). |

**Lint-style checks for QA:** scan the built CSS/HTML for `linear-gradient`/`radial-gradient` (allow exactly one, the hero glow), `backdrop-filter` (allow exactly one, the nav), indigo/violet hex family in the accent role, and any `\d+[+]`/`\d+%` stat in the hero or CTA. Any violation = blocking defect.

---

## 3. Brand concept

**"Aurora" = the first light of day.** The identity is light arriving softly on warm surfaces — a dawn-lit clinic. Concretely:

- **Mood:** quiet luxury, clinical confidence, genuine care.
- **Feel:** gallery wall meets spa. Big type, soft warm neutrals, hairline structure, one warm focal accent.
- **Voice (copy):** plain, warm, first-person-plural, no hype, no superlatives. Sentences are short. Claims are careful and honest.
- **Form language:** soft radius, hairline separators, generous whitespace, tall portrait imagery. Avoid hard/sharp tech shapes and avoid rounded "pill for everything" monotony — radius is a scale, not a single value (§7.1).

---

## 4. Color system

The palette is **warm neutrals + ONE refined accent**. The core neutrals and accent below are carried from the existing, already-contrast-verified baseline; the refinement adds a second accent step and a proper role taxonomy. All text pairs are verified ≥ 4.5:1 (AA) in both themes and must be re-confirmed by the axe gate at build time (§12.4).

### 4.1 Token — Light theme (default)

Declare these in `:root` (light is the default). All values in hex.

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#FBF7F2` | Page canvas — warm ivory |
| `--surface` | `#FFFFFF` | Cards, panels, nav, footer |
| `--surface-tint` | `#F3E7DF` | Soft warm surface for tinted panels/section flips |
| `--ink` | `#221A16` | Primary text — warm near-black |
| `--ink-soft` | `#57463D` | Secondary text / lead intro |
| `--muted` | `#6E5D55` | Tertiary text, captions, meta, placeholder |
| `--line` | `#E5D8CF` | Hairline borders, dividers, separators |
| `--accent` | `#A85942` | The single refined accent (terracotta / burnt sienna) |
| `--accent-deep` | `#8A3E2E` | Accent for small text + hover/active state (guaranteed AA) |
| `--on-accent` | `#FFF9F4` | Text/icon on `--accent` or `--accent-deep` fill |
| `--focus` | `#8A3E2E` | Focus indicator outline |

### 4.2 Token — Dark theme

Declared in `[data-theme="dark"]`. The accent is **lifted** (lighter) so it holds contrast against the dark canvas. On-accent text goes dark.

| Token | Value | Role |
|-------|-------|------|
| `--bg` | `#181211` | Page canvas — near-black warm |
| `--surface` | `#211B19` | Cards, panels, nav, footer |
| `--surface-tint` | `#2A211C` | Soft warm surface for tinted panels/flips |
| `--ink` | `#F5EEEA` | Primary text |
| `--ink-soft` | `#E0D4CD` | Secondary text / lead |
| `--muted` | `#B3A59D` | Tertiary text, captions, meta |
| `--line` | `#3A2E28` | Hairline borders/dividers |
| `--accent` | `#C98A76` | The accent, lifted for dark |
| `--accent-deep` | `#E0A795` | Accent for small text (safe on dark) |
| `--on-accent` | `#21150F` | Text/icon on `--accent` fill (dark) |
| `--focus` | `#C98A76` | Focus indicator outline |

### 4.3 Verified WCAG 2.1 AA contrast (light / dark)

Computed from the declared tokens. **Both text and interactive states must stay ≥ 4.5:1** (≥ 3:1 for large text ≥ 24px, and ≥ 3:1 for non-text like focus indicators and iconography). Re-verify with axe in real Chromium for both themes + all breakpoints.

| Pair | Light | Dark | Verdict |
|------|-------|------|---------|
| `--ink` on `--bg` (body) | 15.6 | 15.9 | ≥4.5 PASS |
| `--ink-soft` on `--bg` (lead) | 8.9 | 10.1 | ≥4.5 PASS |
| `--muted` on `--bg` (captions) | 5.5 | 8.1 | ≥4.5 PASS |
| `--muted` on `--surface` | 5.7 | 7.4 | ≥4.5 PASS |
| `--accent` on `--bg` (large accent text) | 4.7 | 6.0 | ≥4.5 PASS |
| `--accent` on `--surface` (large) | 5.0 | 5.5 | ≥4.5 PASS |
| `--accent-deep` on `--bg` (eyebrow/labels) | 7.0 | 7.4 | ≥4.5 PASS |
| `--accent-deep` on `--surface` | 7.5 | 6.8 | ≥4.5 PASS |
| `--on-accent` on `--accent` (button) | 4.8 | 5.8 | ≥4.5 PASS |
| `--line` on `--bg` (non-text divider) | 1.3 | 1.4 | 3:1 NOT MET — see §12.5 |

> **Note on `--line`:** hairlines are decorative separators and may fall below 3:1. They must **never** be the sole indicator of an interactive control boundary (e.g. a focusable input border). Interactive borders use `--accent` / `--accent-deep` on focus, and button/input outlines always have a visible focus state (§12.2).

### 4.4 Accent usage rules

- **Buttons / primary actions / markers / timeline nodes:** use `--accent` fill + `--on-accent` text. Hover uses `--accent-deep`.
- **Eyebrow labels, small links, form status, quote marks, index numbers, check marks:** use `--accent-deep` in light (guaranteed AA for small text). In dark use `--accent-deep` (`#E0A795`).
- **Large display accents (statistic number, big decorative element):** `--accent` is fine.
- **Never** use violet, blue, or any cool accent anywhere. Keep exactly one accent family.
- **Theme-aware accent switching (the "Ajustes de aparência" panel):** when a user picks an accent swatch, `--accent` AND `--accent-deep` AND `--on-accent` must all be recomputed together, per theme, so every pair stays AA (§12.7) — this fixes the existing dark-mode contrast defect (D1).

---

## 5. Typography

A **strong editorial serif + humanist sans** pairing. The serif is the voice; the sans is the hand.

### 5.1 Font family

- **Display serif — `"Fraunces"`** (Google Fonts, variable optical size) for all headings, blockquotes, index numbers, and the statistic. **Fallback:** `"Playfair Display", Georgia, serif`. Load weights `400;500;600` + `italic`.
  - *Why:* Fraunces has a soft, slightly wonky, high-end editorial character that reads "boutique beauty house" rather than "template". Playfair is the already-present fallback so nothing breaks if Fraunces fails to load.
- **Humanist sans — `"Manrope"`** for body text, buttons, nav, forms, captions. **Fallback:** `system-ui, -apple-system, "Segoe UI", sans-serif`. Load weights `400;500;600;700`.
  - *Why:* Manrope is warm and geometric-humanist, pairs cleanly with the serif, and is already in the font budget.

Both load via the existing Google Fonts `<link>` pattern; the CSP already allows `fonts.googleapis.com` (style) and `fonts.gstatic.com` (font) (§12.6).

### 5.2 Type scale (fluid, mobile → desktop)

Use `clamp(min, preferred-vw, max)` so type scales smoothly and never overflows. Set these as typography tokens.

| Role | Token | Value | Serif/Sans | Weight | Line-height | Letter-spacing |
|------|-------|-------|-----------|--------|-------------|----------------|
| Display (hero H1) | `--text-display` | `clamp(2.6rem, 6vw, 4.75rem)` | serif | 500 | 1.02 | `-0.5px` |
| H2 section | `--text-h2` | `clamp(2rem, 4vw, 3.25rem)` | serif | 500 | 1.08 | `-0.3px` |
| H3 sub | `--text-h3` | `clamp(1.25rem, 2vw, 1.6rem)` | serif | 500 | 1.2 | `0` |
| Blockquote | `--text-quote` | `clamp(1.35rem, 2.6vw, 2rem)` | serif | 500 italic | 1.3 | `0` |
| Eyebrow/label | `--text-eyebrow` | `.78rem` | sans | 700 | 1.3 | `+0.16em` (uppercase) |
| Lead intro | `--text-lead` | `clamp(1.08rem, 1.6vw, 1.22rem)` | sans | 400 | 1.6 | `0` |
| Body | `--text-body` | `1rem` | sans | 400 | 1.65 | `0` |
| Small/meta | `--text-meta` | `.9rem` | sans | 400 | 1.5 | `0` |
| Caption | `--text-caption` | `.82rem` | sans | 500 | 1.4 | `+0.02em` |
| Button | `--text-btn` | `.95rem` | sans | 600 | 1.2 | `0` |

### 5.3 Type rules

- **One `<h1>`** on the page (the hero). Section `<h2>`, subitems `<h3>`. Never skip a heading level.
- `text-wrap: balance` on headings, `text-wrap: pretty` on body paragraphs (already the baseline pattern).
- **Uppercase eyebrows** carry tracking (`+0.16em`) and use `--accent-deep`. They are the consistent "label" that ties sections together.
- **Measure:** body paragraphs capped at `60ch`; lead at `54ch`. Headings at `max-width: 22ch` for strong line breaks.
- **Emphasis via scale, not color or weight alone:** make an element bigger *or* give it the serif; don't rely on color-only distinction (contrast + not-color cues per §12).
- **Font smoothing:** `-webkit-font-smoothing: antialiased` on `body`.

---

## 6. Spacing & rhythm

A single 4px modular scale drives all spacing so the page feels composed, never arbitrary.

### 6.1 Space scale (token → value)

| Token | px | Token | px |
|-------|----|-------|----|
| `--space-1` | 4 | `--space-5` | 32 |
| `--space-2` | 8 | `--space-6` | 48 |
| `--space-3` | 12 | `--space-7` | 64 |
| `--space-4` | 16 | `--space-8` | 96 |
| | | `--space-9` | 128 |

Use only these values (or 2× a listed value) for margin/padding. Half and quarter steps of 4/8/12 are permitted for fine alignment inside components and forms.

### 6.2 Section rhythm (vertical)

- **Desktop (≥1024px):** `padding-block: 6rem` (`--space-9 * ~1.2`) between sections, i.e. section top/bottom `~96px`. Adjacent sections that share a background may tighten to `4rem`.
- **Tablet (760–1024px):** `padding-block: 4.5rem`.
- **Mobile (≤760px):** `padding-block: 3.5rem`.
- **Section head spacing:** heading block sits `--space-6` (48px) above its content.

### 6.3 Container & gutters

- `--container-max: 1160px`; `--wrap` centers with `max-width: var(--container-max)` and `margin-inline: auto`.
- **Gutter:** `padding-inline: 24px` (desktop) → `20px` (mobile ≤480px).
- **Hero/featured columns** may exceed the wrap slightly via negative margin or a wider container, but must never cause horizontal overflow (§11).
- Content blocks that should read "narrow" (FAQ, form, lead copy) use `max-width: 760px` / `640px` / `54ch`.

### 6.4 Rhythm guidance

- **Whitespace is intentional.** If a section feels crowded, add space — never add decoration.
- **One idea per section stays one idea:** a section's rhythm is defined by its own composition (§10), then that rhythm is *not* repeated verbatim by the next section.
- Background alternation uses `--surface` / `--surface-tint` flips for a quiet "chapter" feel — do **not** rely on heavy shadows or borders to separate sections (hairlines are enough).

---

## 7. Shape & elevation

### 7.1 Radius scale

| Token | Value | Use |
|-------|-------|-----|
| `--radius-s` | 10px | Inputs, small controls |
| `--radius-m` | 14px | Side quotes, chips, small cards |
| `--radius-l` | 20px | Cards, panels, featured quote |
| `--radius-pill` | 999px | Buttons, avatar initials, nav toggle |
| `--radius-arch` | `200px 200px var(--radius-l) var(--radius-l)` | Hero image frame — the signature "portal/arch" shape |

The **arch** hero frame is the one distinctive, non-generic shape in the system (§10.1). Everywhere else, radius is a scale — don't make everything a pill.

### 7.2 Elevation / shadow

Elevation is subtle and reserved. Use exactly one soft ambient shadow token, applied sparingly.

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-1` | `0 24px 60px -40px rgba(34,26,22,.35)` | Cards/panels raised over the canvas |
| `--shadow-2` | `0 30px 70px -40px rgba(34,26,22,.5)` | Nav / sticky / floating panel, elevated used only where a surface overlays scroll |

**Rules:** prefer hairlines (`--line`) over shadows for separation. Use `--shadow-1` for the featured quote and about image; `--shadow-2` only for the sticky nav and the appearance panel. Avoid layered/multi-shadow "floaty" treatments. In dark theme, shadows are much closer to black (`rgba(0,0,0,.5)`).

### 7.3 Motion

Motion is calm and brief. Define tokens so reduced-motion is trivial.

| Token | Value |
|-------|-------|
| `--ease` | `cubic-bezier(.2,.6,.2,1)` |
| `--dur-fast` | `160ms` |
| `--dur` | `280ms` |
| `--dur-slow` | `420ms` |

- Use for: hover lift (`translateY(-2px)`), image fade-in, nav/mobile-menu open, FAQ disclosure, appearance-panel open.
- **No entrance animations** that retrigger on scroll (no scroll-triggered fade/slide libraries). Static content; motion only on interaction/hover.
- Honor `prefers-reduced-motion: reduce` by zeroing all transitions/animations AND forcing `scroll-behavior: auto`, and keep the in-page Motion toggle (§12.5, §9.6).

---

## 9. Component library

Every component below is a repeatable primitive. The **only** generic "card" allowed is the **quote card** (§9.5) and the **featured image frame** (§9.6); never build a uniform icon+headline+sentence grid (§2 P2).

### 9.1 Buttons

Two variants, both with a visible focus state and a `min-height: 44px` touch target.

| Variant | Fill | Text | Hover |
|---------|------|------|-------|
| `.btn` (base) | — | `--text-btn` | — |
| `.btn-primary` | `--accent` | `--on-accent` | `--accent-deep` bg + `translateY(-2px)` + `--shadow-1` |
| `.btn-ghost` | transparent | `--ink` | border-color → `--accent`, text → `--accent-deep` |

- Base: `display:inline-flex; align-items:center; justify-content:center; gap:.5rem; padding:.92rem 1.5rem; border-radius:999px; border:1px solid transparent; font-weight:600; min-height:44px;` transition `transform var(--dur-fast) var(--ease), background var(--dur-fast), box-shadow var(--dur-fast)`.
- **Ghost border** uses `--line` (or a 1px `--accent`-tinted border) — but on focus it must get a clear `--focus` outline, never rely on the hairline alone (§7.2 rule, §12.5).
- Full-width variant on mobile when stacked (`width:100%`).
- `:focus-visible { outline:3px solid var(--focus); outline-offset:2px; border-radius:var(--radius-s) }`.

### 9.2 Navigation

**Desktop:** sticky `header.nav`, `height: 72px`, background `color-mix(in srgb, var(--bg) 85%, transparent)` + `backdrop-filter: blur(10px)` (the only permitted glassmorphism, §2 P4), `border-bottom: 1px solid var(--line)`. Contains: logo (serif wordmark, accent on "Aurora"), centered/right link group, primary CTA button.

- Links: `--text-meta`, weight 500, `hover → --accent-deep`, generous `padding-block` for a 44px hit area.
- Sticky uses `scroll-padding-top: calc(var(--nav-h) + 8px)` so in-page anchors don't hide behind the bar.
- **Logo:** `Clínica Aurora` — "Clínica" in `--ink`, "Aurora" set in `--accent` serif.

**Mobile (≤1024px):** the link group collapses into a full-screen sheet/drawer behind a hamburger `button.nav-toggle` (44×44). Toggle sets `aria-expanded` and reveals a `nav` region; the sheet closes on link click, on `Escape`, and on outside click. Keep it keyboard-operable and trap focus while open (§12).

### 9.3 Section head

The reusable intro for each content section: an eyebrow + a serif `<h2>`. `max-width: 640px`, eyebrow above the heading, `margin-bottom: var(--space-6)`. Optionally a one-line lead under the heading.

```html
<div class="section-head">
  <span class="eyebrow">Nossos procedimentos</span>
  <h2>Tratamentos que respeitam a sua pele e o seu tempo.</h2>
</div>
```

### 9.4 Forms (demo booking form)

A single-column demo form (client-side only, §12.8). Example — one field block each for Nome and WhatsApp, a submit button, and a live region for confirmation.

- Field: `<div class="field">` with an explicit `<label for>` and its `input`. `display:grid; gap:.4rem`. Label is `--text-caption` weight 600 in `--muted`.
- Input: `padding:.85rem 1rem; border:1px solid var(--line); border-radius:var(--radius-s); background:var(--bg); color:var(--ink); font-size:.95rem; min-height:44px;`
- **Focus:** `outline:2px solid var(--focus); outline-offset:1px; border-color:var(--accent)` — this is the only place a border carries the interactive affordance, so it must meet 3:1 (use `--accent`, never `--line` alone).
- Status message: `<p class="form-status" role="status">` (live region) so success/failure is announced (§12.2, fixes D3).
- **Fail closed:** the submit handler `preventDefault()`, shows the status, resets the form; no data ever leaves the client (§12.8).

### 9.5 Quote card (featured)

The single large editorial pull-quote used in Depoimentos. Inside a `figure`; serif italic blockquote with accent quote marks.

- `.t-featured`: `background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-l); padding: 2.4rem; box-shadow: var(--shadow-1);`
- `blockquote::before/::after` render `“` / `”` in `--accent-deep`.
- Attribution row: a small avatar **initials** circle (`--radius-pill`, `--surface-tint` bg, `--accent-deep` initials) + name (sans, 700) + subtitle (caption, `--muted`).

### 9.6 Featured image frame

The hero portrait / about image, sitting in a clipped frame. `overflow: hidden; background: var(--surface-tint);` image fills with `object-fit: cover`. Hero frame uses the signature `--radius-arch`; the about image uses `--radius-l`. On hover, images get a gentle opacity transition. Keep `loading` lazy where below the fold, `eager` for the hero. A `max-width: 100%` on the image prevents overflow.

### 9.7 Trust item

A quiet inline value statement used in the trust band. **Not** a card — a hairline-separated row/column.

```html
<div class="trust-item">
  <span class="dot" aria-hidden="true"></span>
  <div>
    <p class="trust-title">Profissionais certificados</p>
    <p>Equipe qualificada e em constante atualização.</p>
  </div>
</div>
```

- `.dot`: 9px `--accent` circle (the smallest accent mark in the system).
- Title: sans, weight 700, `--ink`. Body: `--text-meta`, `--muted`.

### 9.8 Accordion (FAQ)

Native `<details>/<summary>` for an accessible, dependency-free disclosure (§12). The only animated interactive element besides the nav/panel.

- `.faq`: `background: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-l); overflow: hidden;`
- `summary`: `min-height: 44px; padding: 1.1rem 3rem 1.1rem 1.4rem; cursor:pointer;` hide the marker (`::-webkit-details-marker`), put a `+`/`–` glyph on the right in `--accent-deep`.
- Open state flips the glyph to `–`; content `<p>` uses `--muted`.
- Keyboard/screen-reader safe by native semantics. Keep `aria` to a minimum — native disclosure is preferred.

### 9.9 Appearance panel (the "Ajustes de aparência" — a differentiator)

Keep this live customizer (it already exists and is a real feature): accent swatches, theme toggle, motion toggle. Rules:

- **Collapsed state must not be reachable by keyboard or exposed to AT.** When closed, apply `inert` (or `aria-hidden="true"`/`hidden`) in addition to `opacity:0` + `pointer-events:none` (fixes D2). Toggle button uses `aria-expanded` + `aria-controls`.
- **Accent switching must be theme-aware** (§4.4) — recompute `--accent`, `--accent-deep`, `--on-accent` together per theme so AA holds (fixes D1).
- Swatches and theme buttons are real `<button>`s with `aria-label`/`aria-pressed`; swatches are the **only** place a "display-only" 38px size may exist, but they must be ≥44px on touch (≤760px) and ≥38px with a clear focus ring elsewhere (fixes D4 partially).
- The panel is `position: fixed; bottom-right; width: 252px; max-height: calc(100vh - 110px); overflow-y: auto`. On mobile it must not overlap the nav — ensure a safe offset from the bottom and the header (AC-RES-5).

---

## 10. Layout & composition — one idea per section

This is the section that satisfies the "composição variada" requirement. **Every section makes exactly one visual point, with a distinct composition.** No two adjacent sections repeat the same layout. Order and structure below are authoritative for the rebuild; copy comes from the existing app (§13).

| # | Section (anchor) | One idea | Composition |
|---|------------------|----------|-------------|
| 1 | Hero (`#inicio`) | Dawn asymmetry | Split: oversized serif headline + tall arch portrait |
| 2 | Trust band | Quiet proof | Hairline row of 3 inline statements |
| 3 | Tratamentos (`#tratamentos`) | The index | Numbered editorial rows 01–04 |
| 4 | Como funciona (`#como-funciona`) | The route | Vertical timeline / steps |
| 5 | Depoimentos (`#depoimentos`) | Voices | Large featured quote + two side quotes |
| 6 | FAQ (`#faq`) | The conversation | Native accordion |
| 7 | Sobre (`#sobre`) | The portrait | Image + manifesto copy split |
| 8 | Agendar (`#agendar`) | The invitation | Centered panel + demo form |
| 9 | Footer | Colophon | Simple two-column foot |

### 10.1 Hero — "Dawn asymmetry"

- **Layout:** two-column grid (`1.1fr .9fr`) on desktop; **stack on ≤900px** (text first, image second).
- **Text column:** eyebrow (`--accent-deep`) → serif `<h1>` (`--text-display`) → lead (`--text-lead`, capped `54ch`) → two CTAs (`btn-primary` "Agendar avaliação" + `btn-ghost` "Conhecer tratamentos").
- **Image column:** the signature **arch** frame (`--radius-arch`, `aspect-ratio: 4/5`) containing a warm aesthetic-clinic portrait, `box-shadow: var(--shadow-2)`, `overflow: hidden`.
- **The ONE permitted gradient:** a soft radial "dawn glow" behind the text column — `radial-gradient(60% 60% at 85% 30%, var(--surface-tint), transparent 70%)`, absolutely positioned, `pointer-events: none`. This is the **only** gradient in the entire build (§2 P1). No blue, no purple, no glass card.
- **Trust cue replaces the fake stat:** do **not** render "+8 anos" or any number/percentage as a floating badge. Instead, place a single quiet line under the CTAs (or at the image's foot): "Avaliação inicial gratuita · Equipe certificada" as a `--text-caption` in `--muted`. If the clinic later confirms ONE real, verifiable metric, it may appear here or in §10.3 — never as a decorative counter (§2 P5).
- **Background** is flat `--bg` (no full-bleed texture). Negative space is the point.

### 10.2 Trust band — "Quiet proof"

A single horizontal band framed by top/bottom hairlines on `--surface`. Three `.trust-item` columns separated by `--line` dividers (desktop), **stacking to one column with a top-divider on mobile**. Each: 9px `--accent` dot + bold title + one quiet line. No icons, no cards, no numbers.

### 10.3 Tratamentos — "The index"

A typographic index, **not** a grid. A vertical list of four rows, each split by a hairline. Each row: a serif index number (`01`–`04`, `--accent-deep`, large) + serif `<h3>` (the treatment) + a short body line (`--muted`, capped width). Row layout: `grid-template-columns: 70px 1fr 1.3fr` on desktop; on tablet/mobile the body collapses under the title (`grid-template-columns: 46px 1fr`). Hover: a very subtle `--surface-tint` wash across the row (`linear-gradient(90deg, transparent, var(--surface-tint), transparent)`) — a soft highlight, not a card lift.

Four items (real copy, unchanged): Limpeza de pele · Harmonização e bioestimuladores · Protocolos faciais e corporais · Skincare personalizado.

### 10.4 Como funciona — "The route"

A numbered **timeline** of three steps, on `--surface` with a top hairline ("chapter flip"). Each step: a filled circle marker `--radius-pill` (36px, `--accent` bg, `--on-accent` serif number) + a vertical connecting hairline beneath it + a serif `<h3>` and a short body line.

- **Mobile/tablet:** single column, vertical line down the left, markers at left, text right of the marker. (`1fr`)
- **Desktop (≥1024px):** **three columns** with the progress line running horizontally linking the three markers (`grid-template-columns: repeat(3, 1fr)`; a horizontal hairline behind/through the markers). This implements the intended `3-col desktop` layout that the current build left as a single column (defect D6).

Steps (unchanged): Avaliação individual → Plano personalizado → Acompanhamento contínuo.

### 10.5 Depoimentos — "Voices"

**Asymmetric featured quote**, not an equal grid. One large `.t-featured` pull-quote (serif italic, `--text-quote`, accent quote marks, `box-shadow: var(--shadow-1)`) occupying the left 2/3, beside a `.t-side` column of **two** shorter `.t-quote` cards (left-accent-border `1px`/4px, `--radius-m`) stacked vertically on the right 1/3.

- Desktop: `grid-template-columns: 1.6fr 1fr; gap: 2rem; align-items: start`.
- ≤900px: **stack** into one column (featured first, then the two short quotes).
- **No card grid, no icons.** Only the accents (quote marks + the small left rule). This is the branded "quote card".

Copy: one featured quote (Mariana C., harmonização) + two shorter ones (Ricardo A., skincare; Juliana S., protocolo facial). All three are existing realistic testimonials — treat as real copy (§13).

### 10.6 FAQ — "The conversation"

A maximally narrow `max-width: 760px` centered column of 5 native `<details>` accordions (`.faq`, gridded `gap: .8rem`). Each opens with a serif/sans h3 inside `<summary>` and a `--muted` answer `<p>`. `aria` only where native disclosure is insufficient. 5 questions (existing): A avaliação é paga? · Preciso de algum preparo? · Os resultados são permanentes? · Quais formas de pagamento? · Posso agendar pelo WhatsApp?

### 10.7 Sobre — "The portrait"

A two-column split: **image left** (the "portrait" — clinic space or a warm treatment photo in a `--radius-l` frame, `aspect-ratio: 4/3`, `box-shadow: var(--shadow-1)`) and **copy right** ("Why Aurora" eyebrow + serif `<h2>` + a lead paragraph + a 4-item check list + a `btn-primary` CTA).

- Check list items are hairline-underlined rows with an `--accent-deep` ✓ prefix (not a card).
- Desktop `grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center`; **stack ≤900px** (image first, copy second).
- Copy (existing): "Cuidado que respeita você." + 4 checks + CTA "Agendar minha avaliação".

### 10.8 Agendar — "The invitation"

A single **centered panel** on a subtle `--surface-tint` (or `color-mix(in srgb, var(--accent) 6%, var(--bg))`) fill — a flat tint, **not** a gradient (§2 P1). `border: 1px solid var(--line); border-radius: var(--radius-l); padding: 3.2rem; text-align: center; box-shadow: var(--shadow-1)`.

- Eyebrow "Vamos conversar" + serif `<h2>` "Agende sua avaliação." + lead.
- CTA row: `btn-primary` "Ligar agora" (`tel:`) + `btn-ghost` "WhatsApp" (`wa.me`) — **both must use the same, real number** (§13 A-4, fixes D5).
- Contact meta: address + hours as `--text-meta` in `--muted`.
- The **demo booking form** (§9.4) sits beneath, centered, `max-width: 440px`.

### 10.9 Footer — "Colophon"

Two-column: branding + copyright on the left, a slim nav (Tratamentos · Depoimentos · FAQ · Contato) on the right. `border-top: 1px solid var(--line); background: var(--surface); padding: 3rem 0 2.4rem`. No giant footer, no newsletter, no fake links. A quiet end to the page.

---

## 11. Responsive breakpoints

Four declared breakpoints, aligned to the spec's viewports. Use `max-width` media queries (mobile-first but the existing build uses max-width; either is fine — be consistent).

| Breakpoint | Viewport | Key behavior |
|-----------|----------|--------------|
| — | ≥1200px | Desktop: full two-column splits, 3-col timeline, featured-quote asymmetry |
| Tablet | ≤1024px | Nav collapses to the mobile drawer; hero/about/history grids → 1 col |
| Tablet small | ≤900px | Hero, about, testimonials stack to one column |
| Mobile | ≤760px | Reduced section padding; form/CTA stack; swatch/theme controls ≥44px |
| Small mobile | ≤480px | Tighter gutters (`20px`); CTAs full-width; single-col everything |

**Hard rules (AC-RES):**

- **No horizontal overflow** at 320, 390, 768, 1024, 1280 px. `img { max-width: 100% }`, `overflow-x: hidden` never as a fix for a broken layout, `min-width: 0` on grid children.
- Every section renders cleanly at every breakpoint — no overlap, no collapse, no clipped text. Images keep `object-fit: cover` and correct aspect ratios.
- **Touch targets ≥ 44×44px** on mobile: nav toggle, links, swatches, FAQ buttons, theme toggle, inputs, primary buttons. (Fix D4 — make 44px the base on mobile/touch, not just ≤760px.)
- The fixed appearance panel must not overlap the header/nav on mobile and must scroll-safe (`max-height`, offset from bottom) — AC-RES-5.
- `prefers-reduced-motion` respected at every breakpoint.

---

## 12. Accessibility guidance (WCAG 2.1 AA)

The build must pass axe (real Chromium) with **0 critical/serious** at all four breakpoints **and** under `prefers-reduced-motion: reduce`, in both themes. These are the implementation requirements plus the specific fixes for the known baseline defects (D1–D5).

### 12.1 Structure & landmarks (AC-A11Y-1, AC-AUTO-1)
Exactly **one `<h1>`** (hero). Landmarks `header` / `nav` / `main` / `footer`, and `html lang="pt-BR"`. No skipped heading levels. A `skip-link` to `#main` at the top. `.sr-only` for visually-hidden labels where needed.

### 12.2 Keyboard & focus (AC-A11Y-2)
All interactive elements reachable and activatable by keyboard. **Visible focus** via `:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px }`. Tab order is logical (top → bottom). The mobile drawer traps focus while open and closes on `Escape`. The FAQ disclosure is native. **The demo-form status and the appearance panel states must be announced:** status `<p role="status">` (fixes D3); panel toggled with `inert`/`aria-hidden` when collapsed (fixes D2).

### 12.3 Contrast (AC-A11Y-3)
Use the token pairs verified in §4.3 (all ≥ 4.5:1). Large text (≥24px) may use ≥ 3:1. `--accent` for small text is safe only in dark; in light use `--accent-deep` for eyebrows/links/small accent text. **The accent-switch feature must recompute accent + accent-deep + on-accent together per theme** so the button label never falls below AA (fixes D1).

### 12.4 Images / SVG (AC-A11Y-4)
Meaningful `alt` on content images; decorative SVGs `aria-hidden="true"` + `focusable="false"`. Avatar initials and brand marks are decorative `aria-hidden`. No `<img>` without `alt`.

### 12.5 Non-text contrast & hairlines (WCAG 1.4.11, O1)
Hairlines `--line` are decorative and may be below 3:1. But **any boundary that is the sole indicator of an interactive control must reach 3:1.** On focus, inputs and buttons get a `--focus`/`--accent` outline; never rely on `--line` alone to delineate a clickable/editable control.

### 12.6 Motion & CSP (AC-A11Y-5, AC-AUTO-2)
Honor `prefers-reduced-motion: reduce` (kill transitions/animations, `scroll-behavior: auto`) and keep the Motion toggle; the default state honors reduced-motion. Keep the CSP-safe discipline: **no inline `script`/`style`/`on*`/`style=` attributes** — assets externalized (`script-src 'self'`, `style-src 'self'`). Google Fonts (`fonts.googleapis.com` style, `fonts.gstatic.com` font) allowed.

### 12.7 Form & a11y of the customizer (defects D2, D3, D4, D5)
- Form: `<label for>` each input; native `required`; `role="status"` live region; `preventDefault()` + reset; fail closed, no PII leaves the client (AC-SEC-1/3).
- Appearance panel: collapsed → `inert`/`aria-hidden`; buttons labeled; swatch/theme controls ≥44px on touch.
- Contact: same real, dialable `tel:` and WhatsApp number everywhere (A-4). Never ship a masked `tel:`.

---

## 13. Content — placeholders & assumptions

The **structure and most copy are real** (preserved from the current landing). The following are **non-final** and are flagged as placeholder/assumption. A frontend developer must NOT invent facts; where an item is unknown, use the placeholder text and mark it clearly so QA flags it.

| Ref | Item | Status | Guidance |
|-----|------|--------|----------|
| A-1 | Imagery (Unsplash) | assumption | Keep remote with valid `alt` (existing). Warm, real, non-cliché beauty/clinic photos. No stocky "tech gradient" imagery. Add a graceful fallback. |
| A-2 | Hosting / GitHub remote for deploy | open question | Netlify preferred; provisioned by stakeholder (AC-DEL). Static build, no runtime deps. |
| A-3 | Demo booking form | assumption | Client-side only, not persisted (AC-SEC-1/3). Real booking/CRM is out of scope (v1.1+). |
| A-4 | **Contact: phone / WhatsApp / address / hours** | **placeholder** | The current `tel:+55...` is **masked/non-dialable** (defect D5) and the WhatsApp number differs. Use ONE consistent, real, dialable `tel:` and `wa.me` number + a real address/hours before go-live. Until confirmed, keep the placeholder and mark it PLACEHOLDER. |
| A-5 | **"+8 anos de experiência" badge** | **placeholder / remove** | Do not render a fake or unverified stat (§2 P5). Replace with a non-numeric trust cue (§10.1). If the clinic confirms a real, verifiable credential/year, use at most ONE. |
| A-6 | Testimonials (names + details) | assumption (real copy) | Keep the three existing realistic testimonials as-is. Initials avatars are decorative. |
| A-7 | Font choice — Fraunces serif | assumption | Recommend Fraunces; Playfair Display is the fallback. If Fraunces can't load, the fallback must keep the same weight/optical feel. |

> All copy text shown in this guide (headlines, leads, section copy, FAQ answers, checks) is reproduced from the existing app and is treated as the source of truth for structure. Only the flagged items above are non-final.

---

## 14. Implementation checklist (for the frontend build)

Use this as the working checklist. When complete, the guide is satisfied and the acceptance criteria are met.

**Tokens & foundations**
- [ ] Design tokens for color (§4.1/4.2), type (§5.2), space (§6.1), radius/shadow/motion (§7) declared as CSS custom properties in `:root` + `[data-theme="dark"]`.
- [ ] Fraunces + Manrope loaded; fallbacks wired (§5.1).

**Anti-AI-slop**
- [ ] No blue/violet/indigo anywhere; exactly ONE gradient (the hero dawn glow §10.1); exactly ONE `backdrop-filter` (the nav §9.2); no generic icon-card grid (§2); no fake stat (§10.1/§13 A-5).

**Sections, in order (§10)**
- [ ] Hero (dawn split + arch image + trust-cue line) · [ ] Trust band · [ ] Tratamentos (index rows 01–04) · [ ] Como funciona (3-col timeline on desktop) · [ ] Depoimentos (asymmetric featured quote) · [ ] FAQ (5 accordions) · [ ] Sobre (image+copy split + checks) · [ ] Agendar (centered invitation panel + demo form) · [ ] Footer (colophon).

**Components (§9)**
- [ ] Buttons (primary/ghost, 44px, focus ring) · [ ] Nav (sticky + mobile drawer, focus trap) · [ ] Section head · [ ] Quote card · [ ] Featured frame · [ ] Trust item · [ ] Accordion · [ ] Demo form · [ ] Appearance panel (inert when closed, theme-aware accent).

**Accessibility (§12)**
- [ ] One `<h1>`, landmarks, `lang="pt-BR"`, skip-link · [ ] Visible focus, keyboard-operable, `role="status"` on form status · [ ] Contrast via §4.3 tokens, theme-aware accent switching (fix D1) · [ ] Panel `inert`/`aria-hidden` when closed (fix D2) · [ ] 44px touch targets on mobile (fix D4) · [ ] Reduced-motion + Motion toggle · [ ] Real same-number `tel:` / `wa.me` (fix D5).

**Responsive (§11)**
- [ ] No horizontal overflow at 320/390/768/1024/1280 · [ ] Clean render at all breakpoints · [ ] Panel nav-safe on mobile.

**Quality gates (must all be green)**
- [ ] `npm run lint` (ESLint + Stylelint + html-validate)
- [ ] `npm run test` (Vitest + jsdom structural)
- [ ] `npm run test:a11y` (axe, 0 crit/serious, all breakpoints + reduced-motion + dark)
- [ ] `npm run test:e2e` (Playwright viewport/overflow)
- [ ] `npm run build` (Vite → `dist/`, zero runtime deps, CSP-safe)
- [ ] Independent QA re-run + manual viewport/keyboard evidence.

---

### Acceptance-criteria → guide coverage

| Spec AC | Guide section |
|---------|---------------|
| AC-RES-1…5 | §11 |
| AC-SEC-1…4, AC-ORG-1/2 | §10, §10.3, §10.6, §10.9 |
| AC-A11Y-1…5 | §12.1–§12.6, §4.3 |
| AC-AUTO-1…4 | §14 |
| AC-SEC-1/2/3 | §9.4, §12.6–§12.7 |

*End of design system guide — Clínica Aurora.*









