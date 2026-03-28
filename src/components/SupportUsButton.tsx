import React from "react";
import { motion } from "framer-motion";
import type { supportUsButtonProps } from "../types";

/* =========================
   Helper: Safe Logo Getter
========================= */
function getLogoSrc(logo?: string | { src?: string }) {
  if (!logo) return undefined;
  if (typeof logo === "string") return logo;
  return logo.src;
}

function SupportUsButton({
  Theme = "dark",
  pattern = "none",
  hero,
  organizationInformation,
  sponsors,
  ctaSection,
  classNames = {},
  buttonVariant = "AOSSIE",
}: supportUsButtonProps) {
  const logo = getLogoSrc(organizationInformation.logo);

  // Dynamic Theme Logic
  const isDark = Theme === "dark" || Theme === "AOSSIE";
  const bgClass = isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900";
  const cardClass = isDark 
    ? "bg-white/5 border-white/10 backdrop-blur-2xl" 
    : "bg-white border-gray-200 shadow-xl";
  const subTextClass = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${bgClass} ${classNames.container || ""}`}>
      
      {/* Background Glow (Adjusts based on Theme) */}
      <div className={`absolute inset-0 ${isDark 
        ? "bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.15),_transparent_60%)]" 
        : "bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.05),_transparent_60%)]"}`} 
      />

      {/* Pattern Overlay (Supporting the pattern prop) */}
      {pattern !== "none" && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `url('/patterns/${pattern}.svg')` }} 
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-center mb-24 ${classNames.Hero || ""}`}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg text-2xl"
          >
            ❤️
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            {hero.title}
          </h1>

          <p className={`${subTextClass} text-lg max-w-xl mx-auto`}>
            {hero.description}
          </p>
        </motion.div>

        {/* ================= ORG CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`relative border rounded-3xl p-10 mb-24 shadow-[0_0_80px_rgba(255,215,0,0.1)] ${cardClass} ${classNames.organizationInformation || ""}`}
        >
          {hero.sponsorLabel && (
            <p className="text-yellow-500 font-bold text-xs uppercase tracking-widest mb-4">
              {hero.sponsorLabel}
            </p>
          )}

          <div className="flex items-center gap-6 flex-wrap">
            {logo ? (
              <img
                src={logo}
                alt={organizationInformation.name}
                className="w-20 h-20 rounded-xl object-cover bg-white shadow-sm"
              />
            ) : (
              <div className={`w-20 h-20 rounded-xl flex items-center justify-center border-2 border-dashed ${
                isDark 
                  ? "bg-white/5 border-white/10 text-gray-500" 
                  : "bg-gray-100 border-gray-300 text-gray-400"
              }`}>
                <span className="text-[10px] uppercase font-bold tracking-tighter">No Logo</span>
              </div>
            )}


            <div>
              <h2 className="text-3xl font-bold">
                {organizationInformation.name}
              </h2>
              <p className={subTextClass}>
                {organizationInformation.description}
              </p>
            </div>
          </div>

          {organizationInformation.projectInformation && (
            <div className={`mt-8 p-6 rounded-xl border ${isDark ? "bg-black/40 border-white/10" : "bg-gray-50 border-gray-100"}`}>
              <p className="text-yellow-500 text-sm font-semibold mb-1">
                About Project
              </p>
              <h3 className="font-semibold">
                {organizationInformation.projectInformation.name}
              </h3>
              <p className={`${subTextClass} italic`}>
                "{organizationInformation.projectInformation.description}"
              </p>
            </div>
          )}
        </motion.div>

        {/* ================= SPONSORS ================= */}
        {sponsors && sponsors.length > 0 && (
          <div className={`mb-24 ${classNames.sponsors || ""}`}>
            <h2 className="text-4xl font-bold text-center mb-12">
              Our Sponsors
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {sponsors.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className={`group relative border rounded-2xl p-6 overflow-hidden transition-all ${cardClass}`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-yellow-400/10 to-transparent blur-xl"></div>

                  <div className="relative z-10 text-center">
                    {s.logo ? (
                      <img
                        src={s.logo}
                        alt={s.name}
                        className="h-20 mx-auto object-contain mb-4 filter drop-shadow-sm"
                      />
                    ) : (
                      <div className={`h-20 flex items-center justify-center rounded mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                        <span className="text-sm opacity-50">No Logo</span>
                      </div>
                    )}
                    <h3 className="font-semibold">{s.name}</h3>
                    {s.sponsorshipTier && (
                      <p className={`${subTextClass} text-sm`}>{s.sponsorshipTier}</p>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* ================= CTA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-center ${classNames.ctaSection || ""}`}
        >
          <h2 className="text-4xl font-bold mb-4">
            {ctaSection.title}
          </h2>

          <p className={`${subTextClass} mb-8`}>
            {ctaSection.description}
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {ctaSection.sponsorLink.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target={link.newTab ? "_blank" : "_self"}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className={`px-8 py-4 rounded-xl font-bold shadow-lg transition-all 
                  ${buttonVariant === "AOSSIE" 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:shadow-yellow-500/40" 
                    : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  {link.name}
                </button>
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default SupportUsButton;
