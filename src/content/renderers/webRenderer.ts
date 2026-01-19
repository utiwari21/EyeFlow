/**
 * EyeFlow — Web Renderer
 *
 * Responsibility:
 * - Receives scroll signals from the scrollController
 * - Applies smooth scrolling to a normal web page (non-PDF)
 *
 * Design principles:
 * - Minimal, decoupled from gaze and page detection
 * - Works with any scrollable page
 * - Smooth scrolling for natural UX
 */

import { ScrollSignal } from "../scrollController";

export interface WebRenderer {
  applyScroll(signal: ScrollSignal): void;
}

export function initWebRenderer(): WebRenderer {
  // You can tune this multiplier to make scroll faster or slower
  const SCROLL_MULTIPLIER = 1;

  return {
    applyScroll(signal: ScrollSignal) {
      const delta = signal.deltaY * SCROLL_MULTIPLIER;

      // Scroll the document smoothly
      window.scrollBy({
        top: delta,
        left: 0,
        behavior: "auto", // We let smoothing be handled by scrollController
      });
    },
  };
}
