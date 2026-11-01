import { afterEach, vi } from "vitest";

// Shared test setup (vitest.config.ts `setupFiles`). Runs for both Node and jsdom test files.
afterEach(async () => {
  // Vitest runs without globals, so React Testing Library cannot register its own cleanup
  if (typeof document !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
