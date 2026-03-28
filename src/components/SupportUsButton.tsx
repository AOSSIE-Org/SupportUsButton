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
  hero,
  organizationInformation,
  sponsors,
  ctaSection,
}: supportUsButtonProps) {
  const logo = getLogoSrc(organizationInformation.logo);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* 🔥 Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.15),_transparent_60%)]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg"
          >
            ❤️
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            {hero.title}
          </h1>

          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {hero.description}
          </p>
        </motion.div>

        {/* ================= ORG CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 mb-24 shadow-[0_0_80px_rgba(255,215,0,0.15)]"
        >
          {hero.sponsorLabel && (
            <p className="text-yellow-400 text-xs uppercase tracking-widest mb-4">
              {hero.sponsorLabel}
            </p>
          )}

          <div className="flex items-center gap-6 flex-wrap">
            {/* Logo */}
            {logo ? (
              <img
                src={logo}
                alt={organizationInformation.name}
                className="w-20 h-20 rounded-xl object-cover bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gray-700 flex items-center justify-center">
                <span className="text-xs">No Logo</span>
              </div>
            )}

            {/* Org Info */}
            <div>
              <h2 className="text-3xl font-bold">
                {organizationInformation.name}
              </h2>
              <p className="text-gray-400">
                {organizationInformation.description}
              </p>
            </div>
          </div>

          {/* PROJECT */}
          {organizationInformation.projectInformation && (
            <div className="mt-8 p-6 bg-black/40 rounded-xl border border-white/10">
              <p className="text-yellow-400 text-sm mb-1">
                About Project
              </p>
              <h3 className="font-semibold">
                {organizationInformation.projectInformation.name}
              </h3>
              <p className="text-gray-400 italic">
                "{organizationInformation.projectInformation.description}"
              </p>
            </div>
          )}
        </motion.div>

        {/* ================= SPONSORS ================= */}
        {sponsors && sponsors.length > 0 && (
          <div className="mb-24">
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
                  className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden"
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-yellow-400/20 to-transparent blur-xl"></div>

                  <div className="relative z-10 text-center">
                    {s.logo ? (
                      <img
                        src={s.logo}
                        alt={s.name}
                        className="h-24 mx-auto object-contain mb-4"
                      />
                    ) : (
                      <div className="h-24 flex items-center justify-center bg-gray-700 rounded">
                        <span>No Logo</span>
                      </div>
                    )}

                    <h3 className="font-semibold">{s.name}</h3>

                    {s.sponsorshipTier && (
                      <p className="text-gray-400 text-sm">
                        {s.sponsorshipTier}
                      </p>
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
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            {ctaSection.title}
          </h2>

          <p className="text-gray-400 mb-8">
            {ctaSection.description}
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {ctaSection.sponsorLink.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target={link.newTab ? "_blank" : "_self"}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
              >
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg hover:shadow-yellow-500/30 transition">
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