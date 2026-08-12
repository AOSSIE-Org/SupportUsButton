import type { supportUsButtonProps } from "../types";

const VALID_THEMES = ["auto", "inherit", "light", "dark"] as const;

const VALID_SPONSOR_TIERS = [
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
] as const;

function warn(message: string): void {
  console.warn(`[SupportUsButton] ${message}`);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateProps(props: supportUsButtonProps): void {
  // --------------------------------
  // Theme
  // --------------------------------

  if (!VALID_THEMES.includes(props.Theme as (typeof VALID_THEMES)[number])) {
    warn(
      `Invalid Theme "${String(
        props.Theme
      )}". Expected one of: ${VALID_THEMES.join(", ")}.`
    );
  }

  // --------------------------------
  // organizationInformation
  // --------------------------------

  if (!isObject(props.organizationInformation)) {
    warn("organizationInformation must be an object.");
  } else {
    if (
      typeof props.organizationInformation.name !== "string" ||
      !props.organizationInformation.name.trim()
    ) {
      warn("organizationInformation.name must be a non-empty string.");
    }

    if (typeof props.organizationInformation.desc !== "string") {
      warn("organizationInformation.desc must be a string.");
    }

    if (typeof props.organizationInformation.image !== "string") {
      warn("organizationInformation.image must be a string.");
    }

    if (
      typeof props.organizationInformation.link !== "string" ||
      !props.organizationInformation.link.trim()
    ) {
      warn("organizationInformation.link must be a non-empty string.");
    }
  }

  // --------------------------------
  // projectInformation
  // --------------------------------

  if (props.projectInformation !== undefined) {
    if (!isObject(props.projectInformation)) {
      warn("projectInformation must be an object when provided.");
    } else {
      if (
        typeof props.projectInformation.name !== "string" ||
        !props.projectInformation.name.trim()
      ) {
        warn("projectInformation.name must be a non-empty string.");
      }

      if (typeof props.projectInformation.description !== "string") {
        warn("projectInformation.description must be a string.");
      }

      if (typeof props.projectInformation.image !== "string") {
        warn("projectInformation.image must be a string.");
      }
    }
  }

  // --------------------------------
  // sponsors
  // --------------------------------

  if (props.sponsors !== undefined) {
    if (!Array.isArray(props.sponsors)) {
      warn("sponsors must be an array when provided.");
    } else {
      props.sponsors.forEach((sponsor, index) => {
        if (!isObject(sponsor)) {
          warn(`sponsors[${index}] must be an object.`);
          return;
        }

        if (
          typeof sponsor.name !== "string" ||
          !sponsor.name.trim()
        ) {
          warn(
            `sponsors[${index}].name must be a non-empty string.`
          );
        }

        if (
          sponsor.sponsorshipTier !== undefined &&
          !VALID_SPONSOR_TIERS.includes(
            sponsor.sponsorshipTier as (typeof VALID_SPONSOR_TIERS)[number]
          )
        ) {
          warn(
            `sponsors[${index}].sponsorshipTier must be one of: ${VALID_SPONSOR_TIERS.join(
              ", "
            )}.`
          );
        }
      });
    }
  }

  // --------------------------------
  // ctaSection
  // --------------------------------

  if (!isObject(props.ctaSection)) {
    warn("ctaSection must be an object.");
  } else if (!Array.isArray(props.ctaSection.sponsorLink)) {
    warn("ctaSection.sponsorLink must be an array.");
  } else if (props.ctaSection.sponsorLink.length === 0) {
    warn(
      "ctaSection.sponsorLink should contain at least one link."
    );
  } else {
    props.ctaSection.sponsorLink.forEach((link, index) => {
      if (!isObject(link)) {
        warn(
          `ctaSection.sponsorLink[${index}] must be an object.`
        );
        return;
      }

      if (typeof link.name !== "string" || !link.name.trim()) {
        warn(
          `ctaSection.sponsorLink[${index}].name must be a non-empty string.`
        );
      }

      if (typeof link.url !== "string" || !link.url.trim()) {
        warn(
          `ctaSection.sponsorLink[${index}].url must be a non-empty string.`
        );
      }
    });
  }

  // --------------------------------
  // Logo
  // --------------------------------

  if (props.Logo !== undefined && typeof props.Logo !== "boolean") {
    warn("Logo must be a boolean when provided.");
  }

  // --------------------------------
  // className
  // --------------------------------

  if (
    props.className !== undefined &&
    typeof props.className !== "string"
  ) {
    warn("className must be a string when provided.");
  }

  // --------------------------------
  // border
  // --------------------------------

  if (props.border !== undefined) {
    if (!isObject(props.border)) {
      warn("border must be an object when provided.");
    } else {
      const borderKeys = [
        "TopX1",
        "TopX2",
        "BottomX1",
        "BottomX2",
        "LeftY1",
        "LeftY2",
        "RightY1",
        "RightY2",
      ] as const;

      borderKeys.forEach((key) => {
        if (typeof props.border?.[key] !== "string") {
          warn(`border.${key} must be a string.`);
        }
      });
    }
  }
}