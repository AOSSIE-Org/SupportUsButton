import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import viteConfig from "../vite.config";
import { DEMO_LINKS, DEMO_PAGES } from "./config";

describe("demo/config links", () => {
  it("should only contain https:// URLs", () => {
    for (const url of Object.values(DEMO_LINKS)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});

describe("demo/config pages", () => {
  it("should be relative paths that end in a slash", () => {
    for (const path of Object.values(DEMO_PAGES)) {
      expect(path).toMatch(/^([a-z-]+\/)?$/);
    }
  });

  it("each have an index.html entry", () => {
    for (const path of Object.values(DEMO_PAGES)) {
      expect(existsSync(fileURLToPath(new URL(`../${path}index.html`, import.meta.url)))).toBe(true);
    }
  });

  it("are all inputs of the Vite build", () => {
    const input = viteConfig.build?.rolldownOptions?.input as Record<string, string>;
    for (const [name, path] of Object.entries(DEMO_PAGES)) {
      expect(input[name]).toBe(fileURLToPath(new URL(`../${path}index.html`, import.meta.url)));
    }
  });
});
