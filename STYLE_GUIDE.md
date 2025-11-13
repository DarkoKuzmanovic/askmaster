# NeoBrutalism Style Guide

This document outlines the NeoBrutalism design principles for our application. It builds upon the `neobrutalismcss` library to ensure a consistent and raw user interface.

## 1. Color Palette

All palette tokens live in [`palette.scss`](palette.scss) as both CSS custom properties and SCSS variables so the UI and documentation never drift apart. Favor the CSS variables (`var(--color-...)`) when styling components in Svelte.

| Token                                  | Hex       | Primary Usage                                               |
| -------------------------------------- | --------- | ----------------------------------------------------------- |
| `--color-dark-purple` / `$dark-purple` | `#210124` | Headings, outlines, progress bars, and high-contrast text.  |
| `--color-claret` / `$claret`           | `#750d37` | Primary actions, warning banners, and data visual emphasis. |
| `--color-celadon` / `$celadon`         | `#B3DEC1` | Answer selections, hover states, and subtle highlights.     |
| `--color-mint-green` / `$mint-green`   | `#DBF9F0` | Panels, form shells, and neutral surfaces.                  |
| `--color-baby-powder` / `$baby-powder` | `#F7F9F7` | Application canvas, cards, and typography backdrops.        |
| `--color-border` / `$border`           | `#000000` | Structural borders, dividers, and shadow colors.            |

The same file exposes reusable shadow tokens (`--shadow-hard-lg`, `--shadow-hard-md`, `--shadow-hard-sm`). Apply them instead of inventing new offsets to keep the NeoBrutalist depth consistent.

## 2. Typography

Typography is simple, bold, and functional. We will use common system fonts to maintain the raw, unstyled feel.

### Headings

| Level | Font Family                                | Font Size | Font Weight |
| ----- | ------------------------------------------ | --------- | ----------- |
| H1    | `Funnel Sans`, `Arial Black`, `sans-serif` | `3rem`    | `700`       |
| H2    | `Funnel Sans`, `Arial Black`, `sans-serif` | `2.5rem`  | `700`       |
| H3    | `Funnel Sans`, `Arial Black`, `sans-serif` | `2rem`    | `700`       |

### Body Text

| Element   | Font Family                                    | Font Size | Font Weight |
| --------- | ---------------------------------------------- | --------- | ----------- |
| Paragraph | `Google Sans Code`, `Courier New`, `monospace` | `1.1rem`  | `400`       |

## Font Imports

We use Google Fonts to host the primary typefaces for the site. Add the following link to the `<head>` of your layout to ensure fonts load correctly:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@700&family=Google+Sans+Code:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

If `Funnel Sans` or `Google Sans Code` are not available on Google Fonts in your region, provide suitable fallbacks as shown in the typography tables above. `Funnel Sans` can degrade gracefully to `Arial Black`. `Google Sans Code` will degrade to `Courier New` or other monospace fonts.

## 3. Component Styles

Component styles should be raw and functional, with clearly visible borders and a lack of ornamentation. These styles should be used in conjunction with the `neobrutalismcss` library.

### Buttons

Buttons keep square corners, a 3–4px black border, and one of the hard-drop shadows exported in `palette.scss`.

```html
<button class="btn btn-primary">Primary Action</button> <button class="btn btn-secondary">Secondary Action</button>
```

```css
.btn {
  border: 3px solid var(--color-border);
  box-shadow: var(--shadow-hard-md);
  background: var(--color-baby-powder);
  color: var(--color-dark-purple);
  font-family: var(--font-body);
}

.btn-primary {
  background: var(--color-claret);
  color: var(--color-baby-powder);
}

.btn-secondary {
  background: var(--color-celadon);
  color: var(--color-dark-purple);
}
```

### Form Inputs

Inputs are simple, with a focus on clarity and usability. They feature a solid border and a clean background.

```html
<input type="text" class="neo-input" placeholder="Enter your name..." />
```

```css
.neo-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-baby-powder);
  border: 3px solid var(--color-border);
  box-shadow: var(--shadow-hard-sm);
  font-family: var(--font-body);
}

.neo-input:focus {
  outline: none;
  border-color: var(--color-dark-purple);
  box-shadow:
    var(--shadow-hard-sm),
    0 0 0 2px var(--color-celadon);
}
```

### Cards/Containers

Cards are used to group content. They have a visible border and a hard shadow to lift them from the background.

```html
<div class="neo-card">
  <div class="neo-card__header">
    <h3>Card Title</h3>
  </div>
  <div class="neo-card__body">
    <p>This is the content of the card. It is simple and to the point.</p>
  </div>
</div>
```

```css
.neo-card {
  background: var(--color-baby-powder);
  border: 4px solid var(--color-border);
  box-shadow: var(--shadow-hard-lg);
}

.neo-card__header {
  padding: 1rem;
  border-bottom: 3px solid var(--color-border);
  background: var(--color-mint-green);
}

.neo-card__body {
  padding: 1rem;
}
```
