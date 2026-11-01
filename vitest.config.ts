import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Tests run in Node by default; component and hook tests opt into jsdom with a `// @vitest-environment jsdom` comment.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: ["src/__tests__/setup.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "text-summary", "html", "lcov"],
        // The whole code base: the published library, its build script and the demo's logic modules
        include: ["src/**/*.{ts,tsx}", "scripts/**/*.mjs", "demo/**/*.{ts,tsx}"],
        exclude: [
          "**/*.test.{ts,tsx,mjs}", // test files
          "src/__tests__/**", // test files
          "**/*.d.ts", // type declarations only (src/global.d.ts, demo/social-share-button.d.ts)
          "src/types/**", // type-only module (exported TypeScript types, no runtime code)
          "demo/main.tsx", // demo site entry point (mounts <App />), not part of the published library
          "demo/App.tsx", // demo site, not part of the published library
          "demo/DemoFooter.tsx", // demo site, not part of the published library
          "demo/ShareButton.tsx", // demo site, not part of the published library
          "demo/legal.tsx", // demo site, not part of the published library
        ],
        thresholds: {
          lines: 90,
          statements: 90,
          functions: 90,
          branches: 90,
        },
      },
    },
  }),
);
