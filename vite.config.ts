import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { DEMO_PAGES } from "./demo/config.ts";

// One HTML entry per demo page: index.html, privacy/index.html and terms/index.html
const pageInput = (path: string) => fileURLToPath(new URL(`./${path}index.html`, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/SupportUsButton/",
  build: {
    rolldownOptions: {
      input: Object.fromEntries(Object.entries(DEMO_PAGES).map(([name, path]) => [name, pageInput(path)])),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
