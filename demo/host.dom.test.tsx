// @vitest-environment jsdom
import React from "react";
import fc from "fast-check";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SupportUsButton from "../src/index";
import { HOST_BG_MAP, HOST_STORAGE_KEYS, getAssetUrl, savedHostTheme, themeForBackground } from "./host";

beforeEach(() => {
  localStorage.clear();
});

describe("demo/host savedHostTheme", () => {
  it("is dark for the default dark zinc background when nothing is saved", () => {
    expect(savedHostTheme()).toBe("dark");
  });

  it("follows the saved host background", () => {
    localStorage.setItem(HOST_STORAGE_KEYS.bg, "light");
    expect(savedHostTheme()).toBe("light");
    localStorage.setItem(HOST_STORAGE_KEYS.bg, "ocean");
    expect(savedHostTheme()).toBe("dark");
  });

  it("falls back to dark zinc for an unknown saved key", () => {
    localStorage.setItem(HOST_STORAGE_KEYS.bg, "neon");
    expect(savedHostTheme()).toBe("dark");
  });
});

describe("demo/host getAssetUrl", () => {
  const base = import.meta.env.BASE_URL;

  it("resolves public paths against Vite's base URL with exactly one slash", () => {
    expect(base.endsWith("/")).toBe(true);
    expect(getAssetUrl("/brand/icons/logo.svg")).toBe(`${base}brand/icons/logo.svg`);
    expect(getAssetUrl("privacy/")).toBe(`${base}privacy/`);
  });

  it("adds the missing trailing slash to the base URL and falls back to /", () => {
    vi.stubEnv("BASE_URL", "/sub");
    expect(getAssetUrl("x.svg")).toBe("/sub/x.svg");
    vi.stubEnv("BASE_URL", "");
    expect(getAssetUrl("/x.svg")).toBe("/x.svg");
    vi.unstubAllEnvs();
  });

  it("property: never doubles or drops the slash between base and path", () => {
    const segment = fc.stringMatching(/^[a-z0-9._-]{1,12}$/);
    fc.assert(
      fc.property(fc.array(segment, { minLength: 1, maxLength: 4 }), fc.boolean(), (parts, leadingSlash) => {
        const path = parts.join("/");
        const url = getAssetUrl(leadingSlash ? `/${path}` : path);
        expect(url).toBe(`${base}${path}`);
        expect(url.slice(base.length - 1)).not.toMatch(/^\/\//);
      }),
    );
  });
});

describe("demo/host themeForBackground", () => {
  it("property: agrees with the component's own dark-background detection", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const org = { name: "AOSSIE", desc: "", image: "/org.svg", link: "https://aossie.org" };
    const channel = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(channel, channel, channel, (r, g, b) => {
        cleanup();
        const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
        vi.spyOn(window, "getComputedStyle").mockImplementation(
          () => ({ backgroundColor: `rgb(${r}, ${g}, ${b})`, fontFamily: "", color: "" }) as CSSStyleDeclaration,
        );
        render(<SupportUsButton Theme="auto" organizationInformation={org} ctaSection={{ sponsorLink: [] }} />);
        const componentIsDark = screen.getByRole("img").classList.contains("invert");
        expect(themeForBackground(hex)).toBe(componentIsDark ? "dark" : "light");
      }),
      { numRuns: 60 },
    );
  });

  it("offers only #rrggbb backgrounds with labels that name them", () => {
    for (const { bg, label } of Object.values(HOST_BG_MAP)) {
      expect(bg).toMatch(/^#[0-9a-f]{6}$/);
      expect(label).toContain(bg);
    }
  });
});
