/**
 * EyeFlow — Page Type Detection Utility
 *
 * Purpose:
 * Determine whether the current page should be treated as:
 *  - A normal web page
 *  - A PDF document (native or embedded)
 *
 * This logic is intentionally isolated to keep main.ts clean.
 */

export enum PageType {
  WEB = "WEB",
  PDF = "PDF",
}

/**
 * Detects the current page type.
 *
 * Priority order:
 * 1. Native PDF content type
 * 2. Chrome's embedded PDF viewer
 * 3. URL-based PDF detection
 *
 * Defaults safely to WEB.
 */
export function detectPageType(): PageType {
  // 1. Native PDF document (most reliable)
  if (document.contentType === "application/pdf") {
    return PageType.PDF;
  }

  // 2. Chrome embedded PDF viewer
  // Chrome often wraps PDFs in <embed> or <object> tags
  const embeds = document.querySelectorAll("embed, object");

  for (const el of Array.from(embeds)) {
    const type = el.getAttribute("type");
    const src = el.getAttribute("src") || "";

    if (type === "application/pdf" || src.toLowerCase().endsWith(".pdf")) {
      return PageType.PDF;
    }
  }

  // 3. URL-based fallback (least reliable, but useful)
  if (window.location.href.toLowerCase().includes(".pdf")) {
    return PageType.PDF;
  }

  return PageType.WEB;
}
