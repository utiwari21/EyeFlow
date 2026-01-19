/**
 * EyeFlow — Eye Tracker Module
 *
 * Uses MediaPipe Face Mesh (WASM) to extract eye landmarks
 * and emit normalized gaze data in real time.
 */

import { FaceMesh, Results } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

/**
 * Normalized gaze data emitted to downstream systems.
 * All values are in screen-relative coordinates.
 */
export interface GazeData {
  x: number;            // 0.0 (left) → 1.0 (right)
  y: number;            // 0.0 (top) → 1.0 (bottom)
  confidence: number;   // 0.0 → 1.0
}

type GazeCallback = (gaze: GazeData) => void;

export interface EyeTracker {
  onGazeUpdate(callback: GazeCallback): void;
}

export async function initEyeTracker(): Promise<EyeTracker> {
  const video = document.createElement("video");
  video.style.display = "none";
  document.body.appendChild(video);

  const callbacks: GazeCallback[] = [];

  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults((results: Results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];

    /**
     * Eye landmark indices (MediaPipe standard)
     * Left eye: 33, 133
     * Right eye: 362, 263
     */
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    // Average eye position
    const gazeX = (leftEye.x + rightEye.x) / 2;
    const gazeY = (leftEye.y + rightEye.y) / 2;

    const gazeData: GazeData = {
      x: clamp(gazeX, 0, 1),
      y: clamp(gazeY, 0, 1),
      confidence: results.multiFaceLandmarks.length > 0 ? 1.0 : 0.0,
    };

    callbacks.forEach((cb) => cb(gazeData));
  });

  const camera = new Camera(video, {
    onFrame: async () => {
      await faceMesh.send({ image: video });
    },
    width: 640,
    height: 480,
  });

  await camera.start();

  return {
    onGazeUpdate(callback: GazeCallback) {
      callbacks.push(callback);
    },
  };
}

/* ------------------ Utilities ------------------ */

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
