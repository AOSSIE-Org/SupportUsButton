/**
 * External links used by the Vite dev preview (demo/App.tsx).
 * Keep demo URLs here instead of hard-coding them in components.
 */
export const DEMO_LINKS = {
  organization: "https://aossie.org",
  sponsor: "https://github.com/sponsors/AOSSIE-Org",
} as const;

/**
 * Pages of the demo site, relative to Vite's base URL. Each non-empty path has its own
 * `<path>index.html` entry in vite.config.ts.
 */
export const DEMO_PAGES = {
  home: "",
  privacy: "privacy/",
  terms: "terms/",
} as const;
