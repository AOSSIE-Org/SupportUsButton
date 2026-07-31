import SupportUsButton from "../index";
import type { Theme, supportUsButtonProps } from "../types/index";

export function testSupportUsButtonPackage(): boolean {
  // Test 1: Export definition
  if (typeof SupportUsButton !== "function") {
    throw new Error("SupportUsButton default export is missing or invalid");
  }

  // Test 2: Theme prop types
  const validThemes: Theme[] = ["auto", "inherit", "light", "dark"];
  if (!validThemes.includes("auto") || !validThemes.includes("inherit")) {
    throw new Error("Theme type definition is missing auto or inherit options");
  }

  // Test 3: Sample props validation
  const sampleProps: supportUsButtonProps = {
    Theme: "auto",
    Logo: true,
    organizationInformation: {
      name: "AOSSIE",
      desc: "Australian Open Source Software Innovation and Education organization",
      image: "/aossie_logomark.svg",
      link: "https://aossie.org",
    },
    ctaSection: {
      sponsorLink: [
        { name: "Sponsor Us", url: "https://github.com/sponsors/AOSSIE-Org" },
      ],
    },
  };

  if (sampleProps.organizationInformation.name !== "AOSSIE") {
    throw new Error("Organization name mismatch");
  }

  return true;
}

testSupportUsButtonPackage();
