import React from "react";
import { DEMO_LINKS, DEMO_PAGES } from "./config";
import { getAssetUrl } from "./host";
import { ShareButton } from "./ShareButton";

const FOOTER_TEXT = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  organization: "AOSSIE",
};

const LINK_STYLES = "text-sm font-medium text-gray-300 hover:text-white transition-colors";

/**
 * Footer shared by the dev preview and the legal pages. From md up it is one row of three cells
 * (empty | links | organization credit) whose side cells share the free space equally, so the
 * links stay centred on the page; below md the parts stack, each centred.
 *
 * Uses only utilities the demo already has, so the library's dist/style.css stays the same.
 */
export function DemoFooter() {
  return (
    <footer className="w-full bg-zinc-900/95 border-t border-zinc-800 px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center gap-3 font-sans">
      <span className="hidden md:flex flex-1" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-center gap-6">
        <a href={getAssetUrl(DEMO_PAGES.privacy)} className={LINK_STYLES}>
          {FOOTER_TEXT.privacy}
        </a>
        <a href={getAssetUrl(DEMO_PAGES.terms)} className={LINK_STYLES}>
          {FOOTER_TEXT.terms}
        </a>
        <ShareButton />
      </div>
      {/* The empty first item pushes the credit to the end of the cell from md up */}
      <div className="flex flex-1 items-center justify-between">
        <span aria-hidden="true" />
        <a
          href={DEMO_LINKS.organization}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 ${LINK_STYLES}`}
        >
          {/* The organization's name follows the logo, so the logo is decorative */}
          <img src={getAssetUrl("brand/icons/aossie_logo.svg")} alt="" aria-hidden="true" width={22} height={24} className="h-6 w-auto" />
          {FOOTER_TEXT.organization}
        </a>
      </div>
    </footer>
  );
}
