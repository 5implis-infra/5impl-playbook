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
  purple-signal: "#7B3FE4"
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
    backgroundColor: "{colors.purple-signal}"
    textColor: "#FFFFFF"
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
    textColor: "{colors.teal-active}"
  badge:
    backgroundColor: "{colors.teal-deep}"
    textColor: "{colors.teal-high}"
    rounded: "{rounded.pill}"
    padding: "0.2em 0.6em"
---

# Design System: 5impl.is Playbook

## 1. Overview

**Creative North Star: "The Precision Engine"**

The 5impl.is Playbook is a technical artifact first. It documents 41 orchestrated agents, multi-tenant architecture, and operational flows for a Brazilian AI automation platform. The visual system exists to reduce cognitive load on complex content, not to add aesthetic drama on top of it. Every surface decision should answer one question: does this help an operator or B2B client navigate dense specification material with greater speed and confidence?

The palette is dark-first by necessity, not fashion. Engineers and technical stakeholders reading architecture diagrams and schema tables under varied lighting need a surface that holds over extended sessions. Midnight Navy (#0D0D14) is not chosen for drama; it's the baseline that makes Active Teal (#00C9A7) readable at low luminance and lets code syntax pop without competition. The typography pairing — Syne for hierarchy, Inter for body — carries the "modern, technical, ambitious" personality without requiring color to do that work.

This system explicitly rejects three aesthetics: the flat templatey output of generic dev-docs platforms (ReadTheDocs, GitBook default skins), the retro hacker/terminal look (green-on-black, ASCII-heavy), and the gray sterility of corporate enterprise documentation. The alternative is not to swing in the other direction with gradients and glow effects. The answer is deliberate restraint: a tight tonal scale, one accent color with a specific job, and typography that earns its hierarchy through weight and size, not decoration.

**Key Characteristics:**
- Dark-first (Midnight Navy baseline) with tonal layering, no shadows
- Single accent (Active Teal), used for active states, links, and focus only
- Syne display + Inter body: weight-driven hierarchy, not size-driven
- Functional and direct components: no gratuitous hover effects
- Bilingual (pt-BR default, English mirror) with consistent density in both

## 2. Colors: The Midnight Precision Palette

A near-monochromatic dark navy scale anchored by one teal accent. Every other color is a shift in lightness along the same navy hue. The accent exists to signal state, not to decorate.

### Primary
- **Active Teal** (`#00C9A7`): The sole saturated accent in the system. Used exclusively for active sidebar items, text links, focus indicators, inline code text, TOC active items, and badge text. Not used decoratively. Its rarity is the point — when teal appears, it always means something.
- **Teal High** (`#5EECD4`): Teal hover and emphasis state. Used for link hover and teal text on dark teal backgrounds. Lighter, higher contrast variant of Active Teal.
- **Teal Deep** (`#00291F`): Teal at near-zero lightness. Background for teal-tinted surfaces: badges, blockquotes, active sidebar links. Keeps teal-on-teal legible.

### Secondary
- **Purple Signal** (`#7B3FE4`): Currently used in the hero gradient. **Flagged for replacement** per the "Calmer Palette Rule" below. Document-only; do not extend to new surfaces.

### Neutral
- **Midnight Navy** (`#0D0D14`): The base surface. Every page, sidebar, and nav background. Near-black with a faint blue-violet cast toward the navy hue family.
- **Surface Elevated** (`#16162A`): One step above the base. Used for inline code backgrounds, card surfaces, and code block wrappers. The tonal layering equivalent of a z=1 elevation.
- **Surface Overlay** (`#2A2A45`): Borders, dividers, and active sidebar backgrounds. The hairline layer that separates surfaces without needing shadows.
- **Border Subtle** (`#3A3A60`): Table borders, breadcrumb separators. Slightly lighter than Surface Overlay for low-contrast structural lines.
- **Ink Primary** (`#D8D8F0`): Primary reading text. Off-white with a cold-violet tint toward the navy hue. Not pure white — pure white reads as harsh against Midnight Navy.
- **Ink Secondary** (`#9999BB`): Secondary text, sidebar links at rest, captions, table cell content. Check contrast against Surface Elevated before using in that context.
- **Ink Muted** (`#6666AA`): Muted labels, group headers, breadcrumb items. Not for body copy.

### Light Theme
- **Light Accent** (`#00956A`): Active Teal adapted for light mode. Darker value, same teal hue family, adjusted for ≥4.5:1 against `#F8F8FC`.
- **Light Background** (`#F8F8FC`): Light mode base. Near-white with a faint cool cast, not warm or sandy.

### Named Rules
**The One Accent Rule.** Active Teal (#00C9A7) is the only saturated color used in the dark theme surface at normal reading scale. No purple, no additional accent families. The hero gradient (purple-signal → teal) is a bounded exception; it must not escape to other surfaces.

**The Calmer Palette Rule.** Purple-signal (#7B3FE4) and its magenta sibling (#C84BE8) are flagged for removal from the hero. Replace with a solid or very low-contrast teal variant. The gradient text on the hero h1 is a banned pattern (background-clip: text); replace with a single high-contrast solid color.

## 3. Typography

**Display Font:** Syne (700–800 weight), loaded from Google Fonts
**Body Font:** Inter (400–600 weight), loaded from Google Fonts
**Mono Font:** JetBrains Mono (400–500 weight), loaded from Google Fonts

**Character:** Syne is a geometric display sans with high weight contrast — at 800, it reads as architectural. Inter is neutral and highly legible at body sizes. The pairing is contrast-axis: Syne carries personality in headings; Inter disappears into the content below it. JetBrains Mono is purpose-built for code; its ligatures and weight hold well at 0.82em.

### Hierarchy
- **Display** (Syne 800, 2.25rem, line-height 1.2): Page title (h1). One per page. On the index hero, optionally 3rem — do not exceed 3rem without text-wrap: balance applied.
- **Headline** (Syne 700, 1.5rem, line-height 1.3): Major section breaks (h2). Separated from the section above by a 1px border-top and 2.5rem margin.
- **Title** (Syne 600, 1.15rem, line-height 1.4): Subsection heading (h3). Lower contrast than Headline — uses Ink Primary but one weight lighter.
- **Label** (Inter 700, 0.8rem, 0.06em tracking, uppercase): h4 and sidebar section group headers only. Not for body copy. Maximum 4 words.
- **Body** (Inter 400, 1rem, line-height 1.75): All running text. Content width capped at 50rem (--sl-content-width). Use `text-wrap: pretty` for long prose blocks.
- **Mono** (JetBrains Mono 400–500, 0.85rem): Code blocks and inline code. Inline code rendered at 0.82em relative to surrounding text; use teal-high (#5EECD4) color on surface-elevated bg.

### Named Rules
**The Weight-First Rule.** Hierarchy is expressed through Syne weight contrast (800 → 700 → 600 → Inter 700 label), not through size steps alone. Do not introduce additional font families; the pairing is complete at 3 families (display + body + mono).

**The Uppercase Ceiling Rule.** All-caps is reserved for Label (h4, sidebar group headers) and badges only — maximum 4 words. Never apply text-transform: uppercase to h1–h3 or body copy.

## 4. Elevation

This system uses **tonal layering**, not shadows. Depth is conveyed by lightness steps within the navy hue family — darker means further back, lighter means raised. No box-shadow is applied to resting surfaces. The hierarchy:

1. **Midnight Navy** (`#0D0D14`) — base: page body, sidebar, nav
2. **Surface Elevated** (`#16162A`) — z=1: cards, code blocks, inline code backgrounds
3. **Surface Overlay** (`#2A2A45`) — z=2: active sidebar states, borders, table headers

The single exception is the hero button hover state, which uses `box-shadow: 0 8px 24px rgba(123, 63, 228, 0.35)`. This shadow is coupled to the purple gradient and should be removed when the gradient is removed.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. No card has a resting shadow. Hover state on cards is expressed by border-color shift to Active Teal, not by elevation. If an element needs to feel lifted, use Surface Elevated background, not a shadow.

## 5. Components

### Sidebar Navigation
The sidebar is the primary navigation surface for a multi-section technical spec. It must be legible at a glance, not decorative.

- **Background:** Midnight Navy (#0D0D14), matching the page body (no tonal separation)
- **Border:** 1px Surface Overlay (#2A2A45) on the right edge only
- **Links at rest:** Inter 400, 0.875rem, Ink Secondary (#9999BB), no underline, border-radius xl (0.75rem), padding xs/sm (0.3rem/0.75rem)
- **Links hover:** Ink Primary (#D8D8F0), background Surface Elevated (#16162A)
- **Active link:** Active Teal (#00C9A7), background Teal Deep (#00291F), Inter 500
- **Group headers:** Label style (Inter 700, 0.7rem, 0.08em tracking, uppercase, Ink Muted)
- **State:** No transitions longer than 150ms (ease); no translate or scale on links

### Buttons
Functional and direct. No lift on hover, no scale. State changes are color-only.

- **Primary (hero CTA):** Currently purple gradient — flagged for replacement with solid Active Teal (#00C9A7), text Midnight Navy (#0D0D14), border-radius lg (0.5rem), padding 0.6rem 1.5rem, Inter 600
- **Secondary (ghost):** Transparent bg, 1px border Surface Overlay, Ink Primary text. Hover: border shifts to Active Teal, text shifts to Active Teal. No background fill on hover.
- **No icons inside buttons** unless the icon has a semantic role (external link indicator)

### Cards (Index page)
- **Background:** Surface Elevated (#16162A)
- **Border:** 1px Surface Overlay at rest; shifts to Active Teal on hover
- **Radius:** xl (0.75rem)
- **Hover:** border-color transition 200ms ease, translateY(-2px) — this is the one permitted transform; it is bounded to the index page card grid
- **Heading:** Syne 600, 1rem, Ink Primary — overrides the normal h2 border-top treatment (do not apply border-top inside cards)
- **Icon:** Active Teal only

### Code Blocks
- **Border:** 1px Surface Overlay
- **Radius:** xl (0.75rem)
- **Font:** JetBrains Mono 400, 0.85rem
- **Themes:** dark-plus (dark mode) / github-light (light mode)
- **No side-stripe borders.** The expressive-code wrapper has no left-border accent.

### Inline Code
- **Background:** Surface Elevated (#16162A)
- **Text:** Teal High (#5EECD4)
- **Border:** 1px Surface Overlay
- **Radius:** sm (0.3rem)
- **Size:** 0.82em relative (shrinks proportionally to surrounding text)

### Blockquotes
Blockquotes currently use a 3px left border stripe (teal) — this is a banned pattern. The correct treatment is a teal-tinted background with a full border:

- **Background:** Teal Deep (#00291F)
- **Border:** 1px solid Surface Overlay (#2A2A45) — all four sides, no side-stripe
- **Radius:** 0.5rem
- **Text:** Ink Primary
- **Padding:** sm/md (0.875rem/1.25rem)

### Badges / Tags
- **Background:** Teal Deep (#00291F)
- **Text:** Teal High (#5EECD4) — ensures ≥4.5:1 on Teal Deep
- **Border:** 1px `color-mix(in srgb, #00C9A7 30%, transparent)`
- **Radius:** pill (9999px)
- **Font:** JetBrains Mono 500, 0.7rem

### Tables
- **Header bg:** Surface Elevated (#16162A), Label style text (uppercase, 0.04em tracking, Ink Secondary)
- **Header border-bottom:** 1px Surface Overlay
- **Row hover:** Surface Elevated background shift (0.1s transition)
- **Cell text:** Ink Primary, 0.875rem
- **No zebra striping** — hover state is sufficient

## 6. Do's and Don'ts

### Do:
- **Do** use Active Teal (#00C9A7) exclusively for active/interactive state signals: active nav, text links, focus rings, inline code color. Its function is state; its scarcity is the signal.
- **Do** use tonal layering for depth: Midnight Navy base → Surface Elevated (+1) → Surface Overlay (borders). Never introduce a shadow to fill this role.
- **Do** use Syne weight contrast (800/700/600) as the primary hierarchy tool. Each heading level should be clearly distinguishable by weight before size.
- **Do** use Inter 400 at 1.75 line-height for body text. Do not tighten the line-height for "denser" docs pages; legibility over density.
- **Do** cap content width at 50rem (--sl-content-width) for reading comfort. The spec content is dense; the line length ceiling is load-bearing.
- **Do** provide `text-wrap: balance` on h1–h3 and `text-wrap: pretty` on prose paragraphs (Portuguese long compounds especially need this).
- **Do** test every new surface in both pt-BR and English. Word length and compound nouns differ significantly; heading overflow is a real risk at 2.25rem and above.
- **Do** verify all text passes WCAG 2.1 AA: ≥4.5:1 for body text, ≥3:1 for large text (≥18px or bold ≥14px). Pay special attention to Ink Secondary (#9999BB) on Surface Elevated (#16162A).

### Don't:
- **Don't** use gradient text (`background-clip: text` with a gradient background). This is active on the hero h1 and must be removed. Replace with a single solid color.
- **Don't** use side-stripe borders (`border-left` or `border-right` greater than 1px as a colored accent). The blockquote currently violates this; fix by replacing with a full 4-side border on a tinted background.
- **Don't** use purple or magenta on any surface outside the hero CTA (and phase that out too). Purple-signal (#7B3FE4) and its magenta sibling (#C84BE8) are legacy; don't extend them.
- **Don't** make this look like a generic dev-docs template (ReadTheDocs, GitBook default). Flat typography, no accent, system-font body — these are the signals of a documentation site that nobody designed.
- **Don't** use a hacker/terminal aesthetic (green-on-black, ASCII decorations, retro monospace headers). This is a B2B client-facing document; the retro affectation undercuts technical credibility.
- **Don't** make this look like corporate enterprise docs (Confluence, SharePoint gray). Sterility is not restraint.
- **Don't** add glassmorphism effects (frosted blur cards, backdrop-filter as decoration). The header's `backdrop-filter: blur(12px)` is a bounded exception for the sticky nav; do not extend it.
- **Don't** add shadow to resting card or surface states. Hover translate (-2px) on index cards is the one permitted motion; it does not belong on doc page content cards.
- **Don't** use uppercase on more than 4 consecutive words. Label and sidebar headers only.
- **Don't** apply accent colors (teal) to structural elements (borders, dividers, backgrounds) at resting state. Teal means active or interactive; applying it structurally depletes its signal value.
