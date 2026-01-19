/**
 * EyeFlow — Main Content Script Entry Point
 *
 * Responsibilities:
 * 1. Detect whether the current page is a PDF or a normal web page
 * 2. Initialize eye tracking
 * 3. Initialize scroll controller
 * 4. Route scroll signals to the correct renderer
 *
 * This file intentionally contains NO scrolling logic
 * and NO eye-tracking math.
 */

import { detectPageType, PageType } from "../utils/pageDetector";
import { initEyeTracker } from "./eyeTracker";
import { initScrollController } from "./scrollController";
import { initWebRenderer } from "./renderers/webRenderer";
import { initPdfRenderer } from "./renderers/pdfRenderer";

// Prevent double injection
if ((window as any).__EYEFLOW_INITIALIZED__) {
  console.debug("EyeFlow already initialized on this page.");
} else {
  (window as any).__EYEFLOW_INITIALIZED__ = true;
  bootstrapEyeFlow();
}

async function bootstrapEyeFlow(): Promise<void> {
  try {
    console.debug("EyeFlow: Bootstrapping...");

    // 1. Detect page type (PDF vs Web)
    const pageType: PageType = detectPageType();
    console.debug(`EyeFlow: Detected page type -> ${pageType}`);

    // 2. Initialize eye tracking
    const eyeTracker = await initEyeTracker();

    // 3. Initialize scroll controller
    const scrollController = initScrollController();

    // 4. Initialize correct renderer
    let renderer;

    switch (pageType) {
      case PageType.PDF:
        renderer = await initPdfRenderer();
        break;

      case PageType.WEB:
      default:
        renderer = initWebRenderer();
        break;
    }

    // 5. Wire eye tracking → scroll controller → renderer
    eyeTracker.onGazeUpdate((gazeData) => {
      const scrollSignal = scrollController.computeScrollSignal(gazeData);
      renderer.applyScroll(scrollSignal);
    });

    console.debug("EyeFlow: Successfully initialized.");
  } catch (error) {
    console.error("EyeFlow failed to initialize:", error);
  }
}
