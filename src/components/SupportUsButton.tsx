import React, { useRef } from "react";
import type { supportUsButtonProps } from "../types/index";
import type { Theme } from "../types/index";
import { useParentStyles } from "../hooks/useParentStyles";

function sRgbLuminance(c: number): number {
  const norm = c / 255;
  return norm <= 0.04045 ? norm / 12.92 : Math.pow((norm + 0.055) / 1.055, 2.4);
}

function isDarkColor(colorStr?: string): boolean {
  if (!colorStr) return true;
  let r = 0, g = 0, b = 0;
  const rgbMatch = colorStr.match(/\d+/g);
  if (rgbMatch && rgbMatch.length >= 3) {
    r = parseInt(rgbMatch[0], 10);
    g = parseInt(rgbMatch[1], 10);
    b = parseInt(rgbMatch[2], 10);
  } else if (colorStr.startsWith("#")) {
    const hex = colorStr.replace("#", "");
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return true;
    }
  } else {
    return true;
  }
  // WCAG relative luminance formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
  const lum = 0.2126 * sRgbLuminance(r) + 0.7152 * sRgbLuminance(g) + 0.0722 * sRgbLuminance(b);
  return lum < 0.179;
}

// Function to get the appropriate classes based on the selected theme
function classAccordingToTheme(Theme: Theme): string {
  switch (Theme) {
    case "light":
      return "bg-[#F4F4F4] text-[#191919]";
    case "dark":
      return "bg-[#191919] text-[#F4F4F4]";
    case "inherit":
    case "auto":
    default:
      return "bg-transparent text-inherit";
  }
}

// Helper function to validate URLs and prevent XSS through 'javascript:' protocol
function validateUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.startsWith("http://") || lowerUrl.startsWith("https://")) {
    return url;
  }
  return undefined;
}

// Main component function that renders the support us button, taking in various props for customization and rendering different sections such as hero, organization information, sponsors, and call-to-action based on the provided data and selected theme and button variant
function SupportUsButton({
  Theme = "auto",
  organizationInformation,
  sponsors,
  ctaSection,
  projectInformation,
  Logo = true,
  className = "",
  border = {
    TopX1: "-1000",
    TopX2: "1000",
    BottomX1: "-1000",
    BottomX2: "1000",
    LeftY1: "-1000",
    LeftY2: "1000",
    RightY1: "-1000",
    RightY2: "1000",
  },
}: supportUsButtonProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAuto = Theme === "auto" || Theme === "inherit";
  const parentStyles = useParentStyles(containerRef, isAuto);
  const darkThemeActive =
    Theme === "dark" || (isAuto && isDarkColor(parentStyles.backgroundColor));

  const validatedUrl = validateUrl(organizationInformation?.link);

  return (
    <div
      ref={containerRef}
      style={
        isAuto
          ? {
              fontFamily: parentStyles.fontFamily || "inherit",
              color: parentStyles.color !== "inherit" ? parentStyles.color : "inherit",
            }
          : undefined
      }
      className={`relative w-full h-full px-6 sm:px-10 md:px-16 py-6 sm:py-10 text-center ${isAuto ? "bg-transparent font-inherit text-inherit" : "font-sans"} ${classAccordingToTheme(Theme)} ${className}`}
    >
      {Logo && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <svg
            viewBox="0 -74 1440 1172"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <path
              d="M1436.43 653.604C1436.43 733.153 1410.91 792.793 1378.25 847.98C1370.61 860.889 1361.02 863.843 1351.83 875.574C1330.57 902.761 1339.26 931.96 1310.06 953.774C1284.56 972.826 1279.05 1006.01 1278.03 1040.49C1277.53 1056.53 1242.68 1037.56 1232.96 1047.49C1227.39 1053.17 1207.75 1045.25 1200 1049.59C1183.05 1059.1 1168.68 1081.32 1148.85 1091.06C1133.01 1098.85 1121.87 1055.69 1102.03 1058.43C1068.28 1063.1 1030.1 1048.29 989.059 1051.45C969.875 1052.93 963.173 1011.94 943.56 1014.7C916.09 1018.57 944.417 915.006 919.258 934.7C891.445 956.471 903.799 887.433 876.607 887.433C864.895 887.433 893.008 822.913 881.253 822.806C876.2 822.763 811.474 894.84 808.605 890.666C799.59 877.586 791.754 846.739 775.76 833.274C764.519 823.79 758.845 809.126 747.069 800.97C727.82 787.634 712.575 795.918 692.127 785.729C679.773 779.585 667.418 770.529 654.935 771.129C636.008 772.028 623.825 776.224 596.932 778.386C553.039 781.939 522.72 809.298 479.063 808.591C442.621 807.992 412.238 883.73 376.952 878.742C338.347 873.283 307.708 887.926 280.323 887.562C256.749 887.262 236.536 950.841 215.189 941.122C184.7 927.229 137.83 946.281 112.796 912.373C101.05 896.446 139.693 898.908 130.15 878.464C124.401 866.155 131.261 852.411 130.724 836.57C130.313 824.411 122.896 810.304 118.17 799.001C113.316 787.398 102.018 777.765 96.7461 763.936C92.5152 752.847 94.6713 737.82 88.3143 726.324C79.0881 709.627 62.9954 693.314 53.8806 677.259C49.1936 668.996 50.8295 659.834 45.9198 652.277C31.6406 630.313 8.03675 620.488 0.549201 601.928C-5.73289 586.365 43.9072 613.787 46.0611 602.292C47.6049 594.071 32.8418 583.903 24.4485 567.997C13.9955 548.196 9.21651 522.443 9.21651 514.373C9.21651 493.951 4.22553 456.445 11.1071 441.054C17.9545 425.748 28.7822 435.081 41.5691 424.699C60.8992 409.007 79.5185 389.013 107.46 375.313C117.123 370.582 131.503 371.438 142.177 367.157C183.565 350.523 226.687 330.957 266.298 310.492C284.99 300.816 290.279 267.464 308.115 256.482C315.93 251.666 293.855 228.503 301.584 223.451C312.911 216.066 304.346 200.182 315.63 192.283C324.537 186.053 348.282 224.329 357.039 217.65C362.692 213.326 348.389 175.671 353.935 171.047C361.108 165.053 386.501 187.123 393.674 180.937C399.263 176.099 376.631 141.312 382.155 136.282C411.296 109.63 450.307 87.6877 482.981 62.8984C492.53 55.6414 525.354 109.844 535.053 102.908C550.641 91.7336 575.307 124.572 589.802 110.144C601.792 98.1986 565.008 93.1893 576.227 77.1983C591.13 56.0267 603.505 26.5278 628.642 4.64979C645.6 -10.1211 672.429 8.80275 692.726 -0.637757C699.193 -3.63474 701.612 -13.8031 692.491 -21.2741C683.819 -28.3599 663.586 -32.7055 668.617 -38.0573C675.662 -45.5711 716.407 -23.9072 740.238 -25.213C752.186 -25.8767 765.289 -16.0936 768.608 -16.0936C779.742 -16.0936 794.131 -4.34118 805.136 -4.02007C812.908 -3.806 816.077 -15.1089 823.764 -14.745C840.786 -13.9315 847.873 -8.38712 864.531 -6.803C880.375 -5.32591 873.138 15.2035 862.647 26.8061C857.251 32.7787 826.44 43.2467 835.497 54.9349C844.726 66.8158 803.787 96.2291 818.004 105.027C873.652 139.45 923.091 203.393 989.102 220.518C1042.61 234.412 1046.83 116.544 1052.63 63.2623C1056.29 29.6104 1090.7 -73.9997 1098.58 -51.9504C1106.8 -28.9165 1115.49 4.77821 1136.84 49.7544C1140.52 57.5252 1136.63 86.125 1141.64 94.4951C1146.75 103.058 1157.03 95.33 1166.79 98.9478C1175.92 102.352 1184.44 117.037 1191.44 125.749C1202.57 139.578 1188.14 187.123 1200.9 201.916C1218.37 222.188 1209.57 285.425 1229.79 305.269C1237.84 313.168 1247.84 299.211 1256.4 306.553C1268.65 317.043 1294 333.912 1302.11 348.126C1308.02 358.508 1296.25 366.686 1305.63 373.75C1321.3 385.524 1325.8 432.919 1341.68 443.194C1348.19 447.39 1343.16 429.644 1359.69 441.396C1371.85 450.045 1367.03 475.412 1375.32 486.48C1387.85 503.177 1416.34 536.486 1426.47 551.557C1449.19 585.38 1436.43 635.901 1436.43 653.604Z"
              stroke="currentColor"
              strokeOpacity="0.04"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      )}

      <div className="relative z-10 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto h-full flex flex-col justify-between">
        {/* Border around page - wrapped around content */}
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* <!-- Top --> */}
          <line
            x1={border.TopX1}
            y1="0"
            x2={border.TopX2}
            y2="0"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            opacity={0.2}
          />

          {/* <!-- Bottom --> */}
          <line
            x1={border.BottomX1}
            y1="100"
            x2={border.BottomX2}
            y2="100"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            opacity={0.2}
          />

          {/* <!-- Left --> */}
          <line
            x1="0"
            y1={border.LeftY1}
            x2="0"
            y2={border.LeftY2}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            opacity={0.2}
          />

          {/* <!-- Right --> */}
          <line
            x1="100"
            y1={border.RightY1}
            x2="100"
            y2={border.RightY2}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            opacity={0.2}
          />
        </svg>

        {/* Top left icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <path
            d="M8 3V13M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Top right icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <path
            d="M8 3V13M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom left Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 pointer-events-none"
        >
          <path
            d="M8 3V13M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Bottom Right Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none"
        >
          <path
            d="M8 3V13M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex flex-col gap-4 sm:gap-6 animate-sub-fade-in">
          <div className="flex justify-center items-center gap-2.5 sm:gap-4 flex-wrap max-w-full">
            <span className="flex-none flex items-center">
              <svg
                width="66"
                height="59"
                viewBox="0 0 66 59"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 sm:w-10 md:w-12 h-auto flex-none"
              >
                <path
                  d="M17.0981 41.3553L34.5981 58.8553C34.4314 57.6886 34.0981 54.9553 34.0981 53.3553C34.0981 51.7553 35.7647 49.6886 36.5981 48.8553L58.5981 26.8553C62.5981 22.8553 69.5981 14.3553 61.5981 5.3553C53.5157 -3.73731 44.5981 0.855304 41.5981 3.8553C36.2647 9.02197 24.1981 20.6553 18.5981 25.8553C12.9981 31.0553 15.2647 38.3553 17.0981 41.3553Z"
                  fill="currentColor"
                />
                <path
                  d="M6.59808 30.8553L11.0981 35.3553V32.3553C11.0981 27.9553 13.7647 24.522 15.0981 23.3553L31.0981 7.85529L27.0981 4.35529C20.6981 -0.844714 13.4314 0.521952 10.5981 1.85529C8.26475 2.35529 2.99808 5.35529 0.598079 13.3553C-1.80192 21.3553 3.59808 28.3553 6.59808 30.8553Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <h1 className="min-w-0 font-medium text-3xl sm:text-3xl md:text-5xl leading-tight tracking-tight text-center">
              Support-us {projectInformation?.name && "for"}{" "}
              {projectInformation?.name}
            </h1>
          </div>
          {projectInformation?.name && (
            <div>
              <span className="text-lg sm:text-base md:text-xl leading-snug flex flex-wrap justify-center items-center gap-1">
                <p className="italic">
                  A Project Powered by
                </p>
                {validatedUrl ? (
                  <a
                    href={validatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#ffcd00] transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    &nbsp;{organizationInformation.name}
                    <svg
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-[0.85em] w-auto inline-block align-baseline flex-none ml-1 self-center"
                    >
                      <path
                        d="M6.81037 4V6.46393L15.7932 6.46463L0 22.2564L1.74143 24L17.5357 8.20571V17.1893H20V4H6.81037Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                ) : (
                  <span>&nbsp;{organizationInformation.name}</span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 animate-sub-fade-in" style={{ animationDelay: "150ms" }}>
          {ctaSection.sponsorLink.map((link, index) => (
            <button
              key={link.url || link.name || index}
              type="button"
              className={`px-6 py-2.5 w-fit rounded-lg font-semibold text-[18px] cursor-pointer transition-all duration-200 ease-in-out transform active:scale-95 shadow-md hover:-translate-y-1 hover:shadow-xl ${
                darkThemeActive
                  ? "bg-[#F4F4F4] text-[#191919] hover:bg-[#ffcd00] hover:text-[#191919] hover:shadow-amber-500/20"
                  : "bg-[#191919] text-[#F4F4F4] hover:bg-[#ffcd00] hover:text-[#191919] hover:shadow-black/20"
              }`}
              onClick={() => {
                if (validateUrl(link.url)) {
                  window.open(link.url, "_blank", "noopener,noreferrer");
                }
              }}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div
          className={`mt-20 sm:mt-24 flex flex-col gap-10 lg:gap-8 animate-sub-fade-in ${projectInformation?.name && "lg:flex-row lg:items-start"}`}
          style={{ animationDelay: "250ms" }}
        >
          {projectInformation?.name && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-start gap-2.5 sm:gap-3 text-left w-full">
                <img
                  className={`h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 flex-none object-contain ${darkThemeActive ? "brightness-0 invert" : "brightness-0"}`}
                  style={{ filter: darkThemeActive ? "brightness(0) invert(1)" : "brightness(0)" }}
                  draggable="false"
                  src={projectInformation?.image}
                  alt={projectInformation?.name}
                />
                <h2 className="font-medium text-xl sm:text-2xl lg:text-3xl leading-snug text-left break-words">
                  About {projectInformation?.name}
                </h2>
              </div>
              <p className="relative mt-4 sm:mt-6 p-5 sm:p-6 text-start text-base sm:text-lg leading-relaxed max-w-full">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="99%"
                    height="99%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="8 8"
                    vectorEffect="non-scaling-stroke"
                    opacity={0.12}
                  />
                </svg>
                {projectInformation?.description}
              </p>
            </div>
          )}

          <div className="flex shrink-0 items-center justify-center px-4 py-2 lg:py-0 lg:self-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="62"
              height="62"
              viewBox="0 0 62 62"
              fill="none"
              className="w-[clamp(1.5rem,3.5vw,2.75rem)] h-[clamp(1.5rem,3.5vw,2.75rem)] flex-none"
            >
              <path
                d="M35.431 0C39.6228 8.98514 51.2756 26.334 61.8182 26.334V35.4842H61.7276C47.2295 35.4842 35.431 47.2982 35.431 61.8182H26.29V61.8117C26.29 48.5541 33.5892 36.9699 44.3778 30.8816C40.0924 28.447 34.1734 20.7486 31.2286 16.7965C32.3689 14.2417 32.9599 13.6397 33.9892 10.0793M35.431 0C35.431 9.48036 31.7474 18.3846 25.0503 25.0911C22.7914 27.358 20.2371 29.3101 17.4566 30.8945C21.7293 33.3253 27.4488 41.3542 30.3815 45.2706C28.7626 48.7871 27.3396 58.2747 26.29 61.8182C22.2439 53.2247 11.1964 35.9179 1.20736 35.4648C0.803828 35.4777 0.401375 35.4842 0 35.4842V26.2822C0.405691 26.2822 0.808144 26.2887 1.20736 26.3016C7.76299 26.0151 13.9707 23.272 18.596 18.6176C21.0456 16.1771 22.9869 13.275 24.3076 10.0793C25.6283 6.88363 26.3021 3.45778 26.29 0H35.431Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-start gap-2.5 sm:gap-3 text-left w-full">
              <img
                className={`h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 flex-none object-contain ${darkThemeActive ? "brightness-0 invert" : "brightness-0"}`}
                style={{ filter: darkThemeActive ? "brightness(0) invert(1)" : "brightness(0)" }}
                draggable="false"
                src={organizationInformation.image}
                alt={organizationInformation.name}
              />
              <h2 className="font-medium text-xl sm:text-2xl lg:text-3xl leading-snug text-left break-words">
                About {organizationInformation.name}
              </h2>
            </div>
            <p className="relative mt-4 sm:mt-6 p-5 sm:p-6 text-start text-base sm:text-lg leading-relaxed max-w-full">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="99%"
                  height="99%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="8 8"
                  vectorEffect="non-scaling-stroke"
                  opacity={0.12}
                />
              </svg>
              {organizationInformation.desc}
            </p>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 flex flex-col xl:flex-row items-center justify-between gap-4 sm:gap-6 text-center w-full max-w-full">
          <div className="flex flex-col items-center text-center text-base sm:text-lg font-normal whitespace-nowrap flex-none">
            <span className="flex items-center justify-center gap-1.5 whitespace-nowrap">
              <span>Supported By Global</span>
              <svg
                width="11"
                height="11"
                viewBox="0 0 62 62"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-none"
              >
                <path
                  d="M35.431 0C39.6228 8.98514 51.2756 26.334 61.8182 26.334V35.4842H61.7276C47.2295 35.4842 35.431 47.2982 35.431 61.8182H26.29V61.8117C26.29 48.5541 33.5892 36.9699 44.3778 30.8816C40.0924 28.447 34.1734 20.7486 31.2286 16.7965C32.3689 14.2417 32.9599 13.6397 33.9892 10.0793M35.431 0C35.431 9.48036 31.7474 18.3846 25.0503 25.0911C22.7914 27.358 20.2371 29.3101 17.4566 30.8945C21.7293 33.3253 27.4488 41.3542 30.3815 45.2706C28.7626 48.7871 27.3396 58.2747 26.29 61.8182C22.2439 53.2247 11.1964 35.9179 1.20736 35.4648C0.803828 35.4777 0.401375 35.4842 0 35.4842V26.2822C0.405691 26.2822 0.808144 26.2887 1.20736 26.3016C7.76299 26.0151 13.9707 23.272 18.596 18.6176C21.0456 16.1771 22.9869 13.275 24.3076 10.0793C25.6283 6.88363 26.3021 3.45778 26.29 0H35.431Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="whitespace-nowrap text-center">Powerhouses</span>
          </div>

          <div className="flex flex-wrap items-center justify-center xl:justify-end gap-x-5 sm:gap-x-8 gap-y-3 select-none flex-1 max-w-full m-0 p-0">
            {sponsors?.map((sponsor, index) => (
              <div
                key={index}
                style={{ animationDelay: `${(index + 1) * 120}ms` }}
                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 w-max flex-none p-0 m-0 border-none bg-transparent shadow-none transition-all duration-300 hover:text-[#ffcd00] hover:-translate-y-1 hover:scale-105 cursor-pointer active:scale-95 animate-sub-scale-in"
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="50"
                    height="80"
                    className="w-[32px] sm:w-[40px] md:w-[46px] h-auto flex-none object-contain"
                    viewBox="-80 1 200 200"
                    fill="currentColor"
                  >
                    <path
                      d="M0 0 C12.6432034 -1.11557677 21.77726589 1.06283405 31.875 9.36328125 C34.10698073 11.49412535 36.17644711 13.51070558 38 16 C38 16.99 38 17.98 38 19 C29.45592079 21.8480264 21.05934703 19.28079614 13 16 C6.96020996 12.72319577 2.91668528 8.22600127 0 2 C0 1.34 0 0.68 0 0 Z "
                      transform="translate(46,162)"
                    />
                    <path
                      d="M0 0 C4.44523401 2.76249558 4.44523401 2.76249558 6.1640625 4.5390625 C6.1640625 5.8590625 6.1640625 7.1790625 6.1640625 8.5390625 C-2.52586208 12.4012512 -10.29939559 12.66928212 -19.3671875 9.65625 C-23.70175851 7.69471945 -27.56681244 5.00180317 -30.8359375 1.5390625 C-31.58203125 -0.68359375 -31.58203125 -0.68359375 -31.8359375 -2.4609375 C-20.51269999 -7.31375357 -10.92790494 -5.62952679 0 0 Z "
                      transform="translate(98.8359375,194.4609375)"
                    />
                    <path
                      d="M0 0 C8.61092129 -0.62624882 14.6615228 1.83377296 21.3125 7.3125 C24.81078785 10.5659077 27.06609443 13.62769175 29 18 C28.67 18.99 28.34 19.98 28 21 C19.99208811 21.51663948 13.26103526 20.48272809 6.8828125 15.26953125 C2.44590688 10.65772686 0.71645797 6.31652744 0 0 Z "
                      transform="translate(38,135)"
                    />
                    <path
                      d="M0 0 C4.07359577 1.50873917 7.06907981 4.13049723 9 8 C9.98110431 14.11373333 9.69827384 19.84883286 6 25 C3.8125 26.375 3.8125 26.375 2 27 C-2.60927966 22.6398706 -5.65818101 19.60636978 -6.5 13.1875 C-6.33480196 8.07607842 -3.5803541 3.5803541 0 0 Z "
                      transform="translate(109,170)"
                    />
                    <path
                      d="M0 0 C5.84588663 -0.7462834 9.15679591 0.64857943 13.91015625 4.09375 C17.77888309 7.62260738 20.56558062 11.87903971 21.296875 17.1328125 C21.3125 19.0625 21.3125 19.0625 21 22 C15.39069564 22.88567964 11.85345065 20.63347312 7.27734375 17.72265625 C3.3471517 14.74973225 1.56292988 11.68878964 0 7 C-0.03954234 4.66700175 -0.04401732 2.33291811 0 0 Z "
                      transform="translate(36,106)"
                    />
                    <path
                      d="M0 0 C2.75589294 1.51129613 3.53748982 3.27025747 4.9375 6.0625 C5.77373465 11.65999862 5.70557442 16.55283649 3.125 21.625 C-0.4625 25.6225 -0.4625 25.6225 -2.0625 27.0625 C-5.0625 26.0625 -5.0625 26.0625 -6.23046875 24.0234375 C-8.24898663 18.90367185 -9.82990072 14.65356241 -9.0625 9.0625 C-7.29669689 5.26602332 -4.60308989 0.13948757 0 0 Z "
                      transform="translate(94.0625,150.9375)"
                    />
                    <path
                      d="M0 0 C0.66 0 1.32 0 2 0 C6.01498181 6.7348082 7.9727014 12.04153403 7 20 C5.91357046 23.14068277 4.55409315 26.06526159 3 29 C1.171875 28.78125 1.171875 28.78125 -1 28 C-4.71131395 23.07762571 -6.84448346 17.35402275 -6.50390625 11.1796875 C-5.52461489 6.94368301 -3.07182894 3.07182894 0 0 Z "
                      transform="translate(59,45)"
                    />
                    <path
                      d="M0 0 C5.9949638 1.53359539 9.03400275 4.30028129 12.6328125 9.2421875 C14.32059335 12.64668258 14.30199566 15.03414318 14.1875 18.8125 C14.16042969 19.97394531 14.13335937 21.13539062 14.10546875 22.33203125 C14.07066406 23.21246094 14.03585938 24.09289062 14 25 C9.06173402 24.28677039 6.51298115 23.69313403 3 20 C-0.47172832 14.52535149 -2.94700644 9.62904508 -2 3 C-1.34 2.01 -0.68 1.02 0 0 Z "
                      transform="translate(43,74)"
                    />
                    <path
                      d="M0 0 C0.98616863 7.23190328 -2.00769698 13.06617698 -6 19 C-9.41373076 22.09871606 -12.3425366 24 -17 24 C-17.55551858 17.2843976 -17.53534257 12.24025403 -13.49609375 6.65625 C-9.78738257 2.55052274 -5.55761213 0 0 0 Z "
                      transform="translate(90,33)"
                    />
                    <path
                      d="M0 0 C0.34573147 5.76219112 0.34446833 10.04096075 -3 15 C-5.86920766 17.94675381 -7.17709988 18.93789433 -11.3125 19.25 C-12.199375 19.1675 -13.08625 19.085 -14 19 C-14.35892545 13.95510345 -14.58426255 10.14765859 -12.25 5.5625 C-8.21537063 0.96750544 -6.2602375 -0.42683438 0 0 Z "
                      transform="translate(75,108)"
                    />
                    <path
                      d="M0 0 C2.13286654 4.26573309 2.59025281 8.3056456 2 13 C0.30557682 17.6373687 -1.79507786 20.37192366 -6 23 C-6.99 22.67 -7.98 22.34 -9 22 C-10.84443627 18.31112746 -10.35116537 14.03520939 -10 10 C-8.35436241 6.10243728 -4.60387335 0 0 0 Z "
                      transform="translate(81,131)"
                    />
                    <path
                      d="M0 0 C1.21236328 0.02707031 1.21236328 0.02707031 2.44921875 0.0546875 C3.37154297 0.08949219 3.37154297 0.08949219 4.3125 0.125 C4.06832562 4.27596454 3.74705006 6.57870849 1.125 9.875 C-3.75206981 13.77665585 -7.3764011 15.57579278 -13.6875 15.125 C-13.31698535 8.94975589 -11.87368232 6.41085333 -7.6875 2.125 C-4.48369983 -0.01086678 -3.66810033 -0.10632175 0 0 Z "
                      transform="translate(75.6875,85.875)"
                    />
                    <path
                      d="M0 0 C0.33770059 3.63028129 0.28595853 5.52706859 -1.625 8.6875 C-5.53445212 12.49407181 -8.9340779 14.16827413 -14.375 14.1875 C-15.57125 14.125625 -16.7675 14.06375 -18 14 C-18 10.61334013 -17.54459576 8.58888157 -15.22265625 6.078125 C-9.82751454 1.35615648 -7.31463272 -0.13545616 0 0 Z "
                      transform="translate(85,64)"
                    />
                  </svg>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-base sm:text-lg md:text-xl font-medium whitespace-nowrap">{sponsor.name}</span>
                  {sponsor.sponsorshipTier && (
                    <span className="text-[9px]">
                      {sponsor.sponsorshipTier} Sponsor
                    </span>
                  )}
                </div>

                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="40"
                    height="70"
                    className="w-[26px] sm:w-[32px] md:w-[38px] h-auto flex-none object-contain"
                    viewBox="50 10 220 220"
                    fill="currentColor"
                  >
                    <path
                      d="M0 0 C0.495 0.99 0.495 0.99 1 2 C-8.27979511 13.01808526 -18.28258176 20.02761097 -32.9609375 21.359375 C-42.72243141 21.79854242 -50.12919823 20.31969477 -59 16 C-58.3150299 10.94694187 -54.93373871 8.98600852 -51.0859375 6.03125 C-35.42211852 -4.27911186 -17.48399628 -7.42731005 0 0 Z "
                      transform="translate(130,258)"
                    />
                    <path
                      d="M0 0 C0.83595703 0.00451172 1.67191406 0.00902344 2.53320312 0.01367188 C4.58466649 0.02539452 6.63609273 0.04332797 8.6875 0.0625 C9.80419922 3.77099609 9.80419922 3.77099609 8.75390625 6.39453125 C2.93157793 15.99759224 -3.90797378 21.80145981 -14.3125 26.0625 C-14.94567139 26.32579102 -15.57884277 26.58908203 -16.23120117 26.86035156 C-22.46454345 29.2223428 -28.13347424 29.45393542 -34.75 29.3125 C-35.74193359 29.30734375 -36.73386719 29.3021875 -37.75585938 29.296875 C-45.00180749 29.21784625 -45.00180749 29.21784625 -47.3125 28.0625 C-44.37587024 17.62114974 -34.04136476 11.39116744 -25.3125 6.0625 C-16.62562746 1.46806113 -9.73098389 -0.09984435 0 0 Z "
                      transform="translate(151.3125,212.9375)"
                    />
                    <path
                      d="M0 0 C-2.39200266 11.19892153 -5.71902895 18.07289842 -15 25 C-21.78751165 29.08234396 -27.34097459 30.15332803 -35.25 30.0625 C-35.99507812 30.05798828 -36.74015625 30.05347656 -37.5078125 30.04882812 C-39.3385764 30.03709246 -41.16929873 30.0191585 -43 30 C-41.93899234 19.8411565 -35.46515359 13.58856359 -28 7 C-21.03088753 1.57645683 -8.72807907 -4.36403953 0 0 Z "
                      transform="translate(174,173)"
                    />
                    <path
                      d="M0 0 C0.69921314 8.17302468 -0.17446968 14.23303539 -5 21 C-12.19995412 28.92542478 -19.41741111 33.21440676 -30.09375 33.921875 C-31.03734375 33.96054688 -31.03734375 33.96054688 -32 34 C-33.0807115 25.04553327 -29.71235463 18.36305411 -25 11 C-17.97828186 2.74948119 -10.68382231 -0.57234762 0 0 Z "
                      transform="translate(177,128)"
                    />
                    <path
                      d="M0 0 C4.78349587 1.77166514 7.72559065 5.50681028 9.984375 9.92578125 C12.680491 16.47530833 12.81791177 22.3656932 10.11328125 28.94140625 C7.47899167 33.8125312 4.01261019 37.97228416 -0.9375 40.5 C-1.9584375 40.7475 -1.9584375 40.7475 -3 41 C-9.61879384 33.48677456 -11.63326707 27.86018855 -11.4140625 17.70703125 C-10.65313164 10.89454645 -7.83438354 6.35086094 -2.6875 1.9375 C-1.800625 1.298125 -0.91375 0.65875 0 0 Z "
                      transform="translate(64,225)"
                    />
                    <path
                      d="M0 0 C6.10141011 2.09191204 10.09618266 5.19236532 13 11 C15.80342132 20.47635376 13.46384342 28.42439095 9 37 C8.0357608 38.3594192 7.0475145 39.70366241 6 41 C1.16027157 39.86124037 -0.91833723 37.1041353 -3.640625 33.203125 C-7.56679405 26.84002343 -9.22543059 20.47625085 -8 13 C-6.15343506 8.01215217 -3.96143255 3.61291943 0 0 Z "
                      transform="translate(89,196)"
                    />
                    <path
                      d="M0 0 C2.20337359 6.61012077 1.95835844 13.83850451 -0.9375 20.1875 C-4.95999087 27.21269533 -10.23865428 33.42580239 -18.0625 36.0625 C-19.36778562 36.40388239 -20.67847235 36.72819644 -22 37 C-23.51663393 33.96673215 -23.17097474 31.121154 -23.1875 27.75 C-23.20167969 26.44546875 -23.21585938 25.1409375 -23.23046875 23.796875 C-22.77104705 16.22809719 -19.6567656 9.3068017 -14 4.19140625 C-9.16039993 0.48163928 -6.18899405 -1.50543099 0 0 Z "
                      transform="translate(168,82)"
                    />
                    <path
                      d="M0 0 C3.36487781 1.40872325 5.05709457 2.99655472 7.1875 5.9375 C7.95126953 6.97197266 7.95126953 6.97197266 8.73046875 8.02734375 C12.03453143 13.16134883 11.5114388 19.1289628 11 25 C9.46846971 31.14199195 7.17909698 37.1877065 3 42 C0.37109375 42.6484375 0.37109375 42.6484375 -2 43 C-2.81498562 41.3970947 -3.62689927 39.79262722 -4.4375 38.1875 C-4.88996094 37.29417969 -5.34242188 36.40085938 -5.80859375 35.48046875 C-9.1967553 28.42642749 -9.11910839 19.50542602 -7.24609375 11.96484375 C-5.48880628 7.39589632 -3.36938515 3.61005552 0 0 Z "
                      transform="translate(140,37)"
                    />
                    <path
                      d="M0 0 C8.02703093 0 13.2246328 3.59439717 19 9 C23.03291832 14.34046606 26.13013911 19.63449868 26.1875 26.4375 C26.20167969 27.19933594 26.21585938 27.96117188 26.23046875 28.74609375 C25.97612666 31.23347315 25.24017196 32.84808106 24 35 C18.71862571 34.48474397 15.42778844 32.74522883 11 30 C11 29.34 11 28.68 11 28 C10.34 28 9.68 28 9 28 C2.43301719 19.07329357 -0.60928531 11.01226784 0 0 Z "
                      transform="translate(96,19)"
                    />
                    <path
                      d="M0 0 C5.15951335 -0.64493917 8.02686386 0.76605281 12.171875 3.57421875 C16.19660231 6.71316206 18.44512334 10.19462688 20 15 C20.1953125 18.55078125 20.1953125 18.55078125 20.125 22.3125 C20.10695312 23.56675781 20.08890625 24.82101563 20.0703125 26.11328125 C20.04710937 27.06589844 20.02390625 28.01851562 20 29 C15.29408896 30.2396854 13.16146642 29.64669432 8.99609375 27.37109375 C4.35942686 24.18622079 0.28963484 19.5454298 -1 14 C-1.29090954 9.18819892 -1.34470105 4.65804444 0 0 Z "
                      transform="translate(119,131)"
                    />
                    <path
                      d="M0 0 C3.77630587 2.0598032 6.42425404 4.26441302 9.25 7.5 C10.27867188 8.66015625 10.27867188 8.66015625 11.328125 9.84375 C15.32641356 15.00042123 14.44725766 21.79057285 14 28 C13.26058015 30.65245375 12.34969985 32.58178776 11 35 C4.0414707 32.54404848 0.79149208 29.27410622 -2.8125 22.6875 C-5.55491186 14.17158948 -3.71417116 7.94235708 0 0 Z "
                      transform="translate(110,166)"
                    />
                    <path
                      d="M0 0 C6.91908866 -0.51042457 12.28398134 -0.19174702 18 4 C22.78542816 8.48159146 26.81417669 13.6551804 27.1875 20.375 C27.0946875 21.674375 27.0946875 21.674375 27 23 C18.36045376 23.63734358 12.90249595 22.28164433 6.25 16.6875 C1.7839266 11.35302344 -0.59086791 7.23813184 0 0 Z "
                      transform="translate(111,98)"
                    />
                    <path
                      d="M0 0 C7.98102976 -0.4200542 13.84869167 1.62697029 20.2890625 6.40625 C23.51973843 9.41564676 25.99490405 13.07794419 28 17 C28 17.99 28 18.98 28 20 C23.22937006 22.38531497 17.18820708 21.27659155 12.25 19.8125 C6.98137676 17.84823977 4.16912877 14.85448011 1.1875 10.125 C-0.16784249 6.55830924 -0.22708206 3.78470104 0 0 Z "
                      transform="translate(103,65)"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportUsButton;
