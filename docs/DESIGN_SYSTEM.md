# Design System & Token Architecture
## CINEMA OS — Brand Palette & Typography Specifications

### 1. Brand Color System
Extracted directly from the official brand identity palette and integrated into Tailwind CSS v4 design tokens:

| Token Name | Hex Code | Purpose & Application |
|---|---|---|
| **Deep Navy** | `#071B2B` | Primary brand background, dark-mode root, sidebar dark surface, high-contrast typography, primary dark buttons. |
| **Teal** | `#167D8D` | Primary interactive color, call-to-action buttons, active navigation markers, confirmed badges, links. |
| **Light Cyan** | `#B9E4E8` | Accent highlight, glow effects, secondary badges, timeline markers, call sheet scene highlights. |
| **Soft Grey** | `#EEEEEE` | Light-mode background canvas (`--background`), secondary borders, subtle dividers, neutral chip backgrounds. |
| **White** | `#FFFFFF` | Surface cards (`--card`), dropdown panels, dialog windows, clean elevated surfaces. |

---

### 2. Semantic Token Mapping (Tailwind CSS v4 & CSS Variables)

```css
:root {
  /* Brand Core */
  --brand-navy: #071B2B;
  --brand-teal: #167D8D;
  --brand-cyan: #B9E4E8;
  --brand-grey: #EEEEEE;
  --brand-white: #FFFFFF;

  /* Semantic UI Tokens - Light Mode */
  --background: #F4F6F8;
  --foreground: #071B2B;
  --card: #FFFFFF;
  --card-foreground: #071B2B;
  --muted: #E8ECEF;
  --muted-foreground: #5A6A78;
  --border: #DDE2E6;
  --input: #DDE2E6;
  --ring: #167D8D;
  --primary: #167D8D;
  --primary-foreground: #FFFFFF;
  --accent: #B9E4E8;
  --accent-foreground: #071B2B;

  /* Film Operations Status Colors */
  --call-on-set: #167D8D;      /* Teal */
  --call-makeup: #7C3AED;      /* Purple */
  --call-travel: #0284C7;      /* Sky Blue */
  --call-wrapped: #10B981;     /* Emerald */
  --call-delayed: #F59E0B;     /* Amber */
  --call-cancelled: #EF4444;   /* Rose Red */
}

.dark {
  /* Semantic UI Tokens - Dark Mode */
  --background: #071B2B;       /* Deep Navy */
  --foreground: #F4F6F8;
  --card: #0D263B;             /* Elevated Navy */
  --card-foreground: #F4F6F8;
  --muted: #13334D;
  --muted-foreground: #8DA1B2;
  --border: #1E4464;
  --input: #1E4464;
  --ring: #167D8D;
  --primary: #167D8D;
  --primary-foreground: #FFFFFF;
  --accent: #13334D;
  --accent-foreground: #B9E4E8;
}
```

---

### 3. Typography Architecture
- **Primary Typography:** Montana.
- **Configurable Font Fallback:** `var(--font-montana), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Type Scale Rules:**
  - Micro Badges & Call Times: `11px` (`text-2xs`), uppercase font-bold tracking-wider.
  - Form Labels & Captions: `12px` (`text-xs`), medium font-semibold.
  - Table Cells & Body: `13px` / `14px` (`text-sm`), regular font-normal.
  - Card Headings (h2): `15px` / `16px` (`text-base`), font-semibold.
  - Page Titles (h1): `22px` - `26px` (`text-xl` - `text-2xl`), font-bold tracking-tight.

---

### 4. Mandatory Enterprise Design Standards
1. **Forms:** Standard height `38px` (`h-9.5` / `h-9`), unified border-radius `8px` (`rounded-lg`), aligned labels.
2. **Buttons:** Primary (`bg-primary text-white hover:bg-[#126572]`), Secondary (`border border-border hover:bg-muted`), Danger (`bg-destructive text-white`).
3. **Cards:** `rounded-xl border border-border bg-card shadow-card`.
4. **Attribution Requirement:** As required by the DataDropX license, preserve `BrandCredit` in the footer.

