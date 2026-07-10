
/* =========================
   Theme
========================= */

export type Theme = "light" | "dark";

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
   SUPPORT US COMPO PROPS
========================= */

export interface supportUsButtonProps {
  // Theme for the button, can be one of "AOSSIE", "light", "dark", "minimal", or "corporate"
  Theme?: Theme;

  // Information about the organization, including name, description, logo, and project information
  organizationInformation: organizationInformation;

  // Information about the project, including name, description, and image
  projectInformation?: projectInformation;

  // List of current sponsors, each with name, optional logo, link, and sponsorship tier
  sponsors?: sponsors;

  // Information about the call-to-action section, including title, description, and sponsor links
  ctaSection: CTASection;
}
