import { useState, useEffect, useLayoutEffect, RefObject } from "react";

export interface ParentStyles {
  backgroundColor?: string;
  fontFamily?: string;
  color?: string;
}

function isNonTransparent(colorStr?: string): boolean {
  if (!colorStr) return false;
  const normalized = colorStr.replace(/\s+/g, "").toLowerCase();
  return (
    normalized !== "" &&
    normalized !== "transparent" &&
    normalized !== "rgba(0,0,0,0)"
  );
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Custom hook to detect nearest non-transparent parent background color and font-family
 * from the host/parent DOM tree synchronously on layout, providing reliable fallbacks.
 */
export function useParentStyles(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean = true,
  fallbackBg: string = "#191919",
  fallbackFont: string = "inherit"
): ParentStyles {
  const [styles, setStyles] = useState<ParentStyles>({
    backgroundColor: fallbackBg,
    fontFamily: fallbackFont,
    color: "inherit",
  });

  useIsomorphicLayoutEffect(() => {
    if (!enabled || typeof window === "undefined" || !containerRef.current) {
      return;
    }

    const element = containerRef.current;

    const detectStyles = () => {
      let parent: HTMLElement | null = element.parentElement;
      let detectedBg: string | undefined = undefined;
      let detectedFont: string | undefined = undefined;
      let detectedColor: string | undefined = undefined;

      while (parent && parent !== document.documentElement) {
        try {
          const computed = window.getComputedStyle(parent);

          if (!detectedFont && computed.fontFamily && computed.fontFamily !== "") {
            detectedFont = computed.fontFamily;
          }

          if (!detectedColor && computed.color && isNonTransparent(computed.color)) {
            detectedColor = computed.color;
          }

          if (!detectedBg && isNonTransparent(computed.backgroundColor)) {
            detectedBg = computed.backgroundColor;
            break; // Stop at nearest non-transparent parent node
          }
        } catch {
          break;
        }

        parent = parent.parentElement;
      }

      // Fallback to body / html background if parent chain was fully transparent
      if (!detectedBg && typeof document !== "undefined") {
        try {
          const bodyBg = window.getComputedStyle(document.body).backgroundColor;
          if (isNonTransparent(bodyBg)) {
            detectedBg = bodyBg;
          } else {
            const htmlBg = window.getComputedStyle(document.documentElement).backgroundColor;
            if (isNonTransparent(htmlBg)) {
              detectedBg = htmlBg;
            }
          }
        } catch {
          // Fallback default
        }
      }

      const nextBg = detectedBg || fallbackBg;
      const nextFont = detectedFont || fallbackFont;
      const nextColor = detectedColor || "inherit";

      setStyles((prev) => {
        if (
          prev.backgroundColor === nextBg &&
          prev.fontFamily === nextFont &&
          prev.color === nextColor
        ) {
          return prev;
        }
        return {
          backgroundColor: nextBg,
          fontFamily: nextFont,
          color: nextColor,
        };
      });
    };

    // Synchronous layout detection
    detectStyles();

    window.addEventListener("resize", detectStyles);

    // Observe parent element & body for dynamic class/style mutations (e.g. host theme toggles)
    const observer = new MutationObserver(() => {
      detectStyles();
    });

    if (element.parentElement) {
      observer.observe(element.parentElement, {
        attributes: true,
        attributeFilter: ["class", "style"],
        childList: true,
        subtree: true,
      });
    }
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: true,
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: true,
    });

    return () => {
      window.removeEventListener("resize", detectStyles);
      observer.disconnect();
    };
  });

  return styles;
}
