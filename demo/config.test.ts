import { describe, it, expect } from "vitest";
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
});
