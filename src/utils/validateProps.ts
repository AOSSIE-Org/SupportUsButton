import type { supportUsButtonProps } from "../types/index";

const VALID_THEMES = ["auto", "inherit", "light", "dark"] as const;
const VALID_SPONSOR_TIERS = [
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
] as const;

const DEFAULT_BORDER = {
  TopX1: "-1000",
  TopX2: "1000",
  BottomX1: "-1000",
  BottomX2: "1000",
  LeftY1: "-1000",
  LeftY2: "1000",
  RightY1: "-1000",
  RightY2: "1000",
} as const;

type Border = {
  TopX1: string;
  TopX2: string;
  BottomX1: string;
  BottomX2: string;
  LeftY1: string;
  LeftY2: string;
  RightY1: string;
  RightY2: string;
};

declare const process:
  | {
      env?: {
        NODE_ENV?: string;
      };
    }
  | undefined;

function warn(message: string): void {
  let isProduction = false;
  try {
    isProduction =
      typeof process !== "undefined" && process.env?.NODE_ENV === "production";
  } catch {
    isProduction = false;
  }
  if (!isProduction) {
    console.warn(`[SupportUsButton] ${message}`);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidBorderValue(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }
  return Number.isFinite(Number(value));
}

export function validateProps(
  props: supportUsButtonProps,
): supportUsButtonProps {
  props = props ?? ({} as supportUsButtonProps);

  // --------------------------------
  // Theme
  // --------------------------------
  const Theme = VALID_THEMES.includes(
    props.Theme as (typeof VALID_THEMES)[number],
  )
    ? props.Theme
    : "auto";
  if (props.Theme !== undefined && Theme !== props.Theme) {
    warn(
      `Invalid Theme "${String(
        props.Theme,
      )}". Expected one of: ${VALID_THEMES.join(", ")}. Falling back to "auto".`,
    );
  }

  // --------------------------------
  // organizationInformation
  // --------------------------------
  let organizationInformation = props.organizationInformation;
  if (!isObject(organizationInformation)) {
    warn(
      "organizationInformation must be an object. Falling back to safe defaults.",
    );
    organizationInformation = {
      name: "",
      desc: "",
      image: "",
      link: "",
    };
  } else {
    const name =
      typeof organizationInformation.name === "string"
        ? organizationInformation.name.trim()
        : "";
    const desc =
      typeof organizationInformation.desc === "string"
        ? organizationInformation.desc
        : "";
    const image =
      typeof organizationInformation.image === "string"
        ? organizationInformation.image
        : "";
    const link = isValidUrl(organizationInformation.link)
      ? organizationInformation.link
      : "";
    if (!name) {
      warn(
        "organizationInformation.name must be a non-empty string. Falling back to an empty value.",
      );
    }
    if (typeof organizationInformation.desc !== "string") {
      warn(
        "organizationInformation.desc must be a string. Falling back to an empty value.",
      );
    }
    if (typeof organizationInformation.image !== "string") {
      warn(
        "organizationInformation.image must be a string. Falling back to an empty value.",
      );
    }
    if (organizationInformation.link && organizationInformation.link !== link) {
      warn(
        "organizationInformation.link must be a valid http(s) URL. Falling back to an empty value.",
      );
    }
    organizationInformation = {
      ...organizationInformation,
      name,
      desc,
      image,
      link,
    };
  }

  // --------------------------------
  // projectInformation
  // --------------------------------
  let projectInformation = props.projectInformation;
  if (projectInformation !== undefined) {
    if (!isObject(projectInformation)) {
      warn(
        "projectInformation must be an object when provided. The project section will not be rendered.",
      );
      projectInformation = undefined;
    } else {
      const name =
        typeof projectInformation.name === "string"
          ? projectInformation.name.trim()
          : "";
      const description =
        typeof projectInformation.description === "string"
          ? projectInformation.description
          : "";
      const image =
        typeof projectInformation.image === "string"
          ? projectInformation.image
          : "";
      if (!name) {
        warn(
          "projectInformation.name must be a non-empty string. The project section will not be rendered.",
        );
        projectInformation = undefined;
      } else {
        if (typeof projectInformation.description !== "string") {
          warn(
            "projectInformation.description must be a string. Falling back to an empty value.",
          );
        }
        if (typeof projectInformation.image !== "string") {
          warn(
            "projectInformation.image must be a string. Falling back to an empty value.",
          );
        }
        projectInformation = {
          ...projectInformation,
          name,
          description,
          image,
        };
      }
    }
  }

  // --------------------------------
  // sponsors
  // --------------------------------
  let sponsors = props.sponsors;
  if (sponsors !== undefined) {
    if (!Array.isArray(sponsors)) {
      warn(
        "sponsors must be an array when provided. Falling back to an empty array.",
      );
      sponsors = [];
    } else {
      sponsors = sponsors.reduce((normalized, sponsor, index) => {
        if (!isObject(sponsor)) {
          warn(
            `sponsors[${index}] must be an object. This sponsor will be ignored.`,
          );
          return normalized;
        }
        const name =
          typeof sponsor.name === "string" ? sponsor.name.trim() : "";
        if (!name) {
          warn(
            `sponsors[${index}].name must be a non-empty string. This sponsor will be ignored.`,
          );
          return normalized;
        }
        let sponsorshipTier = sponsor.sponsorshipTier;
        if (
          sponsorshipTier !== undefined &&
          !VALID_SPONSOR_TIERS.includes(
            sponsorshipTier as (typeof VALID_SPONSOR_TIERS)[number],
          )
        ) {
          warn(
            `sponsors[${index}].sponsorshipTier must be one of: ${VALID_SPONSOR_TIERS.join(
              ", ",
            )}. The invalid tier will be removed.`,
          );
          sponsorshipTier = undefined;
        }
        const { sponsorshipTier: _originalTier, ...sponsorRest } = sponsor;
        normalized.push(
          sponsorshipTier === undefined
            ? { ...sponsorRest, name }
            : { ...sponsorRest, name, sponsorshipTier },
        );
        return normalized;
      }, [] as typeof sponsors);
    }
  } else {
    sponsors = [];
  }

  // --------------------------------
  // ctaSection
  // --------------------------------
  let ctaSection = props.ctaSection;
  if (!isObject(ctaSection)) {
    warn(
      "ctaSection must be an object. Falling back to an empty sponsor link list.",
    );
    ctaSection = {
      sponsorLink: [],
    };
  } else if (!Array.isArray(ctaSection.sponsorLink)) {
    warn(
      "ctaSection.sponsorLink must be an array. Falling back to an empty sponsor link list.",
    );
    ctaSection = {
      ...ctaSection,
      sponsorLink: [],
    };
  } else {
    const sponsorLink = ctaSection.sponsorLink.reduce((normalized, link, index) => {
      if (!isObject(link)) {
        warn(
          `ctaSection.sponsorLink[${index}] must be an object. This link will be ignored.`,
        );
        return normalized;
      }
      const name = typeof link.name === "string" ? link.name.trim() : "";
      if (!name) {
        warn(
          `ctaSection.sponsorLink[${index}].name must be a non-empty string. This link will be ignored.`,
        );
        return normalized;
      }
      if (!isValidUrl(link.url)) {
        warn(
          `ctaSection.sponsorLink[${index}].url must be a valid http(s) URL. This link will be ignored.`,
        );
        return normalized;
      }
      normalized.push({ ...link, name });
      return normalized;
    }, [] as typeof ctaSection.sponsorLink);
    if (sponsorLink.length === 0) {
      warn(
        "ctaSection.sponsorLink should contain at least one valid link.",
      );
    }
    ctaSection = {
      ...ctaSection,
      sponsorLink,
    };
  }

  // --------------------------------
  // Logo
  // --------------------------------
  let Logo = props.Logo;
  if (Logo !== undefined && typeof Logo !== "boolean") {
    warn("Logo must be a boolean when provided. Falling back to true.");
    Logo = true;
  }

  // --------------------------------
  // className
  // --------------------------------
  let className = props.className;
  if (className !== undefined && typeof className !== "string") {
    warn("className must be a string when provided. Falling back to an empty string.");
    className = "";
  }

  // --------------------------------
  // border
  // --------------------------------
  let border: Border = {
    ...DEFAULT_BORDER,
  };
  if (props.border !== undefined) {
    if (!isObject(props.border)) {
      warn(
        "border must be an object when provided. Falling back to default border values.",
      );
    } else {
      const borderKeys: (keyof Border)[] = [
        "TopX1",
        "TopX2",
        "BottomX1",
        "BottomX2",
        "LeftY1",
        "LeftY2",
        "RightY1",
        "RightY2",
      ];
      borderKeys.forEach((key) => {
        const value = props.border?.[key];
        if (isValidBorderValue(value)) {
          border[key] = value;
        } else {
          warn(
            `border.${key} must be a numeric string. Falling back to "${DEFAULT_BORDER[key]}".`,
          );
        }
      });
    }
  }

  return {
    ...props,
    Theme,
    organizationInformation,
    projectInformation,
    sponsors,
    ctaSection,
    Logo,
    className,
    border,
  };
}
