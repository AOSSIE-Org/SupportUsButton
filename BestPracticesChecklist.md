# AOSSIE Best Practices Checklist — SupportUsButton

This document tracks compliance with the **AOSSIE Best Practices Guidelines** for the **SupportUsButton** project.

---

## 🔴 Must (Mandatory Practices)

- [x] **Licensing & Copyright**: Includes GNU General Public License v3.0 in [`LICENSE`](LICENSE).
- [x] **Project Branding**: Complete SVG logo, favicon, color palette, and typography documented in [`brand/Brand.md`](brand/Brand.md).
- [x] **Maintainers List**: Listed in [`MAINTAINERS.md`](MAINTAINERS.md).
- [x] **Clean Documentation**: `README.md` and `CONTRIBUTING.md` contain no broken links or TODOs left.
- [x] **Build & Run Instructions**: `README.md` contains clear installation, development, testing, and build instructions.
- [x] **Type Safety**: Written in 100% strict TypeScript with type definitions exported.
- [x] **No Magic Constants**: Styling tokens and default properties are configured cleanly in types and CSS variables.
- [x] **Zero Build Warnings**: `npm run build` compiles cleanly with zero warnings or errors.
- [x] **AI Agent Directives**: Context and operational guidelines provided in [`AGENTS.md`](AGENTS.md).
- [x] **CodeRabbit Configuration**: Customized in [`.coderabbit.yaml`](.coderabbit.yaml).

---

## 🟡 Should (Recommended Practices)

- [x] **Automatic Host Style Adaptation**: Package inherits host page `font-family`, `background-color`, and `color` natively.
- [x] **Contrast Fail-Safes**: Dynamic relative luminance contrast calculation (`isDarkColor`) for logo and button visibility on light/dark host themes.
- [x] **Automated Testing & CI**: Unit testing and GitHub Actions workflow configured for PR validation.
- [x] **Micro-Animations**: GPU-accelerated CSS keyframe transitions (`animate-sub-fade-in`, `animate-sub-scale-in`).
- [x] **Zero Third-Party UI Dependencies**: Ultra-lightweight package architecture (only standard `tslib` helper; zero external UI framework dependencies) producing ~12 KB minified JS output (`dist/index.esm.js`) and ~4 KB minified CSS (`dist/style.css`).
- [x] **Multi-Bundle Formats**: Exports ESM (`dist/index.esm.js`), CommonJS (`dist/index.cjs.js`), and UMD (`dist/index.umd.js`).

---

## 🟢 Could (Optional / Future Enhancements)

- [ ] Interactive online playground demo deployed to GitHub Pages.
- [ ] Automated npm release workflow via GitHub Actions on tagged releases.

---

## 📑 Verification Log

* **TypeScript Validation (`npx tsc --noEmit`)**: ✅ Passed (0 errors)
* **Bundle Build (`npm run build`)**: ✅ Passed (0 warnings)
