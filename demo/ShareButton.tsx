import React, { useEffect, useRef, useState } from "react";
import type SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/src/social-share-button.css";
import { savedHostTheme } from "./host";

const SHARE_TEXT = {
  trigger: "Share this page",
  loadFailed: "Sharing is unavailable.",
  reload: "Reload",
};

const SHARE_PLATFORMS = ["whatsapp", "twitter", "linkedin", "telegram", "email"];

type ShareConstructor = typeof SocialShareButton;
type ShareInstance = SocialShareButton;

const createShare = (Share: ShareConstructor, container: HTMLElement) =>
  new Share({ container, showButton: false, platforms: SHARE_PLATFORMS, theme: savedHostTheme() });

/**
 * Footer button that opens the Social Share Button modal for the current page. The modal follows
 * the host background picked in the dev preview; it only reads its theme when created, so a
 * changed background recreates it.
 */
export function ShareButton() {
  const containerRef = useRef<HTMLSpanElement>(null);
  const ctorRef = useRef<ShareConstructor | null>(null);
  const instanceRef = useRef<ShareInstance | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    let cancelled = false;
    // Loaded on the client after render: the library is a classic script that touches `window`
    import("@aossie-org/social-share-button").then(
      (module) => {
        if (cancelled || !containerRef.current) return;
        ctorRef.current = module.default;
        instanceRef.current = createShare(ctorRef.current, containerRef.current);
        setStatus("ready");
      },
      () => {
        if (!cancelled) setStatus("failed");
      },
    );
    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  const share = () => {
    if (!ctorRef.current || !containerRef.current) return;
    let instance = instanceRef.current;
    if (!instance || instance.options.theme !== savedHostTheme()) {
      instance?.destroy();
      instance = instanceRef.current = createShare(ctorRef.current, containerRef.current);
    }
    instance.updateOptions({ url: window.location.href, title: document.title });
    instance.openModal();
  };

  return (
    // One flex item, so the empty container does not add a gap in the footer
    <span className="flex items-center">
      <span ref={containerRef} />
      <button
        type="button"
        onClick={share}
        disabled={status !== "ready"}
        aria-label={SHARE_TEXT.trigger}
        title={SHARE_TEXT.trigger}
        className="text-gray-300 hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
      {status === "failed" && (
        <span role="alert" className="ml-2 text-xs text-gray-400">
          {SHARE_TEXT.loadFailed}{" "}
          <button type="button" onClick={() => window.location.reload()} className="underline hover:text-white cursor-pointer">
            {SHARE_TEXT.reload}
          </button>
        </span>
      )}
    </span>
  );
}
