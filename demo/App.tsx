import React, { useState, useEffect } from "react";
import SupportUsButton from "../src/index";
import type { Theme, supportUsButtonProps } from "../src/types/index";
import "../src/styles/style.css";

const DEMO_TEXT = {
  headerTitle: "SupportUsButton - Dev Preview",
  themeLabel: "Theme Prop:",
  hostBgLabel: "Host BG:",
  hostFontLabel: "Host Font:",
  bgLogoLabel: "BG Logo:",
  toggleLogoAction: "Toggle background logo visibility",
  options: {
    auto: "✨ Auto (Host Adapted)",
    inherit: "🏛️ Inherit (Host Theme)",
    light: "☀️ Light",
    dark: "🌙 Dark",
  },
};

const HOST_BG_MAP: Record<string, { bg: string; text: string; label: string }> = {
  zinc: { bg: "#09090b", text: "#ffffff", label: "Dark Zinc (#09090b)" },
  slate: { bg: "#0f172a", text: "#ffffff", label: "Slate Dark (#0f172a)" },
  amber: { bg: "#451a03", text: "#fef3c7", label: "Amber Dark (#451a03)" },
  ocean: { bg: "#082f49", text: "#e0f2fe", label: "Deep Ocean (#082f49)" },
  purple: { bg: "#3b0764", text: "#f3e8ff", label: "Royal Purple (#3b0764)" },
  light: { bg: "#f3f4f6", text: "#111827", label: "Light Gray (#f3f4f6)" },
};

const HOST_FONT_MAP: Record<string, { family: string; label: string }> = {
  sans: { family: "ui-sans-serif, system-ui, -apple-system, sans-serif", label: "Sans-Serif" },
  serif: { family: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif", label: "Serif (Georgia)" },
  mono: { family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", label: "Monospace (SFMono)" },
};

const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("demo_theme_prop") as Theme) || "auto";
  });
  const [showLogo, setShowLogo] = useState<boolean>(() => {
    return localStorage.getItem("demo_show_logo") !== "false";
  });
  const [customHostBgKey, setCustomHostBgKey] = useState<string>(() => {
    return localStorage.getItem("demo_host_bg_key") || "zinc";
  });
  const [customHostFontKey, setCustomHostFontKey] = useState<string>(() => {
    return localStorage.getItem("demo_host_font_key") || "sans";
  });
  const [projectName, setProjectName] = useState<string>(() => {
    return localStorage.getItem("demo_project_name") || "{Project}";
  });
  const [projectDescription, setProjectDescription] = useState<string>(() => {
    return (
      localStorage.getItem("demo_project_description") ||
      "This is a placeholder description for this project. Replace this with your project's overview and description."
    );
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("demo_theme_prop", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("demo_show_logo", String(showLogo));
  }, [showLogo]);

  useEffect(() => {
    localStorage.setItem("demo_host_bg_key", customHostBgKey);
  }, [customHostBgKey]);

  useEffect(() => {
    localStorage.setItem("demo_host_font_key", customHostFontKey);
  }, [customHostFontKey]);

  useEffect(() => {
    localStorage.setItem("demo_project_name", projectName);
  }, [projectName]);

  useEffect(() => {
    localStorage.setItem("demo_project_description", projectDescription);
  }, [projectDescription]);

  const activeBg = HOST_BG_MAP[customHostBgKey] || HOST_BG_MAP.zinc;
  const activeFont = HOST_FONT_MAP[customHostFontKey] || HOST_FONT_MAP.sans;

  const sampleProps: supportUsButtonProps = {
    Theme: theme,
    Logo: showLogo,
    organizationInformation: {
      name: "AOSSIE",
      desc: "Australian Open Source Software Innovation and Education organization dedicated to fostering innovation and open source projects globally.",
      image: getAssetUrl("brand/icons/aossie_dark_logomark.svg"),
      link: "https://aossie.org",
    },
    projectInformation: {
      name: projectName,
      description: projectDescription,
      image: getAssetUrl("brand/icons/placeholder_project_icon.svg"),
    },
    sponsors: [
      { name: "Google Open Source", sponsorshipTier: "Platinum" },
      { name: "GitHub Sponsors", sponsorshipTier: "Platinum" },
      { name: "Stability Nexus", sponsorshipTier: "Gold" },
    ],
    ctaSection: {
      sponsorLink: [
        { name: "Support Now", url: "https://github.com/sponsors/AOSSIE-Org" },
      ],
    },
  };

  return (
    <div
      style={{
        backgroundColor: activeBg.bg,
        color: activeBg.text,
        fontFamily: activeFont.family,
      }}
      className="min-h-screen transition-all duration-300 flex flex-col w-full"
    >
      {/* Top Controls Bar - Full Width with Centrally Aligned Header Branding */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-900/95 border-b border-zinc-800 px-4 py-3 sm:px-6 flex flex-col items-center justify-center gap-3 shadow-xl">
        <div className="flex items-center justify-between md:justify-center gap-3 text-center w-full">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <img src={getAssetUrl("brand/icons/aossie_logo.svg")} alt="AOSSIE Logo" className="h-7 sm:h-8 w-auto object-contain" />
            <span className="text-zinc-500 font-bold text-sm select-none">✕</span>
            <img src={getAssetUrl("brand/icons/supportUsButton_logo.svg")} alt="SupportUsButton Logo" className="h-6 sm:h-7 w-auto object-contain" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans ml-1">{DEMO_TEXT.headerTitle}</h1>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            aria-label="Toggle Controls Menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-800 text-gray-300 hover:text-white hover:bg-zinc-700 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer active:scale-95 transition-all flex-none"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Controls Container: Hidden on mobile unless toggled, always visible on desktop */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 font-sans w-full border-t border-zinc-800/80 pt-3 transition-all duration-300`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <label htmlFor="project-name-input" className="text-sm font-medium text-gray-300 whitespace-nowrap">
              Project Name:
            </label>
            <input
              id="project-name-input"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. {Project}"
              className="px-3 py-1.5 rounded-lg text-sm bg-zinc-800 text-amber-300 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-44 font-semibold"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <label htmlFor="project-desc-input" className="text-sm font-medium text-gray-300 whitespace-nowrap">
              Project Description:
            </label>
            <input
              id="project-desc-input"
              type="text"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description..."
              className="px-3 py-1.5 rounded-lg text-sm bg-zinc-800 text-gray-200 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-80 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="theme-select" className="text-sm font-medium text-gray-300 whitespace-nowrap">
                {DEMO_TEXT.themeLabel}
              </label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-zinc-800 text-amber-400 border border-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="auto">{DEMO_TEXT.options.auto}</option>
                <option value="inherit">{DEMO_TEXT.options.inherit}</option>
                <option value="light">{DEMO_TEXT.options.light}</option>
                <option value="dark">{DEMO_TEXT.options.dark}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="host-bg-select" className="text-sm font-medium text-gray-300 whitespace-nowrap">
                {DEMO_TEXT.hostBgLabel}
              </label>
              <select
                id="host-bg-select"
                value={customHostBgKey}
                onChange={(e) => setCustomHostBgKey(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-zinc-800 text-blue-400 border border-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(HOST_BG_MAP).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="host-font-select" className="text-sm font-medium text-gray-300 whitespace-nowrap">
                {DEMO_TEXT.hostFontLabel}
              </label>
              <select
                id="host-font-select"
                value={customHostFontKey}
                onChange={(e) => setCustomHostFontKey(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-zinc-800 text-emerald-400 border border-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.entries(HOST_FONT_MAP).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="logo-toggle-button" className="text-sm font-medium text-gray-300 whitespace-nowrap">
                {DEMO_TEXT.bgLogoLabel}
              </label>
              <button
                id="logo-toggle-button"
                type="button"
                aria-label={DEMO_TEXT.toggleLogoAction}
                aria-pressed={showLogo}
                onClick={() => setShowLogo(!showLogo)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 border cursor-pointer active:scale-95 shadow-sm ${
                  showLogo
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-500/25"
                    : "bg-zinc-800 border-zinc-700 text-gray-400 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {showLogo ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Component Preview Container */}
      <main style={{ fontFamily: activeFont.family }} className="w-full flex-1 font-inherit">
        <SupportUsButton {...sampleProps} />
      </main>
    </div>
  );
}
