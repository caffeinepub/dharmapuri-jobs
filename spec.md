# Dharmapuri Jobs

## Current State
Full-stack hyperlocal job app with Motoko backend and React frontend. Has student dashboard, employer dashboard, landing page, loading screen, and job cards. Current design uses a warm saffron + teal light-mode palette on a white/off-white background.

## Requested Changes (Diff)

### Add
- Dark mode color palette: deep dark backgrounds (#0D0D1A / navy-black tones in OKLCH), card surfaces in dark elevated layers
- Glowing gradient job/role cards resembling the reference fintech UI (purple-to-pink gradients, neon-ish glows)
- Frosted glass / translucent card effects on overlays
- Vibrant accent neons: electric violet/purple, hot pink/magenta, cyan, matching the reference image palette
- Bottom nav with dark surface and glowing active icon
- Header: dark background with subtle gradient, white text
- Landing hero: full dark gradient background, glowing role cards with gradient fills

### Modify
- `index.css`: Replace entire OKLCH token set with dark-first palette. Keep structural CSS (.app-shell, .bottom-nav, gradients, .btn-glow, etc.) but update colors to dark theme
- `tailwind.config.js`: Update extended colors to match new dark palette tokens
- `LandingPage.tsx`: Dark hero section, glowing role selection cards (student = violet gradient, employer = pink-magenta gradient)
- `StudentDashboard.tsx`: Dark gradient header, dark card backgrounds, glowing active nav tab
- `EmployerDashboard.tsx`: Dark gradient header, dark card backgrounds, glowing active nav tab
- `JobCard.tsx`: Dark card surface, glowing pay badge, vibrant distance pill
- `LoadingScreen.tsx`: Full dark gradient background, glowing logo pulse
- All other pages and components: adapt text, border, and background colors to dark theme

### Remove
- Light parchment / warm white backgrounds
- Saffron orange as primary – demote to accent only; make violet/purple the primary dark brand color

## Implementation Plan
1. Update OKLCH token variables in `index.css` for a full dark-mode-first palette (deep navy background, dark card surfaces, electric violet/purple primary, hot pink accent, cyan secondary)
2. Update `tailwind.config.js` to expose new violet/pink/cyan color tokens
3. Redesign `LandingPage.tsx` with dark hero gradient, glowing role cards, frosted pill stats
4. Redesign `StudentDashboard.tsx` and `EmployerDashboard.tsx` headers and nav to dark + glow style
5. Redesign `JobCard.tsx` to dark card, glowing pay, vivid distance badge
6. Update `LoadingScreen.tsx` for dark full-screen gradient
7. Update `StudentSetupPage.tsx`, `EmployerSetupPage.tsx`, and all components to adapt to dark palette
8. Run validation
