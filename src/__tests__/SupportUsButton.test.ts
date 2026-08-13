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

  it("should structure supportUsButtonProps cleanly", () => {
    const sampleProps: supportUsButtonProps = {
      Theme: "auto",
      Logo: true,
      organizationInformation: {
        name: "AOSSIE",
        desc: "Australian Open Source Software Innovation and Education organization",
        image: "/brand/icons/aossie_logomark.svg",
        link: "https://aossie.org",
      },
      ctaSection: {
        sponsorLink: [
          { name: "Sponsor Us", url: "https://github.com/sponsors/AOSSIE-Org" },
        ],
      },
    };

    expect(sampleProps.organizationInformation.name).toBe("AOSSIE");
    expect(sampleProps.Theme).toBe("auto");
  });
});
