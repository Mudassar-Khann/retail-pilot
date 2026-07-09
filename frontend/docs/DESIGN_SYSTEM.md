# RetailPilot Design System

> Every future frontend component, page, animation, and interaction must comply with the principles defined in [DESIGN_MANIFESTO.md](file:///d:/retail-pilot/frontend/docs/DESIGN_MANIFESTO.md).

This document is the single source of truth for the RetailPilot frontend implementation. It explains **how** to implement our design choices.

---

## 1. Color Palette

We utilize a restrained monochrome and neutral palette to establish calm and depth:

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `Bg Primary` | `#FFFFFF` | Core background surface |
| `Bg Secondary` | `#FBFBFA` | Subtle alternating section blocks |
| `Bg Muted` | `#F4F4F3` | Quiet borders, selector tabs, and background slots |
| `Text Primary` | `#121212` | Main headings, brand signatures, and active states |
| `Text Secondary`| `#525252` | Body copy and description text |
| `Text Muted` | `#8A8A8A` | Eyebrow labels, metadata details, and disabled controls |
| `Border Soft` | `#EBEBEA` | Fine lines and separator borders |

---

## 2. Typography Scale

Pair **Cormorant Garamond** (serif display) with **Geist Sans** (clean sans-serif) using the following parameters:

| Role | Font Family | Size | Weight | Tracking / Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Signature** | Geist Sans | `text-lg` (18px) | Semi-Bold | `tracking-[0.25em] uppercase` |
| **Section Title** | Cormorant Garamond | `text-3xl` / `text-4xl` | Light | `tracking-wide` |
| **Hero Title** | Cormorant Garamond | `text-5xl` / `text-6xl` | Light | `tracking-tight leading-[1.08]` |
| **Subtitle / Body** | Geist Sans | `text-sm` (14px) | Light / Regular | `leading-relaxed text-neutral-600` |
| **Labels / Eyebrows**| Geist Sans | `text-[10px]` | Semi-Bold | `tracking-[0.18em] uppercase text-neutral-400`|
| **Controls Metadata**| Geist Mono | `text-[9px]` | Regular | `tracking-widest uppercase` |

---

## 3. Corner Radius System

We reject unified zero-radius limits in favor of consistent, soft-geometric hierarchy:
- **Buttons & Badges**: Small radius (`rounded-sm` / 2px) for a structured, tactile appearance.
- **Inputs & Cards**: Medium radius (`rounded-md` / 6px) to match standard premium browser containers.
- **Modals & Dialogs**: Large radius (`rounded-lg` / 8px) to frame overlays cleanly.

---

## 4. Spacing Scale

Always use Tailwind spacing values consistently to establish structural balance:
- **Section Padding**: `py-24` (96px) on mobile, scaling to `py-36` (144px) on desktop.
- **Grid Gaps**: `gap-6` (24px) for small cards, `gap-12` (48px) for major sections/mannequin panels.
- **Component Padding**: `p-6` (24px) for cards, `px-6 py-3` for primary action buttons.

---

## 5. Motion Tokens

All transitions must feel natural and physical:
- **Standard Easing**: Luxury bezier curve:
  ```css
  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
  ```
- **Virtual Model Garment Springs**:
  - `stiffness`: 250
  - `damping`: 24
  - `mass`: 1.0

---

## 6. Copywriting & Lexicon Rules

All interface copy must use **Sentence case** (except for uppercase labels) and follow these vocabulary maps:

- **Avoid**: "Buy Now", "Featured Products", "AI Assistant", "Search", "Shopping Cart", "Checkout".
- **Prefer**: "Discover", "Curated Selection", "Personal Stylist", "Search Style Catalog", "Wardrobe Bag", "Secure Bag Order".

---

## 7. Component Rules

### Button
- Uses `rounded-sm` (2px radius).
- Default: Solid `#121212` background, white text. Soft scale effect (`active:scale-[0.98]`).
- Outline: Thin border, transparent, dark text.

### Card
- White solid surface, `rounded-md` (6px radius).
- Thin border (`border-neutral-100`), very soft grayscale drop shadow on hover.

### Input
- Thin bottom border (`border-b border-neutral-200 focus:border-neutral-900`) rather than enclosed boxes to match luxury aesthetics.
