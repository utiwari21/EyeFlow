/**
 * EyeFlow — Shared Types
 *
 * Centralized type definitions for the entire extension.
 * Keeps all modules decoupled, strongly typed, and easy to maintain.
 */

/* ------------------- Page Types ------------------- */
export enum PageType {
  WEB = "WEB",
  PDF = "PDF",
}

/* ------------------- Gaze & Eye Tracking ------------------- */
export interface GazeData {
  x: number;            // Normalized: 0 (left) -> 1 (right)
  y: number;            // Normalized: 0 (top) -> 1 (bottom)
  confidence: number;   // 0 -> 1, higher means more reliable
}

/* ------------------- Scroll Signals ------------------- */
export interface ScrollSignal {
  deltaY: number;       // Positive -> scroll down, Negative -> scroll up
}

/* ------------------- Renderer Interface ------------------- */
export interface Renderer {
  /**
   * Applies a scroll delta received from the scroll controller.
   * Abstracted so we can support web pages, PDFs, or other viewers.
   */
  applyScroll(signal: ScrollSignal): void;
}
