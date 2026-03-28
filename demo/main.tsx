import React from "react";
import ReactDOM from "react-dom/client";
import SupportUsButton from "../src";
import "../src/styles/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-black">
      
      {/* 2. Optional: A more subtle, modern header for the demo */}
      <header className="absolute top-0 left-0 z-50 p-6">
        <h1 className="text-sm font-mono tracking-widest text-white/30 uppercase">
          Project: SupportUsButton / Demo
        </h1>
      </header>

      <SupportUsButton
        Theme="AOSSIE"
        pattern="AOSSIE"
        hero={{
          title: "Support Our Open Source Project",
          description: "Your support helps us grow 🚀",
          sponsorLabel: "YOU'RE SUPPORTING",
        }}
        organizationInformation={{
          name: "AOSSIE",
          description: "Open Source Organization",
          url: "https://aossie.org",
          logo: {
            src: "https://avatars.githubusercontent.com/u/67830633?s=200&v=4",
            alt: "AOSSIE Logo",
          },
          projectInformation: {
            name: "SupportUsButton",
            description: "Reusable donation component",
          },
        }}
        sponsors={[
          {
            name: "GitHub",
            link: "https://github.com",
            logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            sponsorshipTier: "Gold",
          },
        ]}
        ctaSection={{
          title: "Become a Sponsor",
          description: "Support us via these platforms",
          sponsorLink: [
            {
              name: "GitHub Sponsors",
              url: "https://github.com/sponsors",
              newTab: true,
            },
          ],
        }}
      />
    </div>
  </React.StrictMode>
);