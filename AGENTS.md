# SupportUsButton — AI Agent Guidelines & Architecture Directives

Welcome, AI Agent! This document contains essential instructions, code style standards, and architectural directives for operating on the **SupportUsButton** repository.

---

## 🛠️ Stack & Workspace Overview

- **Package Name:** `support-us-button`
- **Framework:** React 19 / React 18 (`react`, `react-dom`)
- **Language:** TypeScript 5.9 (`tsconfig.json`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/cli` & `@tailwindcss/vite`)
- **Bundler:** Rollup 4 (`rollup.config.js`)
- **Dev Preview:** Vite 8 (`demo/App.tsx`)

### Key Build & Test Commands:

- **Type-Check:** `npx tsc --noEmit`
- **Build Package:** `npm run build`
- **Develop Demo:** `npm run dev:demo`

---

## 🎨 Theme Inheritance Architecture

1. **Default Theme (`Theme="auto"`)**:
   - The component MUST inherit the host website's font family (`font-inherit`) and background natively via CSS transparency (`bg-transparent text-inherit`).
   - Do **NOT** hardcode fixed background colors or font stacks on the outer component wrapper when `Theme="auto"`.

2. **Parent Style Detection (`useParentStyles` hook)**:
   - Uses `window.getComputedStyle` with upward DOM traversal inside `useIsomorphicLayoutEffect`.
   - Used primarily to evaluate relative luminance (`isDarkColor`) to invert logo (`brightness-0 invert`) and button contrast dynamically.

---

## 📁 Repository Structure

```text
SupportUsButton/
├── demo/                # Interactive Vite Dev Preview app (App.tsx)
├── dist/                # Bundled package outputs (ESM, CJS, UMD, style.css)
├── public/              # Static assets & dev preview assets
│   ├── brand/           # Brand assets & specs (Brand.md)
│   │   └── icons/       # SVG icons (supportUsButton_dark_logo.svg, etc.)
│   └── favicon.ico      # Dev preview favicon
├── src/
│   ├── components/      # SupportUsButton.tsx
│   ├── hooks/           # useParentStyles.ts
│   ├── styles/          # style.css (Tailwind v4 input)
│   ├── types/           # index.ts (TypeScript definitions)
│   └── index.ts         # Main package entrypoint
├── AGENTS.md            # AI agent instructions (this file)
├── BestPracticesChecklist.md # Audit & best practices status
├── MAINTAINERS.md       # Project maintainers and mentors
├── README.md            # User-facing package documentation
└── rollup.config.js     # Rollup bundler configuration
```

---

## ⚠️ Important Guidelines for Agents

1. **Preserve Compatibility**: Maintain support for both React 18 and React 19.
2. **Always Run Type-Check & Build**: Before declaring a task completed, execute `npx tsc --noEmit` and `npm run build`.
3. **No Unneeded Dependencies**: Avoid adding external runtime dependencies unless explicitly approved.
