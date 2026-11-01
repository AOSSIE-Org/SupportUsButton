import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { DEFAULT_BORDER, validateProps } from "../utils/validateProps";
import type { supportUsButtonProps } from "../types/index";

const org = { name: "AOSSIE", desc: "Org", image: "/org.svg", link: "https://aossie.org" };
const cta = { sponsorLink: [{ name: "Sponsor", url: "https://github.com/sponsors/AOSSIE-Org" }] };
const valid: supportUsButtonProps = { organizationInformation: org, ctaSection: cta };

/** Validates props typed loosely, the way untyped JavaScript callers can pass them. */
const check = (props: Record<string, unknown>) => validateProps({ ...valid, ...props } as unknown as supportUsButtonProps);

let warn: MockInstance<typeof console.warn>;
const warnings = () => warn.mock.calls.map(([message]) => String(message));

beforeEach(() => {
  warn = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("validateProps with valid props", () => {
  it("keeps valid props unchanged, adds the default border and does not warn", () => {
    const result = validateProps({
      ...valid,
      Theme: "dark",
      Logo: false,
      className: "x",
      sponsors: [{ name: "Acme", sponsorshipTier: "Gold", link: "https://acme.test" }],
      projectInformation: { name: "P", description: "D", image: "/p.svg" },
    });
    expect(result).toMatchObject({
      Theme: "dark",
      Logo: false,
      className: "x",
      organizationInformation: org,
      ctaSection: cta,
      sponsors: [{ name: "Acme", sponsorshipTier: "Gold", link: "https://acme.test" }],
      projectInformation: { name: "P", description: "D", image: "/p.svg" },
      border: DEFAULT_BORDER,
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it("defaults Theme to auto and sponsors to an empty list without warning", () => {
    const result = validateProps(valid);
    expect(result.Theme).toBe("auto");
    expect(result.sponsors).toEqual([]);
    expect(result.Logo).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
  });

  it("prefixes warnings with the component name", () => {
    check({ Theme: "neon" });
    expect(warnings()[0]).toMatch(/^\[SupportUsButton\] Invalid Theme "neon"/);
  });
});

describe("validateProps fallbacks", () => {
  it("does not throw for a Theme whose toString is not callable", () => {
    expect(check({ Theme: { toString: "" } }).Theme).toBe("auto");
    expect(warnings()).toEqual([expect.stringContaining('Invalid Theme "[object Object]"')]);
  });

  it("does not throw for a Theme that cannot be converted to any string", () => {
    const hostile = new Proxy({}, {
      get() {
        throw new Error("no access");
      },
    });
    expect(check({ Theme: hostile }).Theme).toBe("auto");
    expect(warnings()).toEqual([expect.stringContaining('Invalid Theme "[unprintable value]"')]);
  });

  it("survives null props", () => {
    const result = validateProps(null as unknown as supportUsButtonProps);
    expect(result.organizationInformation).toEqual({ name: "", desc: "", image: "", link: "" });
    expect(result.ctaSection).toEqual({ sponsorLink: [] });
    expect(warnings()).toEqual(
      expect.arrayContaining([
        expect.stringContaining("organizationInformation must be an object"),
        expect.stringContaining("ctaSection must be an object"),
      ]),
    );
  });

  it("normalizes each organizationInformation field", () => {
    const result = check({ organizationInformation: { name: "  AOSSIE  ", desc: 1, image: null, link: "javascript:alert(1)" } });
    expect(result.organizationInformation).toEqual({ name: "AOSSIE", desc: "", image: "", link: "" });
    expect(warnings()).toEqual([
      expect.stringContaining("organizationInformation.desc must be a string"),
      expect.stringContaining("organizationInformation.image must be a string"),
      expect.stringContaining("organizationInformation.link must be a valid http(s) URL"),
    ]);
  });

  it("warns about a blank organization name and keeps an empty link silently", () => {
    const result = check({ organizationInformation: { name: 42, desc: "d", image: "i", link: "" } });
    expect(result.organizationInformation?.name).toBe("");
    expect(warnings()).toEqual([expect.stringContaining("organizationInformation.name must be a non-empty string")]);
  });

  it("drops projectInformation that is not an object or has no name", () => {
    expect(check({ projectInformation: "P" }).projectInformation).toBeUndefined();
    expect(check({ projectInformation: { name: "   ", description: "", image: "" } }).projectInformation).toBeUndefined();
    expect(warnings()).toEqual([
      expect.stringContaining("projectInformation must be an object"),
      expect.stringContaining("projectInformation.name must be a non-empty string"),
    ]);
  });

  it("normalizes projectInformation fields", () => {
    const result = check({ projectInformation: { name: " P ", description: 5, image: false } });
    expect(result.projectInformation).toEqual({ name: "P", description: "", image: "" });
    expect(warnings()).toEqual([
      expect.stringContaining("projectInformation.description must be a string"),
      expect.stringContaining("projectInformation.image must be a string"),
    ]);
  });

  it("replaces a non-array sponsors value with an empty list", () => {
    expect(check({ sponsors: { name: "Acme" } }).sponsors).toEqual([]);
    expect(warnings()).toEqual([expect.stringContaining("sponsors must be an array")]);
  });

  it("filters and normalizes sponsors", () => {
    const result = check({
      sponsors: [
        "Acme",
        { name: "" },
        { name: " Acme ", sponsorshipTier: "Diamond", link: "ftp://acme.test", extra: 1 },
        { name: "Beta", link: "https://beta.test" },
      ],
    });
    expect(result.sponsors).toEqual([{ name: "Acme", extra: 1 }, { name: "Beta", link: "https://beta.test" }]);
    expect(warnings()).toEqual([
      expect.stringContaining("sponsors[0] must be an object"),
      expect.stringContaining("sponsors[1].name must be a non-empty string"),
      expect.stringContaining("sponsors[2].sponsorshipTier must be one of: Platinum, Gold, Silver, Bronze"),
      expect.stringContaining("sponsors[2].link must be a valid http(s) URL"),
    ]);
  });

  it("replaces a ctaSection without a sponsorLink array", () => {
    expect(check({ ctaSection: { sponsorLink: "x", title: "t" } }).ctaSection).toEqual({ sponsorLink: [], title: "t" });
    expect(warnings()).toEqual([expect.stringContaining("ctaSection.sponsorLink must be an array")]);
  });

  it("filters CTA links and warns when none is left", () => {
    const result = check({
      ctaSection: { sponsorLink: [null, { name: " ", url: "https://a.test" }, { name: "A", url: "mailto:a@b.c" }] },
    });
    expect(result.ctaSection.sponsorLink).toEqual([]);
    expect(warnings()).toEqual([
      expect.stringContaining("ctaSection.sponsorLink[0] must be an object"),
      expect.stringContaining("ctaSection.sponsorLink[1].name must be a non-empty string"),
      expect.stringContaining("ctaSection.sponsorLink[2].url must be a valid http(s) URL"),
      expect.stringContaining("ctaSection.sponsorLink should contain at least one valid link"),
    ]);
  });

  it("trims CTA names and keeps http and https URLs", () => {
    const result = check({ ctaSection: { sponsorLink: [{ name: " A ", url: "http://a.test" }, { name: "B", url: " " }] } });
    expect(result.ctaSection.sponsorLink).toEqual([{ name: "A", url: "http://a.test" }]);
  });

  it("falls back for a non-boolean Logo and a non-string className", () => {
    const result = check({ Logo: "yes", className: 3 });
    expect(result.Logo).toBe(true);
    expect(result.className).toBe("");
    expect(warnings()).toEqual([
      expect.stringContaining("Logo must be a boolean"),
      expect.stringContaining("className must be a string"),
    ]);
  });

  it("keeps numeric border values and replaces the rest with defaults", () => {
    const result = check({
      border: { TopX1: "-10", TopX2: "110", BottomX1: "abc", BottomX2: "", LeftY1: 5, LeftY2: "1e2", RightY1: " 3 " },
    });
    expect(result.border).toEqual({
      ...DEFAULT_BORDER,
      TopX1: "-10",
      TopX2: "110",
      LeftY2: "1e2",
      RightY1: " 3 ",
    });
    expect(warnings()).toEqual([
      'border.BottomX1 must be a numeric string. Falling back to "-1000".',
      'border.BottomX2 must be a numeric string. Falling back to "1000".',
      'border.LeftY1 must be a numeric string. Falling back to "-1000".',
      'border.RightY2 must be a numeric string. Falling back to "1000".',
    ].map((m) => `[SupportUsButton] ${m}`));
  });

  it("ignores a non-object border", () => {
    expect(check({ border: "wide" }).border).toEqual(DEFAULT_BORDER);
    expect(warnings()).toEqual([expect.stringContaining("border must be an object")]);
  });
});

describe("validateProps warnings in production", () => {
  it("stays silent when NODE_ENV is production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(check({ Theme: "neon" }).Theme).toBe("auto");
    expect(warn).not.toHaveBeenCalled();
  });

  it("still warns when the environment cannot be read", () => {
    // The library does not depend on Node types, so reach `process` through globalThis
    const proc = (globalThis as unknown as { process: object }).process;
    const descriptor = Object.getOwnPropertyDescriptor(proc, "env")!;
    Object.defineProperty(proc, "env", {
      configurable: true,
      get() {
        throw new Error("env is not available");
      },
    });
    try {
      check({ Theme: "neon" });
    } finally {
      Object.defineProperty(proc, "env", descriptor);
    }
    expect(warnings()).toEqual([expect.stringContaining('Invalid Theme "neon"')]);
  });
});
