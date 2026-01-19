/**
 * EyeFlow — Scroll Controller
 *
 * Responsibility:
 * - Converts normalized gaze coordinates (0–1) into scroll signals.
 * - Provides smooth, adaptive scrolling logic.
 *
 * Design principles:
 * - Pure function for scroll calculation
 * - Modular, can swap out velocity function
 * - No page-specific code
 */

import { GazeData } from "./eyeTracker";

export interface ScrollSignal {
  deltaY: number; // positive -> scroll down, negative -> scroll up
}

export interface ScrollController {
  computeScrollSignal(gaze: GazeData): ScrollSignal;
}

export function initScrollController(): ScrollController {
  // Tunable constants
  const SCROLL_ZONE = 0.15;       // top/bottom fraction of screen triggering scroll
  const MAX_SCROLL = 30;           // pixels per frame (adjustable)
  const SMOOTHING = 0.2;           // simple exponential smoothing

  let lastDeltaY = 0;

  function computeScrollSignal(gaze: GazeData): ScrollSignal {
    const { x, y } = gaze;

    let targetDeltaY = 0;

    if (y < SCROLL_ZONE) {
      // Looked near top → scroll up
      targetDeltaY = -MAX_SCROLL * (1 - y / SCROLL_ZONE);
    } else if (y > 1 - SCROLL_ZONE) {
      // Looked near bottom → scroll down
      targetDeltaY = MAX_SCROLL * ((y - (1 - SCROLL_ZONE)) / SCROLL_ZONE);
    } else {
      targetDeltaY = 0;
    }

    // Simple smoothing for natural movement
    const deltaY = lastDeltaY + (targetDeltaY - lastDeltaY) * SMOOTHING;
    lastDeltaY = deltaY;

    return { deltaY };
  }

  return {
    computeScrollSignal,
  };
}
