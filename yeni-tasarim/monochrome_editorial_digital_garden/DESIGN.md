---
name: Monochrome Editorial & Digital Garden
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-canvas: '#000000'
  surface-card: '#0A0A0A'
  surface-subtle: '#141414'
  border-subtle: '#1F1F1F'
  border-hover: '#333333'
  text-primary: '#FFFFFF'
  text-muted: '#A1A1AA'
  text-faint: '#71717A'
  accent-warm: '#FAFAFA'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 30.6px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 27px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes an intimate, quiet, and hyper-focused personal digital garden and portfolio. Rooted in the visual precision of modern engineering tools (Linear) and the considered cadence of literary publishing platforms (Substack, Read.cv), the aesthetic strips away extraneous visual noise to celebrate long-form thought, craftsmanship, and curated artifacts.

### Aesthetic Persona & Tone
- **Monochrome & Text-First:** Color is treated strictly as an informative state or excluded entirely in favor of values between pitch black and crisp optical white.
- **Craft & Tactility:** Surface depth relies on hairline borders, tonal gradation, and crisp typography rather than simulated skeuomorphism or loud gradients.
- **IndieWeb Integrity:** Embraces quiet timeline nodes, read-time markers, letterboxd-styled catalog chips, and audio/visual artifact frames that feel permanent, archival, and deeply personal.
- **Language Alignment:** Optimized for Turkish editorial text, accounting for accented characters and dotless/dotted 'i' glyphs through well-crafted geometric proportions.

## Colors

The palette embraces a pure dark-mode architecture built on stark contrast, deliberate dark greys, and zero neon hues.

- **Canvas & Backdrops:** `#000000` forms the foundational depth. Everything emerges from black.
- **Elevated Surfaces:** `#0A0A0A` defines cards, timeline containers, and media modules, softly delineated by 1px borders of `#1F1F1F`.
- **Text & Visual Weight:** Primary statements and headers command attention in `#FFFFFF`. Extended prose shifts to `#A1A1AA` to eliminate eye fatigue and deliver an unhurried, editorial reading cadence. Auxiliary metadata, dates, and garden timestamps sit in `#71717A`.
- **Accents:** `#FAFAFA` acts as the active white state for high-intent triggers (such as focused toggles, active filter pills, or timeline pips).

## Typography

The typographic hierarchy creates a crisp, academic, yet contemporary posture.

- **Headers:** Rendered in `Geist` with negative tracking (`-0.01em` to `-0.03em`) to mimic the precision of Swiss typefounding and developer consoles.
- **Editorial Long-form Prose:** `Inter` handles body reading with a dedicated `1.8` line-height ratio (`body-lg` at 17px with 30.6px line height). This provides breathing room, ensuring Turkish long-form essays, reflections, and garden entries remain effortless to consume.
- **Labels, Badges, and Metrics:** Monospaced or tightly tracked `Geist` at small scale (11px–12px) anchors metadata, dates, Letterboxd-style rating tags, and audio playhead values.

## Layout & Spacing

The layout is structured around an editorial column with generous lateral space, shifting away from dense dashboard layouts toward considered reading columns.

- **Grid Architecture:** Single-column centered reading frame maxed out at `680px` for pure editorial essays, expanding to a maximum grid of `1024px` for digital garden lists, project matrices, and media shelves.
- **Vertical Cadence:** Generous section spacing (`space-xl` and higher) creates natural resting stops between years, project categories, and thought logs.
- **Mobile Adaptations:** Outer margins collapse from `2rem` to `1rem` seamlessly. Content stretches edge-to-edge with 1px border dividers sustaining structural continuity.

## Elevation & Depth

This design system deliberately rejects heavy diffuse drop shadows in favor of low-contrast hairline boundaries and tonal containment.

- **Hairline Framing:** Surface distinction relies on crisp `1px solid #1F1F1F`. On interactive hover states, this outline transitions instantly or via an ultra-fast cubic bezier (`120ms`) to `#333333`.
- **Tonal Layering:** The foundational background is `#000000`. Cards, interactive rows, and embedded artifacts step forward via `#0A0A0A`. Popovers and floating command bars sit at `#141414`.
- **Zero Blurs / Shadows:** No synthetic ambient glow or blurred colored shadows are permitted. Depth is architectural, flat, and razor-sharp.

## Shapes

The design system maintains a structured, semi-compact curvature language (`roundedness: 1`).

- **Base Elements & Cards:** Built with subtle `0.25rem` (4px) to `0.5rem` (8px) corners, delivering an intentional, physical print or digital index card feeling.
- **Pills & Status Indicators:** Status tags, letterboxd ratings, and timeline dots leverage fully rounded pill geometry (`9999px`) to create clear semantic differentiation against rectangular content blocks.
- **Media Insets:** Video cards and audio players preserve strict `0.5rem` boundary corners with overflow clipping.

## Components

### Buttons & Interactive Controls
- **Primary Action:** Solid `#FFFFFF` fill with `#000000` text, `4px` border radius, font `label-md`. Clean, instant contrast. Hover drops opacity to `0.9`.
- **Ghost / Neutral Action:** Background transparent, 1px border `#1F1F1F`, text `#A1A1AA`. On hover, border turns `#333333` and text illuminates to `#FFFFFF`.

### Chips & Letterboxd-Style Badges
- **Format:** Height `22px`, horizontal padding `8px`, font `label-sm`.
- **Visuals:** `#0A0A0A` background, `1px solid #1F1F1F`, text `#A1A1AA`. For ratings or special taxonomy tags, the border remains subtle while text sits at `#FAFAFA` accompanied by small scalar numerals (e.g. `★ 4.5` or `LOGGED`).

### Digital Garden Timeline & Lists
- **Timeline Rail:** 1px vertical stroke in `#1F1F1F`.
- **Timeline Dot:** 6px circle. Dormant entries use `#333333`; current or highlighted garden nodes use `#FAFAFA` with no blur or glow.
- **Row Items:** Display year or date in `Geist Mono/Label` in `#71717A`, entry title in `#FFFFFF` on hover, and an external indicator or read time pinned to the far right.

### Input Fields & Search / Command
- **Styling:** Monochromatic baseline, `#0A0A0A` background, 1px border `#1F1F1F`, placeholder text in `#71717A`.
- **Focus State:** Border shifts sharply to `#FAFAFA` without outline rings.

### Audio Player & Media Artifacts
- **Audio Control Bar:** Minimalist horizontal pill or thin rectangular container (`#0A0A0A` with `#1F1F1F` stroke). Features a single monochrome play/pause glyph, micro scrub track (1px `#1F1F1F` background with `#FAFAFA` fill), and monospaced timestamp markers.
- **Video Cards:** Edge-to-edge media framed by `#1F1F1F`. Video captions rest beneath in `body-sm` using `#71717A` with inline tag metadata.