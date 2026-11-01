import { describe, it, expect } from "vitest";
import { HOST_BG_MAP, themeForBackground } from "./host";

describe("demo/host themeForBackground", () => {
  it("should treat the light host background as light and every other one as dark", () => {
    for (const [key, { bg }] of Object.entries(HOST_BG_MAP)) {
      expect(themeForBackground(bg)).toBe(key === "light" ? "light" : "dark");
    }
  });

  it("should split black and white", () => {
    expect(themeForBackground("#000000")).toBe("dark");
    expect(themeForBackground("#ffffff")).toBe("light");
  });
});
