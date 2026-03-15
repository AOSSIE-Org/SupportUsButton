import React from "react";
import type { supportUsButtonProps } from "../types/index";
import type { Theme } from "../types/index";
import type { ButtonVariant } from "../types/index";
import type { Tier } from "../types/index";

// Function to get the appropriate classes based on the selected theme, used for styling different sections of the component according to the chosen theme
function classAccordingToTheme(Theme: Theme): string {
  switch (Theme) {
    case "AOSSIE":
      return "bg-primary text-black";
    case "light":
      return "bg-gray-100 text-gray-800";
    case "dark":
      return "bg-black text-white";
    case "minimal":
      return "bg-transparent text-gray-800 border border-gray-800";
    case "corporate":
      return "bg-blue-600 text-white";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

// Function to get the appropriate button classes based on the selected button variant, used for styling the call-to-action buttons according to the chosen variant
function getButtonClasses(buttonVariant: ButtonVariant): string {
  const base =
    "w-full px-5 py-3 font-medium transition-all duration-300 flex items-center justify-center gap-2";

  const variant = buttonVariant ?? "AOSSIE";

  if (variant === "primary") {
    return `${base} bg-white text-black hover:bg-white/90`;
  }

  if (variant === "secondary") {
    return `${base} border border-white/30 text-white hover:bg-white/20`;
  }

  if (variant === "ghost") {
    return `${base} text-white/80 hover:text-white hover:bg-white/10 outline-2 outline-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/20`;
  }

  if (variant === "gradient") {
    return `${base} bg-gradient-to-r from-indigo-500 to-purple-600 text-white`;
  }

  // Default to AOSSIE variant
  return `${base} bg-primary hover:bg-primary/90 text-black font-black py-4 transition-all active:scale-[0.98] shadow-lg shadow-primary/20`;
}

// Main component function that renders the support us button, taking in various props for customization and rendering different sections such as hero, organization information, sponsors, and call-to-action based on the provided data and selected theme and button variant
function SupportUsButton({
  Theme = "AOSSIE",
  pattern = "AOSSIE",
  hero = {
    title: "Support Our Open Source Project",
    description:
      "Your support helps us continue to develop and maintain our project.",
    sponsorLabel: "You're Sponsoring",
  },
  organizationInformation,
  sponsors,
  ctaSection,
  classNames = {
    container: "",
    Hero: "",
    organizationInformation: "",
    sponsors: "",
    ctaSection: "",
  },
  buttonVariant = "AOSSIE",
}: supportUsButtonProps): React.JSX.Element {
  const sortedSponsors = sponsors ? [...sponsors].sort((a, b) => {
    const tierPriority: Record<Tier, number> = {
      Platinum: 1,
      Gold: 2,
      Silver: 3,
      Bronze: 4,
    };
    const aTier = a.sponsorshipTier || 'Bronze';
    const bTier = b.sponsorshipTier || 'Bronze';
    return tierPriority[aTier] - tierPriority[bTier];
  }) : [];

  return (
    // Container for the support us button, with dynamic classes based on the selected theme and custom class names
    <div
      className={`w-full font-sans justify-center items-center text-center ${Theme == "light" || Theme == "dark" ? classAccordingToTheme(Theme) : "bg-black text-white"} ${classNames.container}`}
    >
      {/* Hero section with optional background image*/}
      <div className="relative w-full h-[50vh] flex justify-center">
        {hero.Image && (
          <img
            src={hero.Image.src}
            alt={hero.Image.alt}
            title={hero.Image.alt}
            className="w-full h-full object-cover object-center pointer-none:cursor-none select-none"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/95"></div>
      </div>

      {/* Hero title and description */}
      <div className="w-full flex justify-center mt-10 mb-5">
        <div
          className={`${classNames.Hero} w-[80%] flex text-center p-8 flex-col items-center gap-4`}
        >
          <div
            className={`p-2 rounded-full flex items-center justify-center bg-primary text-black`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              fill="black"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart-icon lucide-heart"
            >
              <title>Support heart icon</title>
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
          </div>

          <div className="w-full flex flex-col items-center gap-6">
            <h1 className={`font-extrabold text-4xl md:text-5xl lg:text-6xl`}>
              {hero.title}
            </h1>
            <p
              className={`wrap-anywhere ${Theme === "light" ? "text-slate-600" : "text-slate-400"} text-lg font-semibold`}
            >
              {hero.description}
            </p>
          </div>
        </div>
      </div>

      {/* Organization information section */}
      <div className="w-full flex justify-center p-10 mb-50">
        <div
          className={`${classNames.organizationInformation}
          relative w-[90%] p-15 rounded-2xl overflow-visible

          // Shadows for different themes
          ${Theme === "AOSSIE" && "shadow-xl shadow-primary/20"}
          ${Theme === "light" && "shadow-xl shadow-gray-300/30"}
          ${Theme === "dark" && "shadow-xl shadow-gray-700/30"}
          ${Theme === "minimal" && "shadow-xl shadow-gray-800/30"}
          ${Theme === "corporate" && "shadow-xl shadow-blue-600/30"}
          
          // Outline for light and dark themes
          ${Theme === "light" && "outline-1 outline-gray-300"}
          ${Theme === "dark" && "outline-1 outline-gray-700"}
          ${classAccordingToTheme(Theme)}`}
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.15)_1.5px,transparent_0)] bg-size-[20px_20px] pointer-events-none opacity-100"></div>
          <div
            className={`absolute top-0 left-0 bottom-0 w-1/2 h-full  rounded-2xl p-6 overflow-visible ${classAccordingToTheme(Theme)}`}
          ></div>

          {/* Content container */}
          <div className="relative z-10 flex justify-start flex-col text-start gap-4">
            {/* Sponsor label  */}
            {hero.sponsorLabel && (
              <span className="text-[10px] font-extrabold tracking-[0.2em] uppercase block">
                {hero.sponsorLabel}
              </span>
            )}

            {/* Organization logo */}
            <div>
              {typeof organizationInformation.logo === "string" ? (
                <span
                  className="block h-fit w-fit p-4 bg-black text-white rounded-2xl"
                  title={organizationInformation.logo}
                >
                  <b className="text-2xl italic">
                    {organizationInformation.logo}
                  </b>
                </span>
              ) : (
                <img
                  className="w-24 h-24 bg-white/80 pointer-none:cursor-none select-none rounded-2xl object-cover object-center"
                  src={organizationInformation.logo?.src}
                  alt={organizationInformation.logo?.alt}
                  title={organizationInformation.logo?.alt}
                  draggable={false}
                />
              )}
            </div>

            {/* Organization name and description */}
            <div className="flex flex-col gap-4">
              <h2 className={`font-extrabold text-4xl md:text-5xl lg:text-6xl`}>
                {organizationInformation.name}
              </h2>
              <p className="font-[650]">
                {organizationInformation.description}
              </p>
            </div>

            {/* Line */}
            <div
              className={`
            border
            ${Theme === "AOSSIE" && "border-[#f1c514]/50"}
            ${Theme === "light" && "border-gray-300/50"}
            ${Theme === "dark" && "border-gray-700/50"}
            ${Theme === "minimal" && "border-gray-800/50"}
            ${Theme === "corporate" && "border-blue-600/50"}`}
            ></div>

            {/* Project information */}
            <div className="flex flex-col gap-2">
              <h3
                className={`font-bold w-fit uppercase text-sm p-2 rounded-lg
                  ${Theme === "AOSSIE" && "bg-[#edc214]"}
                  ${Theme === "light" && "bg-gray-300/50"}
                  ${Theme === "dark" && "bg-gray-700/50"}
                  ${Theme === "minimal" && "bg-gray-800/50"}
                  ${Theme === "corporate" && "bg-blue-600/50"}`}
              >
                ABOUT PROJECT: {organizationInformation.projectInformation.name}
              </h3>
              <p
                className={`italic font-semibold 
                ${Theme === "AOSSIE" && "text-[#614f08]"}
                ${Theme === "light" && "text-gray-600"}
                ${Theme === "dark" && "text-gray-400"}
                ${Theme === "minimal" && "text-gray-800"}
                ${Theme === "corporate" && "text-blue-600/80"}
                `}
              >
                "{organizationInformation.projectInformation.description}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors section */}
      <div
        className={`w-full flex justify-center mt-10 p-10
          ${Theme === "AOSSIE" && "bg-[#1f1f1f]"} 
          ${Theme === "light" && "bg-gray-300/50"} 
          ${Theme === "dark" && "bg-gray-700/50"}
          ${Theme === "minimal" && "bg-gray-800/50"}
          ${Theme === "corporate" && "bg-blue-600/50"}`}
      >
        {sortedSponsors && sortedSponsors.length > 0 && (
          // List of sponsors with their logos and links, styled according to the selected theme and custom class names
          <div
            className={`${classNames.sponsors} ${classAccordingToTheme(Theme)}
            relative w-[90%] flex flex-col p-8 rounded-2xl gap-25 mt-15 overflow-hidden`}
          >
            {/* Sponsor pattern AOSSIE */}
            {pattern === "AOSSIE" && (
              <div className="absolute bottom-0 inset-x-0 h-1/2 sponsor-pattern-AOSSIE opacity-60"></div>
            )}
            {/* Sponsor pattern Grid */}
            {pattern === "grid" && (
              <div className="absolute bottom-0 inset-x-0 h-1/2 sponsor-pattern-grid opacity-60"></div>
            )}
            {/* Sponsor pattern Dots */}
            {pattern === "dots" && (
              <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[radial-gradient(rgba(0,0,0,0.15)_1.5px,transparent_0)] bg-size-[20px_20px] pointer-events-none opacity-100"></div>
            )}

            {/* Section title */}
            <div className="mt-5 flex justify-center">
              <div className="w-fit flex flex-col gap-5 justify-center items-center">
                <h2
                  className={`font-extrabold text-4xl md:text-5xl lg:text-6xl`}
                >
                  Our Sponsors
                </h2>

                {/* Underline */}
                <div className={`border-3 rounded-4xl w-1/2`}></div>
              </div>
            </div>

            {/* Sponsor logos */}
            <div className="flex flex-row flex-wrap justify-center items-center gap-10 z-10">
              {sortedSponsors.map((sponsor, index) => (
                <a
                  href={sponsor.link}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${sponsor.name}'s website`}
                >
                  <div
                    className={`${Theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-lg flex flex-col justify-center items-center gap-2 p-8 w-fit transition-transform hover:scale-[1.02] shadow-lg min-h-75 min-w-62.5 hover:border-2 

                    // Shadows for different themes
                    ${Theme === "AOSSIE" && "shadow-primary/20"}
                    ${Theme === "light" && "shadow-gray-300/30"}
                    ${Theme === "dark" && "shadow-gray-700/30"}
                    ${Theme === "minimal" && "shadow-gray-800/30"} 
                    ${Theme === "corporate" && "shadow-blue-600/30"}
                    
                    // Size based on sponsorship tier
                    ${sponsor.sponsorshipTier === "Platinum" && "min-w-80 min-h-90"}
                    ${sponsor.sponsorshipTier === "Gold" && "min-w-70 min-h-80"}
                    ${sponsor.sponsorshipTier === "Silver" && "min-w-60 min-h-70"}
                    ${sponsor.sponsorshipTier === "Bronze" && "min-w-50 min-h-60"}
                    `}
                  >
                    {sponsor.logo ? (
                      <div className="relative">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          title={sponsor.name}
                          className={`w-50 h-40 object-cover object-center rounded-lg
                          ${sponsor.sponsorshipTier === "Platinum" && "w-60 h-50"}
                          ${sponsor.sponsorshipTier === "Gold" && "w-55 h-45"}
                          ${sponsor.sponsorshipTier === "Silver" && "w-50 h-40"}
                          ${sponsor.sponsorshipTier === "Bronze" && "w-45 h-35"}
                          `}
                          draggable={false}
                        />
                        {/* Sponsor tier icon */}
                        <div
                          className={`absolute  rotate-12
                          
                          ${sponsor.sponsorshipTier === "Platinum" && "rotate-12 -top-4 -right-1"}
                          ${sponsor.sponsorshipTier === "Gold" && "rotate-20 -top-4.5 -right-2.5"}
                          ${sponsor.sponsorshipTier === "Silver" && "rotate-30 -top-5.5 -right-4.5"}
                          ${sponsor.sponsorshipTier === "Bronze" && "rotate-40 -top-3 -right-3"}
                          `}
                        >
                          {/* Platinum tier icon */}
                          {sponsor.sponsorshipTier === "Platinum" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>Platinum tier icon</title>
                              <path d="M3 7l4 4 5-7 5 7 4-4v11H3V7z" />
                            </svg>
                          )}
                          {/* Gold tier icon */}
                          {sponsor.sponsorshipTier === "Gold" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>Gold tier icon</title>
                              <path d="M6 2h12v3h3v3a5 5 0 0 1-5 5h-1a5 5 0 0 1-4 3.9V20h4v2H9v-2h4v-3.1A5 5 0 0 1 9 13H8a5 5 0 0 1-5-5V5h3V2z" />
                            </svg>
                          )}
                          {/* Silver tier icon */}
                          {sponsor.sponsorshipTier === "Silver" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>Silver tier icon</title>
                              <path d="M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2l-3 6 3-2 3 2-3-6z" />
                            </svg>
                          )}
                          {/* Bronze tier icon */}
                          {sponsor.sponsorshipTier === "Bronze" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <title>Bronze tier icon</title>
                              <path d="M2 12l5-5 4 4 4-4 7 7-5 5-4-4-4 4-7-7z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span
                        className="block h-fit w-full p-5 bg-black text-white rounded-2xl"
                        title={sponsor.name}
                      >
                        <b className="text-3xl italic">{sponsor.name}</b>
                      </span>
                    )}

                    <div className="w-full">
                      <h3 className={`font-bold text-2xl`}>{sponsor.name}</h3>
                      {sponsor.sponsorshipTier && (
                        <span className="flex text-[16px] p-2 rounded-xl items-center mt-3.5 font-semibold bg-[#d0f2eb] text-black w-fit">
                          {sponsor.sponsorshipTier}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call-to-action section with title, description, and sponsor links */}
      <div
        className={`w-full flex justify-center p-10 ${(Theme === "light" || Theme === "dark") && classAccordingToTheme(Theme)} ${classNames.ctaSection}`}
      >
        <div className="w-4/5 flex flex-col items-center gap-5 py-20 border border-primary rounded-sm mt-20 mb-20">
          <h2 className={`font-extrabold text-4xl md:text-5xl lg:text-6xl`}>
            {ctaSection.title}
          </h2>
          <p
            className={`font-semibold 
              ${Theme === "light" ? "text-gray-600" : "text-gray-400"}`}
          >
            {ctaSection.description}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-5 mt-8">
            {ctaSection.sponsorLink.map((link, index) => (
              <a
                href={link.url}
                key={index}
                {...(link.newTab && { target: "_blank" })}
                rel="noopener noreferrer"
                title={`Support Us using ${link.name}`}
              >
                <div
                  className={`${getButtonClasses(buttonVariant)} w-fit px-6 py-3`}
                >
                  {link.icon && <span>{link.icon}</span>}
                  <h3 className={`font-bold`}>{link.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportUsButton;
