import React, { useState } from "react";
import SupportUsButton from "../src/index";
import type { Theme, supportUsButtonProps } from "../src/types/index";
import "../src/styles/style.css";

export function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [showLogo, setShowLogo] = useState<boolean>(true);

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
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-gray-100 text-zinc-900"}`}>
      {/* Top Controls Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b border-zinc-800 p-4 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/aossie_logomark.svg" alt="AOSSIE Logo" className={`h-8 w-auto ${theme === "dark" ? "brightness-0 invert" : "brightness-0"}`} />
          <h1 className="text-xl font-bold tracking-tight">SupportUsButton — Dev Preview</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Theme:</span>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 cursor-pointer active:scale-95 shadow-sm hover:shadow-amber-500/25"
            >
              {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">BG Logo:</span>
            <button
              onClick={() => setShowLogo(!showLogo)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border cursor-pointer active:scale-95 shadow-sm ${
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
