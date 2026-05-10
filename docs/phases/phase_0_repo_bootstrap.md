# Phase 0: Repo bootstrap

## Context
This is a brand-new repo (`dartmouth-saga`) for a card-swipe web game called The Dartmouth Saga. Nothing exists yet. This phase scaffolds the entire stack — no game logic, no cards, no theming. The goal is a clean foundation where every later phase can ship in isolation. Subsequent phases will add the QBN engine (P1), card UI + swipe (P2), 1956 era visual identity (P3), card content + art + music (P4), and PWA polish + ship (P5).

The repo's defining constraint: **eslint enforces a 250-line cap per file**. This is deliberate, anti-vibe-coding, and non-negotiable.

## Pipeline split
- **Codex side:** create the GitHub repo, scaffold the code, push, open the PR. All via `gh` CLI (assumes Codex is already authenticated to GitHub — if not, prompt Alyosha to `gh auth login` once).
- **Alyosha side, one-time after the repo exists:** vercel.com → Add New → Project → Import → pick `dartmouth-saga` → Deploy. Vercel auto-detects Vite. ~2 minutes. From then on, every PR gets an automatic preview URL and every merge to `main` becomes the prod deploy. Codex never touches Vercel directly.

GitHub Actions CI (lint/typecheck/test/build) is the merge gatekeeper. Vercel handles deploys. Two separate jobs, both triggered by every push.

## Repo creation (Codex, first thing in this phase)
1. `gh repo create dartmouth-saga --private --add-readme` (private by default; flip to public later if Alyosha decides to share).
2. Clone, create branch `phase-0-bootstrap`.
3. Build the scaffold on that branch (everything below).
4. Push, open PR titled "Phase 0: Repo bootstrap" against `main`.

## The job
Stand up a Vite 6 + React 19 + TypeScript 5.5 strict scaffold with Tailwind v4, vitest, eslint (with the 250-line cap proven to fire), a GitHub Actions CI workflow that blocks merges on lint/typecheck/test failure, a `vite-plugin-pwa` setup that produces a valid manifest at build, and a stark placeholder landing page that says "The Dartmouth Saga." A Vercel preview must render the placeholder on iPhone Safari. No game logic yet. Open a PR titled "Phase 0: Repo bootstrap" against main when CI is green.

## Files to create
- `package.json` — dependencies below
- `tsconfig.json` — strict mode, `noUncheckedIndexedAccess`, target ES2022
- `vite.config.ts` — Vite 6 + React + vite-plugin-pwa
- `vitest.config.ts` — jsdom environment, globals enabled
- `eslint.config.js` (flat config) — typescript-eslint, react, react-hooks, jsx-a11y, **max-lines 250 (skipBlankLines, skipComments)**
- `.prettierrc` — minimal (singleQuote, semi, 100 char line)
- `.gitignore` — Node/Vite defaults
- `index.html` — `<title>The Dartmouth Saga</title>`, viewport meta, theme-color
- `src/main.tsx` — React 19 root mount
- `src/App.tsx` — placeholder landing page (see below)
- `src/index.css` — Tailwind v4 import + empty `@theme` block (tokens fill in P3)
- `src/App.test.tsx` — smoke test
- `public/icon-192.png`, `public/icon-512.png` — solid color placeholders (cream paper, ink "DS" monogram); generate via Codex native image gen
- `.github/workflows/ci.yml` — runs on every PR: install, typecheck, lint, test, build
- `vercel.json` — minimal SPA rewrite config
- `README.md` — one paragraph: project name, "v0.1 in flight", link to issue #1 for roadmap
- `.editorconfig`

## Folder structure to lock (commit empty `.gitkeep` files now so later phases don't re-debate)
```
src/
  cards/        # P4 lives here
  components/   # P2+
  engine/       # P1 (QBN engine)
  state/        # P1 (zustand store)
  styles/       # P3 era tokens land here (theme.css)
  lib/          # shared utilities
```

## Dependencies
- runtime: `react@^19`, `react-dom@^19`
- dev: `vite@^6`, `@vitejs/plugin-react`, `typescript@~5.5`, `tailwindcss@^4`, `@tailwindcss/vite`, `vite-plugin-pwa`, `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `eslint@^9`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `prettier`

Do NOT install zustand, zod, framer-motion, idb-keyval, lucide-react, Howler, or any @fontsource packages yet — those land in P1–P4 to keep this phase's surface area honest.

## Placeholder landing page (`src/App.tsx`)
- Cream background (`#f5f1e8`), dark ink text (`#1a1a1a`)
- Centered: title "The Dartmouth Saga" in large serif (system serif fallback for now), one line below: "A card-swipe game about 70 years of AI history. v0.1 — coming soon."
- One small footer line: "Hanover, NH · Summer 1956"
- No interactivity. This page is the proof the pipeline works, not a teaser.

## Acceptance criteria
- [ ] CI green on the PR (typecheck, lint, vitest, build all pass)
- [ ] Vercel preview deploys; landing page renders "The Dartmouth Saga" on iPhone Safari without horizontal scroll
- [ ] `dist/manifest.webmanifest` exists in the build output and references both icons
- [ ] At least 2 vitest tests pass (see below)
- [ ] No file in `src/` exceeds 250 lines
- [ ] **eslint max-lines rule verified to fire**: temporarily create a 251-line dummy file, confirm `npm run lint` errors on it, delete the dummy. Note the verification in the PR description.
- [ ] All folder placeholders (`src/cards/`, `engine/`, `state/`, `components/`, `styles/`, `lib/`) exist with `.gitkeep`

## Tests
- `src/App.test.tsx`:
  - `renders the project title` — asserts "The Dartmouth Saga" is in the document
  - `renders the v0.1 status line` — asserts the "v0.1 — coming soon" text is present

(Two tests is the minimum that proves vitest + Testing Library + jsdom are wired correctly. Do not pad with redundant tests.)

## Out of scope (do NOT build)
- Card schema, Zod, or any data structures
- zustand or any state management
- framer-motion, swipe gestures, or animations
- Era theming beyond an empty `@theme` block (P3 fills it)
- Any portrait art beyond the two app icons
- Audio, Howler.js, or font self-hosting
- Custom fonts (use system serif/sans for the placeholder; @fontsource lands in P3)
- A real domain — Vercel default subdomain is fine for now
- Service worker config beyond what `vite-plugin-pwa` does by default
- Eras 2–7 anywhere in the UI
