// @vitest-environment jsdom
import React from "react";
import fc from "fast-check";
import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SupportUsButton from "../index";
import { validateProps } from "../utils/validateProps";
import type { supportUsButtonProps } from "../types/index";

const VALID_THEMES = ["auto", "inherit", "light", "dark"];
const VALID_TIERS = ["Platinum", "Gold", "Silver", "Bronze"];
const HTTP_URL = /^https?:\/\//i;

const org = { name: "AOSSIE", desc: "Org", image: "/org.svg", link: "https://aossie.org" };
const cta = { sponsorLink: [{ name: "Sponsor", url: "https://github.com/sponsors/AOSSIE-Org" }] };

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

/** Any value an untyped caller might pass for a prop. */
const anyValue = fc.oneof(
  fc.anything({ maxDepth: 2 }),
  fc.string(),
  fc.webUrl(),
  fc.constantFrom("javascript:alert(1)", "https:x.test", " https://x.test", "", "Gold", "dark"),
);
const linkLike = fc.oneof(
  fc.webUrl(),
  fc.string(),
  fc.constantFrom("javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,x", "https:x.test", "//x.test"),
);
const sponsorLike = fc.oneof(
  anyValue,
  fc.record(
    { name: anyValue, sponsorshipTier: fc.oneof(fc.constantFrom(...VALID_TIERS), anyValue), link: linkLike },
    { requiredKeys: [] },
  ),
);
const ctaLinkLike = fc.oneof(anyValue, fc.record({ name: anyValue, url: linkLike }, { requiredKeys: [] }));

/** Arbitrary, mostly invalid props in the shape of supportUsButtonProps. */
const looseProps = fc.record(
  {
    Theme: fc.oneof(fc.constantFrom(...VALID_THEMES), anyValue),
    Logo: anyValue,
    className: anyValue,
    organizationInformation: fc.oneof(
      anyValue,
      fc.record({ name: anyValue, desc: anyValue, image: anyValue, link: linkLike }, { requiredKeys: [] }),
    ),
    projectInformation: fc.oneof(
      anyValue,
      fc.record({ name: anyValue, description: anyValue, image: anyValue }, { requiredKeys: [] }),
    ),
    sponsors: fc.oneof(anyValue, fc.array(sponsorLike, { maxLength: 5 })),
    ctaSection: fc.oneof(anyValue, fc.record({ sponsorLink: fc.oneof(anyValue, fc.array(ctaLinkLike, { maxLength: 4 })) })),
    border: fc.oneof(anyValue, fc.dictionary(fc.constantFrom("TopX1", "TopX2", "LeftY1", "RightY2"), anyValue)),
  },
  { requiredKeys: [] },
) as fc.Arbitrary<supportUsButtonProps>;

const isTrimmedNonEmpty = (s: unknown) => typeof s === "string" && s.length > 0 && s === s.trim();

describe("validateProps properties", () => {
  it("never throws and always returns props the component can render safely", () => {
    fc.assert(
      fc.property(looseProps, (props) => {
        const out = validateProps(props);
        expect(VALID_THEMES).toContain(out.Theme);
        expect(typeof out.organizationInformation.name).toBe("string");
        expect(out.organizationInformation.link === "" || HTTP_URL.test(new URL(out.organizationInformation.link).href)).toBe(true);
        for (const link of out.ctaSection.sponsorLink) {
          expect(isTrimmedNonEmpty(link.name)).toBe(true);
          expect(["http:", "https:"]).toContain(new URL(link.url).protocol);
        }
        for (const sponsor of out.sponsors ?? []) {
          expect(isTrimmedNonEmpty(sponsor.name)).toBe(true);
          if (sponsor.sponsorshipTier !== undefined) expect(VALID_TIERS).toContain(sponsor.sponsorshipTier);
          if (sponsor.link !== undefined) expect(["http:", "https:"]).toContain(new URL(sponsor.link).protocol);
        }
        if (out.projectInformation !== undefined) expect(isTrimmedNonEmpty(out.projectInformation.name)).toBe(true);
        for (const value of Object.values(out.border ?? {})) expect(Number.isFinite(Number(value))).toBe(true);
        expect(out.Logo === undefined || typeof out.Logo === "boolean").toBe(true);
        expect(out.className === undefined || typeof out.className === "string").toBe(true);
      }),
      { numRuns: 300 },
    );
  });

  it("is idempotent: validating validated props changes nothing and warns no more", () => {
    fc.assert(
      fc.property(looseProps, (props) => {
        const once = validateProps(props);
        vi.mocked(console.warn).mockClear();
        const twice = validateProps(once);
        expect(twice).toEqual(once);
        // Only notices about values that stay empty can repeat: a blank organization name and an empty CTA list
        for (const [message] of vi.mocked(console.warn).mock.calls) {
          expect(String(message)).toMatch(/organizationInformation\.name must be a non-empty string|should contain at least one valid link/);
        }
      }),
      { numRuns: 300 },
    );
  });
});

describe("SupportUsButton rendering properties", () => {
  it("only ever renders http(s) links and one item per valid sponsor", () => {
    fc.assert(
      fc.property(fc.array(sponsorLike, { maxLength: 5 }), linkLike, (sponsors, orgLink) => {
        cleanup();
        const props = {
          Theme: "light",
          organizationInformation: { ...org, link: orgLink },
          projectInformation: { name: "P", description: "D", image: "/p.svg" },
          sponsors,
          ctaSection: cta,
        } as supportUsButtonProps;
        const { container } = render(<SupportUsButton {...props} />);
        for (const anchor of Array.from(container.querySelectorAll("a"))) {
          expect(anchor.getAttribute("href")).toMatch(HTTP_URL);
          expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
        }
        // Text may contain anything, but no attribute may carry a script URL
        expect(container.querySelectorAll('[href*="javascript:" i], [src*="javascript:" i]')).toHaveLength(0);
        const expected = validateProps(props).sponsors ?? [];
        expect(container.querySelectorAll(".animate-sub-scale-in")).toHaveLength(expected.length);
      }),
      { numRuns: 60 },
    );
  });

  it("renders any string heading and labels verbatim", () => {
    const text = fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0);
    fc.assert(
      fc.property(text, text, text, (heading, madeBy, supportedBy) => {
        cleanup();
        render(
          <SupportUsButton
            Theme="dark"
            heading={heading}
            labels={{ madeBy, supportedBy }}
            // Fixture texts are longer than any generated text, so the queries below cannot match them
            organizationInformation={{ ...org, desc: "An organization description longer than thirty characters" }}
            projectInformation={{ name: "P", description: "A project description longer than thirty characters", image: "/p.svg" }}
            ctaSection={cta}
          />,
        );
        expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(heading);
        expect(screen.getByText(madeBy, { selector: "p", normalizer: (s) => s })).toBeTruthy();
        expect(screen.getByText(supportedBy, { selector: "span", normalizer: (s) => s })).toBeTruthy();
      }),
      { numRuns: 40 },
    );
  });

  it("decides dark vs light the same way for a host color written as rgb() or #rrggbb", () => {
    const isDarkFor = (backgroundColor: string) => {
      cleanup();
      vi.mocked(window.getComputedStyle).mockImplementation(
        () => ({ backgroundColor, fontFamily: "", color: "" }) as CSSStyleDeclaration,
      );
      render(<SupportUsButton Theme="auto" organizationInformation={org} ctaSection={cta} />);
      return screen.getByRole("img").classList.contains("invert");
    };
    vi.spyOn(window, "getComputedStyle");
    const channel = fc.integer({ min: 0, max: 255 });
    fc.assert(
      fc.property(channel, channel, channel, (r, g, b) => {
        const hex = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
        expect(isDarkFor(hex)).toBe(isDarkFor(`rgb(${r}, ${g}, ${b})`));
      }),
      { numRuns: 40 },
    );
  });
});
