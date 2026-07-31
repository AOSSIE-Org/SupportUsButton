import React, { useState, useEffect } from "react";
import SupportUsButton from "../src/index";
import type { Theme, supportUsButtonProps } from "../src/types/index";
import "../src/styles/style.css";

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

  const activeBg = HOST_BG_MAP[customHostBgKey] || HOST_BG_MAP.zinc;
  const activeFont = HOST_FONT_MAP[customHostFontKey] || HOST_FONT_MAP.sans;

  const sampleProps: supportUsButtonProps = {
    Theme: theme,
    Logo: showLogo,
    organizationInformation: {
      name: "AOSSIE",
      desc: "Australian Open Source Software Innovation and Education organization dedicated to fostering innovation and open source projects globally.",
      image: "/aossie_logomark.svg",
      link: "https://aossie.org",
    },
    projectInformation: {
      name: "SupportUsButton",
      description: "A lightweight, tier-based React component library for displaying donation and sponsorship options cleanly.",
      image: "/stability.svg",
    },
    sponsors: [
      { name: "Google Open Source", sponsorshipTier: "Platinum" },
      { name: "GitHub Sponsors", sponsorshipTier: "Platinum" },
      { name: "Stability Nexus", sponsorshipTier: "Gold" },
    ],
    ctaSection: {
      sponsorLink: [
        { name: "Sponsor Us", url: "https://github.com/sponsors/AOSSIE-Org" },
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
      className="min-h-screen transition-all duration-300"
    >
      {/* Top Controls Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-900/90 border-b border-zinc-800 p-4 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto rounded-b-xl shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/aossie_logomark.svg" alt="AOSSIE Logo" className="h-8 w-auto brightness-0 invert" />
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">SupportUsButton — Dev Preview</h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-sans">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">Theme Prop:</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-zinc-800 text-amber-400 border border-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="auto">✨ Auto (Host Adapted)</option>
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">Host BG:</span>
            <select
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
            <span className="text-sm font-medium text-gray-300">Host Font:</span>
            <select
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
            <span className="text-sm font-medium text-gray-300">BG Logo:</span>
            <button
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
      </header>

      {/* Main Component Preview Container */}
      <main className="w-full">
        <SupportUsButton {...sampleProps} />
      </main>
    </div>
  );
}
