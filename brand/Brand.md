# SupportUsButton — Brand & Design Specifications

This document defines the official branding, logo assets, color palette, typography guidelines, and design tokens for the **SupportUsButton** project by **AOSSIE**.

---

## 🎨 Brand Identity Overview

**SupportUsButton** is an open-source, customizable, tier-based React component package designed to display donation and sponsorship options cleanly on web applications while seamlessly adapting to any host site's visual theme.

---

## 🖼️ Logo & Assets

All official brand assets are located inside the [`brand/`](file:///x:/Work/Dev/AOSSIE/SupportUsButton/brand/) directory.

* **Primary Logo (SVG)**: [`brand/logo.svg`](file:///x:/Work/Dev/AOSSIE/SupportUsButton/brand/logo.svg)
* **Favicon / Logomark (SVG)**: [`brand/favicon.svg`](file:///x:/Work/Dev/AOSSIE/SupportUsButton/brand/favicon.svg)

### Usage Rules:
* Always maintain aspect ratios when displaying the SVG logo.
* On dark backgrounds, use the primary logo or inverted contrast version (`brightness-0 invert`).
* On light host backgrounds, use dark contrast text and borders (`brightness-0`).

---

## 🎨 Color Palette

The SupportUsButton brand palette balances modern dark UI elements with high-contrast accent highlights.

| Token | Hex Value | RGB / HSL | Usage |
| :--- | :--- | :--- | :--- |
| **Accent Primary** | `#ffd700` | `rgb(255, 215, 0)` | Hover highlights, primary CTA accents, gold tier badges |
| **Dark Background** | `#191919` | `rgb(25, 25, 25)` | Predefined dark theme container background |
| **Dark Surface** | `#111111` | `rgb(17, 17, 17)` | Surface containers and card backgrounds |
| **Light Background** | `#F4F4F4` | `rgb(244, 244, 244)` | Predefined light theme container background |
| **Text Dark** | `#191919` | `rgb(25, 25, 25)` | Text on light backgrounds |
| **Text Light** | `#F4F4F4` | `rgb(244, 244, 244)` | Text on dark backgrounds |

---

## 🔤 Typography

SupportUsButton is designed with **automatic font-family inheritance** so that it matches the host website typography natively out-of-the-box.

### Font Family Specs:
* **Primary (Inherited)**: `font-family: inherit` (Default for `Theme="auto"`)
* **Fallback Stack**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Heading Sizes**:
  * Hero Title: `text-3xl sm:text-3xl md:text-5xl` (`font-medium`)
  * Section Headers: `text-xl sm:text-2xl lg:text-3xl` (`font-medium`)
  * CTA Button Text: `text-[18px]` (`font-semibold`)

---

## 📦 CSS Custom Variables

Host applications can override custom CSS variables if explicit theme control is needed:

```css
:root {
  --color-primary: #ffd700;
  --color-background-light: #f4f4f4;
  --color-background-dark: #191919;
}
```
