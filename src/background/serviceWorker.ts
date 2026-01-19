/**
 * EyeFlow — Service Worker (Background Script)
 *
 * Responsibilities:
 * - Handles extension lifecycle events (install, update, activate)
 * - Stores and manages user settings (optional)
 * - Communicates with content scripts via messaging
 *
 * Design principles:
 * - Minimal logic in background (heavy lifting happens in content scripts)
 * - Recruiter-friendly modularity
 * - Manifest V3 compliant
 */

/* ------------------- Lifecycle Events ------------------- */

// Called when the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("EyeFlow installed for the first time!");
    // Initialize default settings if needed
    chrome.storage.sync.set({ scrollSpeed: 1.0 }, () => {
      console.log("Default scroll speed set to 1.0");
    });
  } else if (details.reason === "update") {
    console.log("EyeFlow updated to a new version!");
  }
});

// Optional: activation when service worker is started
chrome.runtime.onStartup.addListener(() => {
  console.log("EyeFlow service worker started");
});

/* ------------------- Messaging Interface ------------------- */

/**
 * Listens for messages from content scripts or popup.
 * Example usage:
 * - Toggle eye-tracking on/off
 * - Update scroll speed
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "GET_SETTINGS":
      chrome.storage.sync.get(["scrollSpeed"], (items) => {
        sendResponse({ scrollSpeed: items.scrollSpeed || 1.0 });
      });
      return true; // keep channel open for async response

    case "SET_SCROLL_SPEED":
      chrome.storage.sync.set({ scrollSpeed: message.value }, () => {
        console.log(`Scroll speed updated to ${message.value}`);
        sendResponse({ success: true });
      });
      return true; // async response

    default:
      console.warn("Unknown message type:", message.type);
      sendResponse({ success: false });
  }
});
