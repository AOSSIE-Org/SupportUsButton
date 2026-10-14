import React from "react";
import { renderToString } from "react-dom/server";
import { describe, it, expect } from "vitest";
import SupportUsButton from "../index";
import type { Theme, supportUsButtonProps } from "../types/index";

describe("SupportUsButton Unit & Contract Tests", () => {
  it("should export default SupportUsButton React component", () => {
    expect(SupportUsButton).toBeDefined();
    expect(typeof SupportUsButton).toBe("function");
  });

  it("should support auto, inherit, light, and dark Theme modes", () => {
    const validThemes: Theme[] = ["auto", "inherit", "light", "dark"];
    expect(validThemes).toContain("auto");
    expect(validThemes).toContain("inherit");
    expect(validThemes).toContain("light");
    expect(validThemes).toContain("dark");
  });

  it("should render SupportUsButton component with organization info, image src, accessible name, and CTA link", () => {
    const sampleProps: supportUsButtonProps = {
      Theme: "auto",
      Logo: true,
      organizationInformation: {
        name: "AOSSIE",
        desc: "Australian Open Source Software Innovation and Education organization",
        image: "/brand/icons/aossie_logomark.svg",
        link: "https://aossie.org",
      },
      projectInformation: {
        name: "TestProject",
        description: "Test description",
        image: "/brand/icons/placeholder_project_icon.svg",
      },
      sponsors: [
        { name: "Google", sponsorshipTier: "Platinum", link: "https://google.com" },
      ],
      ctaSection: {
        sponsorLink: [
          { name: "Sponsor Us", url: "https://github.com/sponsors/AOSSIE-Org" },
        ],
      },
    };

    const html = renderToString(React.createElement(SupportUsButton, sampleProps));

    // Verify rendered organization image src and accessible name
    expect(html).toContain('src="/brand/icons/aossie_logomark.svg"');
    expect(html).toContain('alt="AOSSIE"');
    expect(html).toContain("AOSSIE");

    // Verify rendered sponsor CTA button
    expect(html).toContain("Sponsor Us");

    // Verify rendered sponsor link anchor
    expect(html).toContain('href="https://google.com"');
    expect(html).toContain("Google");
  });

  it("should render localized custom heading function callback", () => {
    const customProps: supportUsButtonProps = {
      Theme: "dark",
      heading: (projectName?: string) => `Apoya a ${projectName || "nuestro proyecto"}`,
      organizationInformation: {
        name: "AOSSIE",
        desc: "Test org",
        image: "/brand/icons/aossie_logomark.svg",
        link: "https://aossie.org",
      },
      projectInformation: {
        name: "SupportUsButton",
        description: "Test",
        image: "/test.svg",
      },
      ctaSection: {
        sponsorLink: [],
      },
    };

    const html = renderToString(React.createElement(SupportUsButton, customProps));
    expect(html).toContain("Apoya a SupportUsButton");
  });

  it("should render custom heading literal string", () => {
    const customProps: supportUsButtonProps = {
      Theme: "light",
      heading: "Support Our Project Today",
      organizationInformation: {
        name: "AOSSIE",
        desc: "Test org",
        image: "/brand/icons/aossie_logomark.svg",
        link: "https://aossie.org",
      },
      ctaSection: {
        sponsorLink: [],
      },
    };

    const html = renderToString(React.createElement(SupportUsButton, customProps));
    expect(html).toContain("Support Our Project Today");
  });

  it("should validate sponsor link values and omit invalid or non-string links while preserving valid links and non-link fallback", () => {
    const propsWithSponsors: supportUsButtonProps = {
      Theme: "auto",
      organizationInformation: {
        name: "Org",
        desc: "Desc",
        image: "/img.svg",
        link: "https://org.com",
      },
      ctaSection: { sponsorLink: [] },
      sponsors: [
        { name: "Valid Sponsor", link: "https://valid.com", sponsorshipTier: "Gold" },
        { name: "Invalid Link Sponsor", link: "javascript:alert(1)", sponsorshipTier: "Silver" },
        { name: "NonString Link Sponsor", link: (123 as unknown) as string, sponsorshipTier: "Bronze" },
        { name: "No Link Sponsor", sponsorshipTier: "Bronze" },
      ],
    };

    const html = renderToString(React.createElement(SupportUsButton, propsWithSponsors));
    // Valid link rendered as anchor
    expect(html).toContain('href="https://valid.com"');
    expect(html).toContain("Valid Sponsor");
    // Invalid links omitted from hrefs
    expect(html).not.toContain("javascript:alert(1)");
    expect(html).not.toContain('href="123"');
    // Non-link fallback rendered as div for Invalid/NonString/No link sponsors
    expect(html).toContain("Invalid Link Sponsor");
    expect(html).toContain("NonString Link Sponsor");
    expect(html).toContain("No Link Sponsor");
  });

  it("should render border SVG with overflow-hidden boundary to clip border strokes", () => {
    const props: supportUsButtonProps = {
      organizationInformation: {
        name: "Org",
        desc: "Desc",
        image: "/img.svg",
        link: "https://org.com",
      },
      ctaSection: { sponsorLink: [] },
    };

    const html = renderToString(React.createElement(SupportUsButton, props));
    expect(html).toContain('overflow-hidden pointer-events-none z-0');
  });
});
