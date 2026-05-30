---
name: 5impl.is Playbook
description: Technical specification and operational reference for the 5impl.is automation platform.
colors:
  teal-active: "#00C9A7"
  teal-high: "#5EECD4"
  teal-deep: "#00291F"
  midnight-navy: "#0D0D14"
  surface-elevated: "#16162A"
  surface-overlay: "#2A2A45"
  border-subtle: "#3A3A60"
  ink-primary: "#D8D8F0"
  ink-secondary: "#9999BB"
  ink-muted: "#6666AA"
  light-accent: "#00956A"
  light-bg: "#F8F8FC"
typography:
  display:
    fontFamily: "Syne, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.2
  headline:
    fontFamily: "Syne, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "Syne, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
rounded:
  sm: "0.3rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  pill: "9999px"
spacing:
  xs: "0.3rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.teal-active}"
    textColor: "{colors.midnight-navy}"
    rounded: "{rounded.lg}"
    padding: "0.6rem 1.5rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "0.6rem 1.5rem"
  button-secondary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.teal-active}"
  card:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  card-hover:
    backgroundColor: "{colors.surface-elevated}"
    borderColor: "{colors.teal-active}"
  badge:
    backgroundColor: "{colors.teal-deep}"
    textColor: "{colors.teal-high}"
    rounded: "{rounded.pill}"
    padding: "0.2em 0.6em"
---

# Design System: 5impl.is Playbook

## 1. Overview

**Creative North Star: "The Precision Engine"**

The 5impl.is Playbook is a technical artifact first. It documents 41 orchestrated agents, multi-tenant architecture, and operational flows for a Brazilian AI automation platform. The visual system exists to reduce cognitive load on complex content, not to add aesthetic drama on top of it. Every surface decision must answer one question: does this help an operator navigate dense specification material with greater speed and confidence?

**Every visual element that doesn't serve navigation or comprehension is removed, not styled. The attention cost of any non-content element must be justified.**

### Three Navigation Contexts

Users arrive in one of three modes at any given moment. Every design decision must serve all three without sacrificing any:

1. **Quick lookup** — the user knows what they're looking for and needs to find it in seconds
2. **Deep learning** — linear reading of a full section from start to finish
3. **Recurring reference** — verifying a known detail (field name, trigger, endpoint)

The palette is dark-first by necessity, not fashion. Engineers and technical stakeholders reading architecture diagrams and schema tables under varied lighting need a surface that holds over extended sessions. Midnight Navy (#0D0D14) is the baseline that makes Active Teal (#00C9A7) readable at low luminance and lets code syntax pop without competition. The typography pairing — Syne for hierarchy, Inter for body — carries the "modern, technical, ambitious" personality without requiring color to do that work.

This system explicitly rejects three aesthetics: the flat templatey output of generic dev-docs platforms (ReadTheDocs, GitBook default skins), the retro hacker/terminal look (green-on-black, ASCII-heavy), and the gray sterility of corporate enterprise documentation. The answer is deliberate restraint: a tight tonal scale, one accent color with a specific job, and typography that earns its hierarchy through weight and size, not decoration.

**Key Characteristics:**
- Dark-first (Midnight Navy baseline) with tonal layering, no shadows
- Single accent (Active Teal), used for active states and links only — scarcity is the signal
- Syne display + Inter body: weight-driven hierarchy, not size-driven
- Functional and direct components: no decorative hover effects
- Bilingual (pt-BR default, English mirror) with consistent density in both

---

## 2. Colors: The Midnight Precision Palette

A near-monochromatic dark navy scale anchored by one teal accent. Every other color is a shift in lightness along the same navy hue. The accent exists to signal state, not to decorate.

### Primary
- **Active Teal** (`#00C9A7`): The sole saturated accent in the system. Used exclusively for: active sidebar items, text links, focus indicators, inline code text, TOC active items, and badge text. Not used decoratively. Its rarity is the point — when teal appears, it always means something.
- **Teal High** (`#5EECD4`): Teal hover and emphasis state. Used for link hover, teal text on dark teal backgrounds, and badge text. Lighter, higher-contrast variant of Active Teal. **Not used for inline code** — Active Teal already marks presence; Teal High is reserved for state transitions on top of Active Teal elements.
- **Teal Deep** (`#00291F`): Teal at near-zero lightness. Background for teal-tinted surfaces: badges, blockquotes, active sidebar links. Keeps teal-on-teal legible.

### Neutral
- **Midnight Navy** (`#0D0D14`): The base surface. Every page, sidebar, and nav background.
- **Surface Elevated** (`#16162A`): One step above the base. Used for inline code backgrounds, card surfaces, code block wrappers, and table row hover. The tonal equivalent of z=1 elevation.
- **Surface Overlay** (`#2A2A45`): Borders, dividers, and active sidebar backgrounds.
- **Border Subtle** (`#3A3A60`): Table borders, breadcrumb separators.
- **Ink Primary** (`#D8D8F0`): Primary reading text. Off-white with a cold-violet tint.
- **Ink Secondary** (`#9999BB`): Secondary text, sidebar links at rest, captions, table cell content.
- **Ink Muted** (`#6666AA`): Muted labels, sidebar group headers, h4. Not for body copy.

### Light Theme
- **Light Accent** (`#00956A`): Active Teal adapted for light mode. Adjusted for ≥4.5:1 against `#F8F8FC`.
- **Light Background** (`#F8F8FC`): Light mode base. Near-white with a faint cool cast.

### Named Rules

**The One Accent Rule.** Active Teal (#00C9A7) is the only saturated color in the dark theme at normal reading scale. No additional accent families. Breadcrumbs use Active Teal because they are links — but they do not receive Label treatment (no uppercase, no font-weight 600). Teal in breadcrumbs signals "clickable", not "active". The hero gradient is gone; do not reintroduce it.

**The Density Rule.** In pages with high code density (schemas, agents, flows), teal exposure is naturally high due to inline code. This is the correct behavior — it marks code tokens distinctly from prose. Do not compensate by reducing teal on interactive elements; instead, ensure inline code uses Active Teal (not Teal High) to stay one step below hover states.

**Logo Exception.** Purple Signal (`#7B3FE4`) exists only in the logo SVG as a brand asset. Do not use it on any UI surface.

---

## 3. Typography

**Display Font:** Syne (700–800 weight), loaded from Google Fonts  
**Body Font:** Inter (400–600 weight), loaded from Google Fonts  
**Mono Font:** JetBrains Mono (400–500 weight), loaded from Google Fonts

**Character:** Syne is a geometric display sans with high weight contrast — at 800, it reads as architectural. Inter is neutral and highly legible at body sizes. JetBrains Mono is purpose-built for code.

### Hierarchy
- **Display** (Syne 800, 2.25rem, line-height 1.2): Page title (h1). One per page.
- **Headline** (Syne 700, 1.5rem, line-height 1.3): Major section breaks (h2). Separated from the section above by a 1px border-top and 2.5rem margin.
- **Title** (Syne 600, 1.15rem, line-height 1.4): Subsection heading (h3).
- **Label** (Inter 700, 0.8rem, 0.06em tracking, uppercase, Ink Muted): h4 and sidebar section group headers only. Maximum 4 words. Not for breadcrumbs, captions, or body copy.
- **Body** (Inter 400, 1rem, line-height 1.75): All running text. Content width capped at 50rem.
- **Mono** (JetBrains Mono 400–500, 0.85rem): Code blocks and inline code. Inline code at 0.82em relative to surrounding text; color Active Teal (#00C9A7) on Surface Elevated background.

### Named Rules

**The Weight-First Rule.** Hierarchy is expressed through Syne weight contrast (800 → 700 → 600 → Inter 700 label), not through size steps alone. Do not introduce additional font families.

**The Uppercase Ceiling Rule.** All-caps is reserved for Label (h4, sidebar group headers, table thead) and badges only — maximum 4 words. Never apply `text-transform: uppercase` to h1–h3, body copy, or breadcrumbs.

**The text-wrap Rule (mandatory).** Apply `text-wrap: balance` to all h1–h3 in content and hero. Apply `text-wrap: pretty` to all prose paragraphs. This is not optional — Portuguese compound nouns and long technical terms (e.g., "Arquitetura Multi-tenant", "Fluxo de Contrato a Entrega") break asymmetrically without these properties, adding scan friction on narrow viewports.

---

## 4. Elevation

This system uses **tonal layering**, not shadows. Depth is conveyed by lightness steps within the navy hue family — darker means further back, lighter means raised. No box-shadow is applied to resting surfaces.

1. **Midnight Navy** (`#0D0D14`) — base: page body, sidebar, nav
2. **Surface Elevated** (`#16162A`) — z=1: cards, code blocks, inline code backgrounds, table row hover
3. **Surface Overlay** (`#2A2A45`) — z=2: active sidebar states, borders, table headers

**Table Row Hover Rule.** Row hover uses Surface Elevated (`#16162A`). Hover always moves up the tonal scale (lighter = closer). Never use a color darker than the base surface for row hover.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. No card has a resting shadow. Hover state on cards is expressed by border-color shift to Active Teal, not by elevation or transform.

---

## 5. Motion Policy

Animation is permitted only when it communicates a state change. Decorative motion — pulse, shimmer, bounce, loop, or any transform applied for visual interest — is banned.

**Permitted transitions:**
- Color and border-color changes: 150ms ease
- Background-color changes (hover states): 150ms ease
- Layout shifts: 200ms ease maximum

**Banned patterns:**
- `transition: all` — always specify explicit properties
- `translateY`, `scale`, `rotate` on content or card elements
- Any animation without a state-change rationale

**`prefers-reduced-motion: reduce`:**
- All transforms: effectively instant (transition-duration: 0.01ms)
- Color and border transitions: ≤80ms — kept short but non-zero, because instant color changes are more disorienting than brief ones for users who activate this preference

---

## 6. Components

### Sidebar Navigation
- **Background:** Midnight Navy (#0D0D14)
- **Border:** 1px Surface Overlay (#2A2A45) on the right edge only
- **Links at rest:** Inter 400, 0.875rem, Ink Secondary (#9999BB), no underline, border-radius xl, padding xs/sm
- **Links hover:** Ink Primary (#D8D8F0), background Surface Elevated (#16162A)
- **Active link:** Active Teal (#00C9A7), background Teal Deep (#00291F), Inter 500
- **Group headers:** Label style — Inter 700, 0.7rem, 0.08em tracking, uppercase, Ink Muted (#6666AA)
- **Transitions:** color and background only, 150ms ease; no translate or scale

### Buttons
- **Primary (hero CTA):** Active Teal (#00C9A7) background, Midnight Navy (#0D0D14) text, border-radius lg, Inter 600. No gradient.
- **Secondary (ghost):** Transparent background, 1px border Surface Overlay, Ink Primary text. Hover: border and text shift to Active Teal. No background fill on hover.
- **No icons inside buttons** unless the icon has a semantic role

### Cards (Index page)
- **Background:** Surface Elevated (#16162A)
- **Border:** 1px Surface Overlay at rest; shifts to Active Teal on hover (transition 150ms ease)
- **Radius:** xl (0.75rem)
- **Hover:** border-color transition only — no translateY, no scale, no shadow. Border shift is sufficient interactive feedback.
- **Heading:** Syne 600, 1rem, Ink Primary — no border-top inside cards
- **Icon:** Active Teal only

### Code Blocks
- **Border:** 1px Surface Overlay
- **Radius:** xl (0.75rem)
- **Font:** JetBrains Mono 400, 0.85rem
- **No side-stripe borders**

### Inline Code
- **Background:** Surface Elevated (#16162A)
- **Text:** Active Teal (#00C9A7) — not Teal High; high code density in schema and agent pages makes Teal High create continuous visual noise
- **Border:** 1px Surface Overlay
- **Radius:** sm (0.3rem)
- **Size:** 0.82em relative

### Blockquotes
- **Background:** Teal Deep (#00291F)
- **Border:** 1px solid Surface Overlay (#2A2A45) — all four sides, no side-stripe
- **Radius:** 0.5rem
- **Text:** Ink Primary
- **Padding:** sm/md (0.875rem/1.25rem)

### Breadcrumbs
- **Color:** Active Teal — breadcrumbs are links, links are teal
- **Style:** Inter 400, 0.8rem — no uppercase, no font-weight 600, no Label treatment
- **Separator:** Ink Muted (#6666AA)
- **Hover:** Teal High (#5EECD4)

### Badges / Tags
- **Background:** Teal Deep (#00291F)
- **Text:** Teal High (#5EECD4)
- **Border:** 1px `color-mix(in srgb, #00C9A7 30%, transparent)`
- **Radius:** pill (9999px)
- **Font:** JetBrains Mono 500, 0.7rem

### Tables
- **Header bg:** Surface Elevated (#16162A), Label style text (uppercase, 0.04em tracking, Ink Secondary)
- **Header border-bottom:** 1px Surface Overlay
- **Row hover:** Surface Elevated (#16162A) — hover moves up the tonal scale, never down
- **Cell text:** Ink Primary, 0.875rem
- **No zebra striping**

---

## 7. Do's and Don'ts

### Do:
- **Do** use Active Teal (#00C9A7) exclusively for active/interactive state signals: active nav, text links, focus rings, inline code. Its function is state; its scarcity is the signal.
- **Do** use tonal layering for depth: Midnight Navy base → Surface Elevated (+1) → Surface Overlay (borders). Never introduce a shadow to fill this role.
- **Do** use Syne weight contrast (800/700/600) as the primary hierarchy tool.
- **Do** use Inter 400 at 1.75 line-height for body text.
- **Do** cap content width at 50rem (--sl-content-width) for reading comfort.
- **Do** apply `text-wrap: balance` to all h1–h3 and `text-wrap: pretty` to all prose paragraphs — this is mandatory, not optional.
- **Do** test every new surface in both pt-BR and English. Heading overflow is a real risk at 2.25rem and above.
- **Do** verify all text passes WCAG 2.1 AA: ≥4.5:1 for body text, ≥3:1 for large text.
- **Do** specify explicit transition properties — never `transition: all`.
- **Do** add `prefers-reduced-motion` overrides whenever adding transitions or transforms.

### Don't:
- **Don't** apply uppercase or font-weight 600 to breadcrumbs. Breadcrumbs are links, not labels.
- **Don't** use Teal High (#5EECD4) for inline code. Active Teal is sufficient; Teal High in high-density code pages creates visual noise.
- **Don't** apply `translateY` or any transform to cards or content elements on hover. The border-color shift to Active Teal is sufficient interactive feedback.
- **Don't** use gradient text (`background-clip: text` with a gradient background).
- **Don't** use side-stripe borders (`border-left` or `border-right` greater than 1px as a colored accent).
- **Don't** make this look like a generic dev-docs template (ReadTheDocs, GitBook default).
- **Don't** use a hacker/terminal aesthetic (green-on-black, ASCII decorations, retro monospace headers).
- **Don't** make this look like corporate enterprise docs (Confluence, SharePoint gray).
- **Don't** add glassmorphism effects (frosted blur cards). The header's `backdrop-filter: blur(12px)` is a bounded exception for the sticky nav only.
- **Don't** add shadow to resting card or surface states.
- **Don't** use uppercase on more than 4 consecutive words. Label and sidebar headers only.
- **Don't** use `transition: all` — ever.
- **Don't** add decorative motion (pulse, shimmer, bounce, loop). Motion communicates state change only.
