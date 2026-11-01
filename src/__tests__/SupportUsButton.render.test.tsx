// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SupportUsButton from "../index";
import type { Theme, supportUsButtonProps } from "../types/index";

const org = {
  name: "AOSSIE",
  desc: "Australian Open Source Software Innovation and Education",
  image: "/org.svg",
  link: "https://aossie.org",
};
const project = { name: "SupportUsButton", description: "A sponsorship widget", image: "/project.svg" };
const cta = {
  sponsorLink: [
    { name: "Sponsor on GitHub", url: "https://github.com/sponsors/AOSSIE-Org" },
    { name: "Open Collective", url: "https://opencollective.com/aossie" },
  ],
};
const baseProps: supportUsButtonProps = { organizationInformation: org, projectInformation: project, ctaSection: cta };

const BACKGROUND_LOGO = 'svg[viewBox="0 -74 1440 1172"]';

/** Renders the component inside a host element, so the parent-style detection has something to read. */
function renderInHost(props: Partial<supportUsButtonProps> = {}, hostStyle: Partial<CSSStyleDeclaration> = {}) {
  const host = document.createElement("div");
  Object.assign(host.style, hostStyle);
  document.body.appendChild(host);
  const result = render(<SupportUsButton {...baseProps} {...props} />, { container: host });
  return { ...result, root: host.firstElementChild as HTMLElement };
}

/** Stubs getComputedStyle so every element reports the given host background. */
function mockHostBackground(backgroundColor: string, extra: Partial<CSSStyleDeclaration> = {}) {
  vi.spyOn(window, "getComputedStyle").mockImplementation(
    () => ({ backgroundColor, fontFamily: "", color: "", ...extra }) as CSSStyleDeclaration,
  );
}

const logos = () => screen.getAllByRole("img") as HTMLImageElement[];
const ctaButtons = () => screen.getAllByRole("button");

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("SupportUsButton themes", () => {
  it.each<[Theme, string[]]>([
    ["light", ["font-sans", "bg-[#F4F4F4]", "text-[#191919]"]],
    ["dark", ["font-sans", "bg-[#191919]", "text-[#F4F4F4]"]],
    ["auto", ["bg-transparent", "font-inherit", "text-inherit"]],
    ["inherit", ["bg-transparent", "font-inherit", "text-inherit"]],
  ])("renders the %s theme on the scoped root", (Theme, classes) => {
    const { root } = renderInHost({ Theme });
    for (const cls of ["sub-root", ...classes]) expect(root.classList.contains(cls)).toBe(true);
  });

  it("gives fixed themes no inherited inline font or color", () => {
    const { root } = renderInHost({ Theme: "light" }, { fontFamily: "Georgia", color: "rgb(1, 2, 3)" });
    expect(root.style.fontFamily).toBe("");
    expect(root.style.color).toBe("");
  });

  it("uses dark buttons and plain monochrome logos on the light theme", () => {
    renderInHost({ Theme: "light" });
    for (const button of ctaButtons()) expect(button.className).toContain("bg-[#191919]");
    for (const img of logos()) {
      expect(img.classList.contains("brightness-0")).toBe(true);
      expect(img.classList.contains("invert")).toBe(false);
      expect(img.style.filter).toBe("brightness(0)");
    }
  });

  it("uses light buttons and inverted logos on the dark theme", () => {
    renderInHost({ Theme: "dark" });
    for (const button of ctaButtons()) expect(button.className).toContain("bg-[#F4F4F4]");
    for (const img of logos()) {
      expect(img.classList.contains("invert")).toBe(true);
      expect(img.style.filter).toBe("brightness(0) invert(1)");
    }
  });

  it("keeps the supplied logo colors when monochromeLogos is false", () => {
    renderInHost({ Theme: "dark", monochromeLogos: false });
    for (const img of logos()) {
      expect(img.className).not.toContain("brightness-0");
      expect(img.style.filter).toBe("");
    }
  });

  it("falls back to the auto theme for an invalid Theme value", () => {
    const { root } = renderInHost({ Theme: "neon" as Theme });
    expect(root.classList.contains("bg-transparent")).toBe(true);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Invalid Theme "neon"'));
  });

  it("appends a custom className to the root", () => {
    const { root } = renderInHost({ className: "my-widget" });
    expect(root.classList.contains("my-widget")).toBe(true);
  });
});

describe("SupportUsButton auto theme detection", () => {
  it.each([
    ["rgb(255, 255, 255)", false],
    ["rgb(0, 0, 0)", true],
    ["#fff", false],
    ["#000", true],
    ["#f4f4f4", false],
    ["#191919", true],
    // WCAG relative luminance cut-off (0.179) falls between these two greys
    ["rgb(118, 118, 118)", false],
    ["rgb(117, 117, 117)", true],
    // Unparseable colors are treated as dark
    ["#ffff", true],
    ["white", true],
  ])("treats a %s host background as dark=%s", (background, dark) => {
    mockHostBackground(background);
    renderInHost({ Theme: "auto" });
    for (const img of logos()) expect(img.classList.contains("invert")).toBe(dark);
    for (const button of ctaButtons()) expect(button.className).toContain(dark ? "bg-[#F4F4F4]" : "bg-[#191919]");
  });

  it("detects the background from real host styles", () => {
    renderInHost({ Theme: "inherit" }, { backgroundColor: "rgb(250, 250, 250)" });
    for (const img of logos()) expect(img.classList.contains("invert")).toBe(false);
  });

  it("inherits the host's font family and text color inline", () => {
    mockHostBackground("rgb(255, 255, 255)", { fontFamily: "Georgia, serif", color: "rgb(10, 20, 30)" });
    const { root } = renderInHost({ Theme: "auto" });
    expect(root.style.fontFamily).toBe("Georgia, serif");
    expect(root.style.color).toBe("rgb(10, 20, 30)");
  });

  it("falls back to inherited font and color when the host sets none", () => {
    mockHostBackground("rgb(255, 255, 255)");
    const { root } = renderInHost({ Theme: "auto" });
    expect(root.style.fontFamily).toBe("inherit");
    expect(root.style.color).toBe("inherit");
  });
});

describe("SupportUsButton background logo and border", () => {
  it("renders the decorative background logo by default", () => {
    const { container } = renderInHost();
    expect(container.querySelector(BACKGROUND_LOGO)).not.toBeNull();
  });

  it("hides the background logo when Logo is false", () => {
    const { container } = renderInHost({ Logo: false });
    expect(container.querySelector(BACKGROUND_LOGO)).toBeNull();
  });

  it("draws the default border and accepts a custom one", () => {
    const { container, unmount } = renderInHost();
    expect(container.querySelector("line")?.getAttribute("x1")).toBe("-1000");
    unmount();

    const border = {
      TopX1: "-10",
      TopX2: "110",
      BottomX1: "-5",
      BottomX2: "105",
      LeftY1: "-1",
      LeftY2: "101",
      RightY1: "-2",
      RightY2: "102",
    };
    const custom = renderInHost({ border });
    const [top, bottom, left, right] = Array.from(custom.container.querySelectorAll("line"));
    expect([top.getAttribute("x1"), top.getAttribute("x2")]).toEqual(["-10", "110"]);
    expect([bottom.getAttribute("x1"), bottom.getAttribute("x2")]).toEqual(["-5", "105"]);
    expect([left.getAttribute("y1"), left.getAttribute("y2")]).toEqual(["-1", "101"]);
    expect([right.getAttribute("y1"), right.getAttribute("y2")]).toEqual(["-2", "102"]);
  });
});

describe("SupportUsButton heading and labels", () => {
  it("defaults the heading to 'Support <project>'", () => {
    renderInHost();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Support SupportUsButton");
  });

  it("renders a string heading verbatim", () => {
    renderInHost({ heading: "Fund our work" });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Fund our work");
  });

  it("calls a heading function with the project name and renders its result", () => {
    const heading = vi.fn((name?: string) => <em>Apoya a {name}</em>);
    renderInHost({ heading });
    expect(heading).toHaveBeenCalledWith("SupportUsButton");
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.querySelector("em")?.textContent).toBe("Apoya a SupportUsButton");
  });

  it("passes undefined to the heading function when there is no project", () => {
    renderInHost({ projectInformation: undefined, heading: (name) => `Support ${name ?? "us"}` });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Support us");
  });

  it("uses the English captions by default", () => {
    renderInHost();
    expect(screen.getByText("A project made by")).toBeTruthy();
    expect(screen.getByText("Supported By")).toBeTruthy();
  });

  it("replaces the captions with localized labels, each independently", () => {
    renderInHost({ labels: { madeBy: "Un projet de" } });
    expect(screen.getByText("Un projet de")).toBeTruthy();
    expect(screen.queryByText("A project made by")).toBeNull();
    expect(screen.getByText("Supported By")).toBeTruthy();
  });

  it("localizes the supportedBy caption", () => {
    renderInHost({ labels: { supportedBy: "Soutenu par" } });
    expect(screen.getByText("Soutenu par")).toBeTruthy();
    expect(screen.queryByText("Supported By")).toBeNull();
  });
});

describe("SupportUsButton project and organization sections", () => {
  it("renders the project and organization blocks with their logos", () => {
    renderInHost();
    expect(screen.getByRole("heading", { level: 2, name: "About SupportUsButton" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "About AOSSIE" })).toBeTruthy();
    expect(screen.getByText(project.description)).toBeTruthy();
    expect(screen.getByText(org.desc)).toBeTruthy();
    expect(logos().map((img) => [img.getAttribute("src"), img.alt])).toEqual([
      ["/project.svg", "SupportUsButton"],
      ["/org.svg", "AOSSIE"],
    ]);
    for (const img of logos()) expect(img.getAttribute("draggable")).toBe("false");
  });

  it("omits the project block and the made-by line without project information", () => {
    renderInHost({ projectInformation: undefined });
    expect(screen.queryByRole("heading", { level: 2, name: "About SupportUsButton" })).toBeNull();
    expect(screen.queryByText("A project made by")).toBeNull();
    expect(logos()).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Support ");
  });

  it("links the organization name in a new tab without leaking the opener", () => {
    renderInHost();
    const link = screen.getByRole("link", { name: /AOSSIE/ });
    expect(link.getAttribute("href")).toBe("https://aossie.org");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it.each(["javascript:alert(1)", "JAVASCRIPT:alert(1)", "data:text/html,<b>x</b>", "ftp://aossie.org", "not a url"])(
    "renders the organization name as plain text for the unsafe link %s",
    (link) => {
      const { container } = renderInHost({ organizationInformation: { ...org, link } });
      expect(screen.queryByRole("link", { name: /AOSSIE/ })).toBeNull();
      expect(container.innerHTML).not.toContain(link.split(":")[0] + ":");
      expect(screen.getByText(/AOSSIE$/, { selector: "span" })).toBeTruthy();
    },
  );

  it("does not link a scheme-relative-looking https: URL that lacks '//'", () => {
    // `new URL()` accepts it, but the component only links explicit http:// and https:// URLs
    renderInHost({ organizationInformation: { ...org, link: "https:aossie.org" } });
    expect(screen.queryByRole("link", { name: /AOSSIE/ })).toBeNull();
  });
});

describe("SupportUsButton CTA links", () => {
  it("renders one button per CTA link and opens it safely in a new tab", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderInHost();
    expect(ctaButtons().map((b) => b.textContent)).toEqual(["Sponsor on GitHub", "Open Collective"]);
    for (const button of ctaButtons()) expect(button.getAttribute("type")).toBe("button");

    fireEvent.click(screen.getByRole("button", { name: "Open Collective" }));
    expect(open).toHaveBeenCalledTimes(1);
    expect(open).toHaveBeenCalledWith("https://opencollective.com/aossie", "_blank", "noopener,noreferrer");
  });

  it("drops javascript: CTA links and warns", () => {
    renderInHost({
      ctaSection: {
        sponsorLink: [
          { name: "Evil", url: "javascript:alert(1)" },
          { name: "Good", url: "https://example.org" },
        ],
      },
    });
    expect(ctaButtons().map((b) => b.textContent)).toEqual(["Good"]);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("sponsorLink[0].url must be a valid http(s) URL"));
  });

  it("does not open a CTA URL that lacks an explicit http(s):// prefix", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    renderInHost({ ctaSection: { sponsorLink: [{ name: "Odd", url: "https:example.org" }] } });
    fireEvent.click(screen.getByRole("button", { name: "Odd" }));
    expect(open).not.toHaveBeenCalled();
  });

  it("renders no buttons for an empty CTA list", () => {
    renderInHost({ ctaSection: { sponsorLink: [] } });
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});

describe("SupportUsButton sponsors", () => {
  it.each(["Platinum", "Gold", "Silver", "Bronze"] as const)("labels a %s sponsor with its tier", (tier) => {
    renderInHost({ sponsors: [{ name: "Acme", sponsorshipTier: tier }] });
    expect(screen.getByText(`${tier} Sponsor`)).toBeTruthy();
  });

  it("omits the tier caption for a sponsor without a tier", () => {
    renderInHost({ sponsors: [{ name: "Acme" }] });
    expect(screen.getByText("Acme")).toBeTruthy();
    expect(screen.queryByText(/ Sponsor$/)).toBeNull();
  });

  it("drops an invalid tier", () => {
    renderInHost({ sponsors: [{ name: "Acme", sponsorshipTier: "Diamond" as "Gold" }] });
    expect(screen.queryByText("Diamond Sponsor")).toBeNull();
  });

  it("renders linked sponsors as safe anchors and others as plain items, staggering their animation", () => {
    const { container } = renderInHost({
      sponsors: [
        { name: "Google", sponsorshipTier: "Platinum", link: "https://google.com" },
        { name: "Unsafe", link: "javascript:alert(1)" },
        { name: "Local" },
      ],
    });
    const anchor = screen.getByRole("link", { name: /Google/ });
    expect(anchor.getAttribute("href")).toBe("https://google.com");
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    expect(anchor.style.animationDelay).toBe("120ms");
    expect(within(anchor).getByText("Platinum Sponsor")).toBeTruthy();

    expect(screen.queryByRole("link", { name: /Unsafe/ })).toBeNull();
    expect(container.innerHTML).not.toContain("javascript:");
    const items = container.querySelectorAll<HTMLElement>(".animate-sub-scale-in");
    expect(items).toHaveLength(3);
    expect(items[1].tagName).toBe("DIV");
    expect(items[2].style.animationDelay).toBe("360ms");
  });

  it("renders an empty sponsor row when there are no sponsors", () => {
    const { container } = renderInHost({ sponsors: [] });
    expect(container.querySelectorAll(".animate-sub-scale-in")).toHaveLength(0);
    expect(screen.getByText("Supported By")).toBeTruthy();
  });
});

describe("SupportUsButton defensive rendering", () => {
  it("renders safe defaults when called without props", () => {
    // React warns about the empty logo src that the safe defaults produce
    vi.spyOn(console, "error").mockImplementation(() => {});
    function NoProps() {
      return SupportUsButton(null as unknown as supportUsButtonProps);
    }
    const { container } = render(<NoProps />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains("sub-root")).toBe(true);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("organizationInformation must be an object"));
  });
});
