import type { ReactNode } from "react";

/* =========================
   Theme
========================= */

export type Theme = "AOSSIE" | "light" | "dark" | "minimal" | "corporate";

/* =========================================================
   Button Variant
========================================================= */

export type ButtonVariant = 'AOSSIE'| "primary" | "secondary" | "ghost" | "gradient";

/* =========================
   IMAGE TYPE
========================= */

export type Image = {
  src?: string;
  alt?: string;
};

/* =========================
   Hero SECTION
========================= */

export type Hero = {
  /** Optional Hero background Image */
  Image?: Image;

  title: string;
  description: string;

  /** Label like: YOU'RE SPONSORING */
  sponsorLabel?: string;
};

/* =========================
   PROJECT INFORMATION
========================= */

export type projectInformation = {
  name: string;
  description: string;
};

/* =========================
   ORGANIZATION INFORMATION
========================= */

export type organizationInformation = {
  name: string;
  description: string;

  /** Organization logo */
  logo?: Image | string;
  url?: string;
  projectInformation?: projectInformation;
};

/* =========================
   SPONSOR TIERS
========================= */

export type Tier = "Platinum" | "Gold" | "Silver" | "Bronze";

/* =========================
   SPONSOR CARD
========================= */

export type sponsor = {
  name: string;

  /** Sponsor logo or avatar */
  logo?: string;

  /** Sponsor website */
  link?: string;

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
  icon?: ReactNode;
  className?: string;

  /** open link in new tab */
  newTab?: boolean;
};

/* =========================
   CTA SECTION
========================= */

export type CTASection = {
  title: string;
  description: string;
  sponsorLink: sponsorLink[];
};

/* =========================
   BACKGROUND PATTERNS
========================= */

export type Pattern = "AOSSIE" | "dots" | "grid" | "none";

/* =========================
   SUPPORT US COMPO PROPS
========================= */

export interface supportUsButtonProps {
  // Theme for the button, can be one of "AOSSIE", "light", "dark", "minimal", or "corporate"
  Theme?: Theme;

  // Optional background pattern for the button, can be one of "dots", "grid", "stripes", or "none"
  pattern?: Pattern;

  // Information about the Hero section, including title, description, sponsor label, and optional background Image
  hero: Hero;

  // Information about the organization, including name, description, logo, and project information
  organizationInformation: organizationInformation;

  // List of current sponsors, each with name, optional logo, link, and sponsorship tier
  sponsors?: sponsors;

  // Information about the call-to-action section, including title, description, and sponsor links
  ctaSection: CTASection;

  // Optional class name for custom styling
  classNames?: {
    container?: string;
    Hero?: string;
    organizationInformation?: string;
    sponsors?: string;
    ctaSection?: string;
  };

  // Optional button variant for styling the call-to-action buttons
  buttonVariant?: ButtonVariant;
}
