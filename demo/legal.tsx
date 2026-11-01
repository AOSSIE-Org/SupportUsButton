import React from "react";
import ReactDOM from "react-dom/client";
import "./legal.css";
import privacy from "../PRIVACY.md?raw";
import terms from "../TERMS.md?raw";
import { DEMO_PAGES } from "./config";
import { HOST_BG_MAP, HOST_FONT_MAP, HOST_STORAGE_KEYS, getAssetUrl } from "./host";
import { LegalDocument } from "./legal-markdown";
import { DemoFooter } from "./DemoFooter";

/**
 * Entry for privacy/index.html and terms/index.html. The page to render comes from the
 * root element's `data-page` attribute.
 */
const SOURCES = { privacy, terms };

const LEGAL_TEXT = {
  homeLabel: "Back to the SupportUsButton dev preview",
};

// Colors come from the host text color, so the document reads well on every host background
const DOCUMENT_STYLES = [
  "max-w-3xl mx-auto",
  "[&_h1]:text-3xl sm:[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mb-4",
  "[&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-3",
  "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2",
  "[&_p]:leading-relaxed [&_p]:mb-4 [&_p]:opacity-90",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_li]:opacity-90",
  "[&_strong]:font-semibold",
  "[&_a]:font-medium [&_a]:underline [&_a]:decoration-amber-400 [&_a]:decoration-2 [&_a]:underline-offset-2",
  "[&_code]:rounded [&_code]:bg-current/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.875em]",
].join(" ");

const links = {
  privacy: getAssetUrl(DEMO_PAGES.privacy),
  terms: getAssetUrl(DEMO_PAGES.terms),
};

function LegalPage({ source }: { source: string }) {
  // Use the host background and font picked in the dev preview, with the same defaults
  const activeBg = HOST_BG_MAP[localStorage.getItem(HOST_STORAGE_KEYS.bg) || "zinc"] || HOST_BG_MAP.zinc;
  const activeFont = HOST_FONT_MAP[localStorage.getItem(HOST_STORAGE_KEYS.font) || "sans"] || HOST_FONT_MAP.sans;

  return (
    <div
      style={{
        backgroundColor: activeBg.bg,
        color: activeBg.text,
        fontFamily: activeFont.family,
      }}
      className="min-h-screen flex flex-col w-full"
    >
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-900/95 border-b border-zinc-800 px-4 py-3 sm:px-6 flex items-center justify-center shadow-xl">
        <a href={getAssetUrl(DEMO_PAGES.home)} aria-label={LEGAL_TEXT.homeLabel} className="flex items-center gap-3">
          <img src={getAssetUrl("brand/icons/aossie_logo.svg")} alt="AOSSIE Logo" className="h-7 sm:h-8 w-auto object-contain" />
          <span className="text-zinc-500 font-bold text-sm select-none">✕</span>
          <img src={getAssetUrl("brand/icons/supportUsButton_logo.svg")} alt="SupportUsButton Logo" className="h-6 sm:h-7 w-auto object-contain" />
        </a>
      </header>

      <main className="w-full flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <LegalDocument source={source} links={links} className={DOCUMENT_STYLES} />
      </main>

      <DemoFooter />
    </div>
  );
}

const root = document.getElementById("root")!;
const page = root.dataset.page as keyof typeof SOURCES;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <LegalPage source={SOURCES[page]} />
  </React.StrictMode>
);
