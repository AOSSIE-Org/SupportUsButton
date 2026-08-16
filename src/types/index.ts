/* =========================
   Theme
========================= */

export type Theme = "auto" | "inherit" | "light" | "dark";

/* =========================
   PROJECT INFORMATION
========================= */

export type projectInformation = {
  name: string;
  description: string;
  image: string;
};

/* =========================
   ORGANIZATION INFORMATION
========================= */

export type organizationInformation = {
  name: string;
  desc: string;
  image: string;
  link: string;
};

/* =========================
   SPONSOR TIERS
========================= */

export type Tier = "Platinum" | "Gold" | "Silver" | "Bronze";

/* =========================
   SPONSOR CARD
========================= */

export type sponsor = {
  /** Sponsor logo or avatar */
  name: string;

  /** Sponsorship tier */
  sponsorshipTier?: Tier;
};

/* =========================
   CURRENT SPONSORS
========================= */

export type sponsors = sponsor[];

/* =========================
   SPONSOR LINKS (CTA)
========================= */

export type sponsorLink = {
  name: string;
  url: string;
};

/* =========================
   CTA SECTION
========================= */

export type CTASection = {
  sponsorLink: sponsorLink[];
};

/* =========================
   BORDER AROUND PAGE
========================= */

export type borderAroundPage = {
  TopX1: string;
  TopX2: string;
  BottomX1: string;
  BottomX2: string;
  LeftY1: string;
  LeftY2: string;
  RightY1: string;
  RightY2: string;
};

/* =========================
   SUPPORT US COMPO PROPS
========================= */

export interface supportUsButtonProps {
  // Theme for the button, can be one of "AOSSIE", "light", "dark", "minimal", or "corporate"
  Theme?: Theme;

  // BG Logo
  Logo?: boolean;

  // Information about the organization, including name, description, logo, and project information
  organizationInformation: organizationInformation;

  // Information about the project, including name, description, and image
  projectInformation?: projectInformation;

  // List of current sponsors, each with name, optional logo, link, and sponsorship tier
  sponsors?: sponsors;

  // Information about the call-to-action section, including title, description, and sponsor links
  ctaSection: CTASection;

  // Class to apply on root
  className?: string;

  // These defines the length in X and Y axis of border around page. Only pass it when border is not covering full page (e.g. TopX1: "-10"    TopX2: "110").
  border?: borderAroundPage;

  /** Show/hide project information section (default: true) */
  showProjectInfo?: boolean;

  /** Show/hide organization information section (default: true) */
  showOrganizationInfo?: boolean;

  /** Show/hide sponsors section (default: true) */
  showSponsors?: boolean;

  /** Show/hide background logo (default: true) */
  showBackgroundLogo?: boolean;

  /** Show/hide decorative border (default: true) */
  showBorder?: boolean;

  /** Show/hide corner icons (default: true) */
  showCornerIcons?: boolean;
}
