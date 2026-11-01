// @vitest-environment jsdom
import React, { useRef } from "react";
import { act, render, renderHook, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useParentStyles } from "../hooks/useParentStyles";

type Styles = Partial<Pick<CSSStyleDeclaration, "backgroundColor" | "fontFamily" | "color">>;

const TRANSPARENT: Styles = { backgroundColor: "rgba(0, 0, 0, 0)", fontFamily: "", color: "" };

let frames: FrameRequestCallback[];
let styles: Map<Element, Styles>;
let throwFor: Set<Element>;

beforeEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  frames = [];
  styles = new Map();
  throwFor = new Set();
  // Queue animation frames so tests decide when the scheduled re-detection runs
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((cb: FrameRequestCallback) => {
      frames.push(cb);
      return frames.length;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element) => {
    if (throwFor.has(el)) throw new Error("cross-origin or detached element");
    return { ...TRANSPARENT, ...styles.get(el) } as CSSStyleDeclaration;
  });
});

function flushFrames() {
  act(() => {
    const pending = frames;
    frames = [];
    for (const cb of pending) cb(0);
  });
}

function Probe({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const s = useParentStyles(ref, enabled);
  return <div ref={ref} data-testid="probe" data-bg={s.backgroundColor} data-font={s.fontFamily} data-color={s.color} />;
}

/** Mounts the probe inside outer > host, both attached to the document body. */
function mount(enabled = true) {
  const outer = document.body.appendChild(document.createElement("section"));
  const host = outer.appendChild(document.createElement("div"));
  const result = render(<Probe enabled={enabled} />, { container: host });
  return { ...result, outer, host };
}

const detected = () => {
  const probe = screen.getByTestId("probe");
  return { bg: probe.dataset.bg, font: probe.dataset.font, color: probe.dataset.color };
};

function prepare(host: Styles, outer: Styles = {}) {
  // Styles are keyed by element, so create the elements first and render into them
  const outerEl = document.body.appendChild(document.createElement("section"));
  const hostEl = outerEl.appendChild(document.createElement("div"));
  styles.set(hostEl, host);
  styles.set(outerEl, outer);
  const result = render(<Probe />, { container: hostEl });
  return { ...result, outer: outerEl, host: hostEl };
}

describe("useParentStyles detection", () => {
  it("returns the nearest non-transparent background and stops walking there", () => {
    prepare({ backgroundColor: "rgb(10, 10, 10)" }, { backgroundColor: "rgb(255, 255, 255)", fontFamily: "Arial" });
    // The walk stopped at the host, so the outer element's font was never read
    expect(detected()).toEqual({ bg: "rgb(10, 10, 10)", font: "inherit", color: "inherit" });
  });

  it("collects font and text color from the transparent ancestors it passes", () => {
    prepare(
      { fontFamily: "Georgia, serif", color: "rgb(1, 2, 3)" },
      { backgroundColor: "rgb(255, 255, 255)", fontFamily: "Arial", color: "rgb(9, 9, 9)" },
    );
    expect(detected()).toEqual({ bg: "rgb(255, 255, 255)", font: "Georgia, serif", color: "rgb(1, 2, 3)" });
  });

  it.each(["transparent", "rgba(0,0,0,0)", "RGBA(0, 0, 0, 0)", ""])("treats %j as transparent", (value) => {
    prepare({ backgroundColor: value, color: value === "" ? "" : "transparent" }, { backgroundColor: "rgb(200, 0, 0)" });
    expect(detected()).toMatchObject({ bg: "rgb(200, 0, 0)", color: "inherit" });
  });

  it("uses the body background when an ancestor cannot be read", () => {
    const { host } = mount();
    throwFor.add(host);
    styles.set(document.body, { backgroundColor: "rgb(240, 240, 240)" });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    flushFrames();
    expect(detected().bg).toBe("rgb(240, 240, 240)");
  });

  it("falls back to the <html> background when the body is transparent", () => {
    styles.set(document.documentElement, { backgroundColor: "rgb(1, 1, 1)" });
    mount();
    expect(detected().bg).toBe("rgb(1, 1, 1)");
  });

  it("falls back to the defaults when nothing can be read", () => {
    vi.mocked(window.getComputedStyle).mockImplementation(() => {
      throw new Error("blocked");
    });
    mount();
    expect(detected()).toEqual({ bg: "#191919", font: "inherit", color: "inherit" });
  });

  it("returns the given fallbacks without a mounted element", () => {
    const { result } = renderHook(() => useParentStyles({ current: null }, true, "#ffffff", "serif"));
    expect(result.current).toEqual({ backgroundColor: "#ffffff", fontFamily: "serif", color: "inherit" });
    expect(window.getComputedStyle).not.toHaveBeenCalled();
  });

  it("does nothing while disabled", () => {
    const outer = document.body.appendChild(document.createElement("section"));
    const host = outer.appendChild(document.createElement("div"));
    styles.set(host, { backgroundColor: "rgb(255, 255, 255)" });
    render(<Probe enabled={false} />, { container: host });
    window.dispatchEvent(new Event("resize"));
    expect(detected().bg).toBe("#191919");
    expect(frames).toHaveLength(0);
  });
});

describe("useParentStyles re-detection", () => {
  it("re-detects when the host toggles its class (e.g. a theme switch)", async () => {
    const { host } = prepare({ backgroundColor: "rgb(255, 255, 255)" });
    expect(detected().bg).toBe("rgb(255, 255, 255)");

    styles.set(host, { backgroundColor: "rgb(0, 0, 0)" });
    await act(async () => {
      host.className = "dark";
    });
    expect(frames).toHaveLength(1);
    flushFrames();
    expect(detected().bg).toBe("rgb(0, 0, 0)");
  });

  it("coalesces several mutations into one animation frame", async () => {
    const { host, outer } = prepare({ backgroundColor: "rgb(255, 255, 255)" });
    await act(async () => {
      host.style.padding = "1px";
    });
    await act(async () => {
      outer.className = "theme-dark";
    });
    expect(frames).toHaveLength(1);
  });

  it("re-detects when a stylesheet is injected", async () => {
    prepare({ backgroundColor: "rgb(255, 255, 255)" });
    await act(async () => {
      document.head.appendChild(document.createElement("style"));
    });
    expect(frames).toHaveLength(1);
  });

  it("ignores href changes on ordinary links but not on stylesheet links", async () => {
    prepare({ backgroundColor: "rgb(255, 255, 255)" });
    const anchor = document.body.appendChild(document.createElement("a"));
    const sheet = document.head.appendChild(document.createElement("link"));
    await act(async () => {}); // deliver the childList mutations of the appends above
    flushFrames();

    await act(async () => {
      anchor.setAttribute("href", "/elsewhere");
    });
    expect(frames).toHaveLength(0);

    await act(async () => {
      sheet.setAttribute("href", "/dark.css");
    });
    expect(frames).toHaveLength(1);
  });

  it("re-detects when a stylesheet <link> finishes loading, but not on other loads", () => {
    prepare({ backgroundColor: "rgb(255, 255, 255)" });
    const img = document.createElement("img");
    const sheet = document.createElement("link");
    document.body.append(img, sheet);
    frames = [];

    img.dispatchEvent(new Event("load"));
    expect(frames).toHaveLength(0);
    sheet.dispatchEvent(new Event("load"));
    expect(frames).toHaveLength(1);
  });

  it("re-detects on window resize and keeps unchanged values", () => {
    const { host } = prepare({ backgroundColor: "rgb(255, 255, 255)", fontFamily: "Inter" });
    window.dispatchEvent(new Event("resize"));
    expect(frames).toHaveLength(1);
    flushFrames();
    expect(detected()).toEqual({ bg: "rgb(255, 255, 255)", font: "Inter", color: "inherit" });

    styles.set(host, { backgroundColor: "rgb(255, 255, 255)", fontFamily: "Roboto" });
    window.dispatchEvent(new Event("resize"));
    flushFrames();
    expect(detected().font).toBe("Roboto");
  });

  it("cancels a pending frame and stops listening on unmount", () => {
    const { unmount } = prepare({ backgroundColor: "rgb(255, 255, 255)" });
    window.dispatchEvent(new Event("resize"));
    expect(frames).toHaveLength(1);
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);

    frames = [];
    window.dispatchEvent(new Event("resize"));
    document.head.appendChild(document.createElement("link")).dispatchEvent(new Event("load"));
    expect(frames).toHaveLength(0);
  });

  it("unmounts cleanly without a pending frame", () => {
    const { unmount } = prepare({ backgroundColor: "rgb(255, 255, 255)" });
    unmount();
    expect(cancelAnimationFrame).not.toHaveBeenCalled();
  });
});
