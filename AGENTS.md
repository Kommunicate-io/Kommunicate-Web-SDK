# Kommunicate Web Widget – Agent Guide

This document captures conventions and project knowledge that help automation tools (Codex, Cursor, etc.) make safe, high‑quality changes inside this repository.

## Product context

-   The codebase powers **Kommunicate’s web support widget** (chat, FAQs, “What’s New”). End users are customers of Kommunicate’s clients, so UX needs to feel trustworthy, premium, and mobile-friendly.
-   The widget runs in both **light and dark themes**. Color changes must honor the dynamic theme classes injected from `kommunicate.custom.theme.js` (e.g., `.km-custom-widget-background-color`, `.km-custom-widget-text-color`) and the dark override file (`webplugin/css/app/mck-sidebox-dark.css`).

## Key directories

| Path                                         | Purpose                                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| `webplugin/template/mck-sidebox.html`        | HTML template for the widget UI.                                                        |
| `webplugin/css/app/mck-sidebox-1.0.css`      | Primary CSS (light theme).                                                              |
| `webplugin/css/app/mck-sidebox-dark.css`     | Dark-theme overrides; keep in sync with the light theme.                                |
| `webplugin/scss/**`                          | Source SCSS for widget components (compiled by build).                                  |
| `webplugin/js/app/kommunicate-ui.js`         | Core UI logic, event handlers, FAQ navigation, etc.                                     |
| `webplugin/js/app/km-post-initialization.js` | Fetches FAQ categories/articles after init.                                             |
| `webplugin/js/app/labels/default-labels.js`  | Provides translated strings and sets DOM labels (use these instead of hard-coded text). |

## Styling + UX conventions

-   **Typography**: The project standard is the Inter font. Keep headings ~17–18px, supporting text 14–15px unless a component specifies otherwise.
-   **Cards & surfaces**: Use rounded corners (16–24px) and soft drop shadows for premium feel. Buttons often use pill shapes (999px radius).
-   **FAQ / What’s New cards**: Share SCSS in `webplugin/scss/components/_km-bottom-nav.scss`. Ensure spacing, rounded corners, and gradients remain consistent.
-   **Search field**: Icon must stay visible (left), clear icon on the right. Padding ensures icons stay within 16px. When changing layout, update both HTML and CSS plus any behavior in `kommunicate-ui.js`.
-   **Back buttons**: Reuse `.mck-conversation-tab-link` styles for visual consistency. When adding new navigation controls, wire them into `MCK_EVENT_HISTORY` so the back stack works everywhere.
-   **Empty states**: Use contextual copy from `default-labels.js` and keep CTA buttons wired to `.km-custom-widget-background-color` so customer color settings apply automatically.

## Theming

-   To change colors, prefer applying existing theme classes:
    -   `.km-custom-widget-background-color`
    -   `.km-custom-widget-text-color`
    -   `.km-custom-widget-border-color`
-   If new UI requires theme-specific tweaks, update both `mck-sidebox-1.0.css` and `mck-sidebox-dark.css`. When possible, write base styles in the light file and override selective properties (background, border, text color) in the dark file.

## JavaScript patterns

-   All DOM show/hide operations should go through `kommunicateCommons.show/hide/modifyClassList` to ensure class names (`vis` / `n-vis`) stay consistent.
-   FAQ navigation uses `MCK_EVENT_HISTORY`. If adding new navigation states, push/pop entries so the global back button and the new FAQ back button perform predictably.
-   Pull labels from `MCK_LABELS` via `default-labels.js`; never hard-code user-facing text.

## Development tips

-   Use `rg` for searches (preferred in this environment).
-   When editing CSS/SCSS, add comments only when they clarify complex intent; style comments are not required for simple property changes.
-   Honor existing instructions in `README.md` and any build scripts when running tests/builds.
-   When touching FAQ/What’s New/Conversation UI, validate both desktop (~360–400px width) and mobile (narrow viewport) layouts.
-   Remember this widget runs inside customer sites—avoid global selectors that might bleed outside `#mck-sidebox`.

Keep this file updated as you learn more nuances so future automation agents can operate safely and efficiently.
