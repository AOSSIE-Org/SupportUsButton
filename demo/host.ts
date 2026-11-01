/**
 * Host page styles the dev preview can simulate, shared by the demo (demo/App.tsx) and the
 * legal pages (demo/legal.tsx) so both look the same.
 */
export const HOST_BG_MAP: Record<string, { bg: string; text: string; label: string }> = {
  zinc: { bg: "#09090b", text: "#ffffff", label: "Dark Zinc (#09090b)" },
  slate: { bg: "#0f172a", text: "#ffffff", label: "Slate Dark (#0f172a)" },
  amber: { bg: "#451a03", text: "#fef3c7", label: "Amber Dark (#451a03)" },
  ocean: { bg: "#082f49", text: "#e0f2fe", label: "Deep Ocean (#082f49)" },
  purple: { bg: "#3b0764", text: "#f3e8ff", label: "Royal Purple (#3b0764)" },
  light: { bg: "#f3f4f6", text: "#111827", label: "Light Gray (#f3f4f6)" },
};

export const HOST_FONT_MAP: Record<string, { family: string; label: string }> = {
  sans: { family: "ui-sans-serif, system-ui, -apple-system, sans-serif", label: "Sans-Serif" },
  serif: { family: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif", label: "Serif (Georgia)" },
  mono: { family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", label: "Monospace (SFMono)" },
};

/** localStorage keys for the chosen host background and font. */
export const HOST_STORAGE_KEYS = {
  bg: "demo_host_bg_key",
  font: "demo_host_font_key",
} as const;

/** Resolves a path in `public/` or a demo page against Vite's base URL. */
export const getAssetUrl = (path: string) => {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

/** Relative luminance below which a host background counts as dark (the same cut-off the component uses). */
const DARK_LUMINANCE_THRESHOLD = 0.179;

const channelLuminance = (channel: number) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/** "dark" or "light" for a `#rrggbb` host background, by its WCAG relative luminance. */
export const themeForBackground = (hex: string): "dark" | "light" => {
  const [r, g, b] = [1, 3, 5].map((start) => channelLuminance(parseInt(hex.slice(start, start + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < DARK_LUMINANCE_THRESHOLD ? "dark" : "light";
};

/** Theme of the host background saved by the dev preview (dark zinc when nothing is saved). */
export const savedHostTheme = () =>
  themeForBackground((HOST_BG_MAP[localStorage.getItem(HOST_STORAGE_KEYS.bg) || "zinc"] || HOST_BG_MAP.zinc).bg);
