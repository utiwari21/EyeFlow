/**
 * EyeFlow — PDF Renderer
 *
 * Responsibility:
 * - Receives scroll signals from the scrollController
 * - Applies smooth scrolling to PDFs rendered via PDF.js or browser PDF viewer
 *
 * Design principles:
 * - Decoupled from gaze logic and page detection
 * - Handles both embedded PDF.js containers and native PDF viewer scroll
 */

import { ScrollSignal } from "../scrollController";

export interface PdfRenderer {
  applyScroll(signal: ScrollSignal): void;
}

export async function initPdfRenderer(): Promise<PdfRenderer> {
  // Try to detect PDF.js viewer container
  const pdfViewerContainer = document.querySelector(
    ".pdfViewer, #viewerContainer, embed[type='application/pdf']"
  ) as HTMLElement;

  // Fallback to document scrolling if no PDF container found
  const scrollTarget: HTMLElement | Document =
    pdfViewerContainer || document;

  // You can tune this multiplier to make scrolling faster/slower
  const SCROLL_MULTIPLIER = 1;

  return {
    applyScroll(signal: ScrollSignal) {
      const delta = signal.deltaY * SCROLL_MULTIPLIER;

      if (scrollTarget instanceof HTMLElement) {
        scrollTarget.scrollBy({ top: delta, left: 0, behavior: "auto" });
      } else {
        // fallback: scroll whole document
        window.scrollBy({ top: delta, left: 0, behavior: "auto" });
      }
    },
  };
}
