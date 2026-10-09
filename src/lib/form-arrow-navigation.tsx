"use client";

import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  'input:not([type="hidden"]):not([disabled]):not([readonly])',
  "textarea:not([disabled]):not([readonly])",
  "select:not([disabled])",
  '[role="combobox"]:not([disabled])',
  "button[aria-haspopup]:not([disabled])",
  "button[data-state]:not([disabled])",
  '[data-slot="select-trigger"]:not([disabled])',
].join(", ");

function isNavigableControl(el: Element | null): el is HTMLElement {
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el.closest("[data-form-arrow-nav-ignore]")) return false;
  if (el.getAttribute("aria-hidden") === "true") return false;
  if ((el as HTMLInputElement).disabled) return false;

  const tag = el.tagName;
  if (tag === "INPUT") {
    const type = (el as HTMLInputElement).type;
    if (type === "hidden" || type === "submit" || type === "button" || type === "reset") {
      return false;
    }
    return true;
  }
  if (tag === "TEXTAREA" || tag === "SELECT") return true;

  // Radix Select / combobox-style triggers (Themes Select.Trigger is a button with data-state)
  if (
    el.getAttribute("role") === "combobox" ||
    el.hasAttribute("data-radix-select-trigger") ||
    el.getAttribute("data-slot") === "select-trigger" ||
    (tag === "BUTTON" &&
      (el.hasAttribute("aria-haspopup") || el.hasAttribute("data-state")) &&
      !el.closest("[data-form-arrow-nav-ignore]"))
  ) {
    // Exclude pure action buttons (submit-style UI) that sit outside field wrappers
    const text = (el.textContent || "").trim().toLowerCase();
    if (
      text.includes("save") ||
      text.includes("update") ||
      text.includes("add ") ||
      text.includes("submit") ||
      text.includes("cancel") ||
      text.includes("delete") ||
      text.includes("close")
    ) {
      return false;
    }
    return true;
  }

  return false;
}

function getScope(el: HTMLElement): HTMLElement {
  const scoped =
    el.closest<HTMLElement>("[data-form-arrow-nav]") ||
    el.closest<HTMLElement>('[role="dialog"]') ||
    el.closest<HTMLElement>("[data-radix-dialog-content]") ||
    el.closest<HTMLElement>("form");

  if (scoped) return scoped;

  // Fallback: climb until we hit a container with multiple form fields
  let node: HTMLElement | null = el.parentElement;
  while (node && node !== document.body) {
    const focusables = node.querySelectorAll(FOCUSABLE_SELECTOR);
    let count = 0;
    focusables.forEach(f => {
      if (isNavigableControl(f)) count += 1;
    });
    if (count >= 2) return node;
    node = node.parentElement;
  }
  return document.body;
}

function getFocusableInScope(scope: HTMLElement): HTMLElement[] {
  const nodes = Array.from(scope.querySelectorAll(FOCUSABLE_SELECTOR));
  return nodes.filter(isNavigableControl).filter(el => {
    // Skip elements that are not visible
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (el.offsetParent === null && style.position !== "fixed") return false;
    return true;
  });
}

function rectCenter(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, r };
}

function findByDirection(
  current: HTMLElement,
  items: HTMLElement[],
  key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight",
): HTMLElement | null {
  const idx = items.indexOf(current);
  if (idx === -1) return null;

  // Prefer visual geometry for left/right (multi-column grids)
  if (key === "ArrowLeft" || key === "ArrowRight") {
    const cur = rectCenter(current);
    const horizontal = key === "ArrowRight";
    let best: HTMLElement | null = null;
    let bestScore = Infinity;

    for (const item of items) {
      if (item === current) continue;
      const c = rectCenter(item);
      const dx = c.x - cur.x;
      const dy = Math.abs(c.y - cur.y);

      // Must be primarily in the intended horizontal direction
      if (horizontal && dx <= 4) continue;
      if (!horizontal && dx >= -4) continue;

      // Prefer same row (small dy), then closest horizontally
      const score = dy * 3 + Math.abs(dx);
      if (score < bestScore) {
        bestScore = score;
        best = item;
      }
    }

    if (best) return best;
  }

  // Vertical or fallback: DOM order
  if (key === "ArrowDown" || key === "ArrowRight") {
    return items[idx + 1] ?? null;
  }
  return items[idx - 1] ?? null;
}

/**
 * Global arrow-key navigation between form fields.
 * Mount once near the root of the app.
 */
export function FormArrowKeyNavigation() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key !== "ArrowUp" &&
        e.key !== "ArrowDown" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
      ) {
        return;
      }

      // Don't steal keys while modifier shortcuts are held
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!isNavigableControl(target)) return;

      // Allow local handlers for open dropdowns / combobox / search lists
      // Let dropdowns handle arrow keys only while they are open.
      if (
        target.closest('[role="listbox"]') ||
        target.closest("[data-radix-select-content]") ||
        target.closest('[data-search-dropdown-open="true"]') ||
        target.closest("[data-form-arrow-nav-ignore]") ||
        target.getAttribute("aria-expanded") === "true"
      ) {
        return;
      }

      const scope = getScope(target);
      const items = getFocusableInScope(scope);
      if (items.length < 2) return;

      const next = findByDirection(target, items, e.key);
      if (!next) return;

      e.preventDefault();
      e.stopPropagation();
      next.focus();

      // Select text in text-like inputs for quick overwrite (optional UX nicety)
      if (
        next instanceof HTMLInputElement &&
        (next.type === "text" ||
          next.type === "search" ||
          next.type === "tel" ||
          next.type === "email" ||
          next.type === "number" ||
          next.type === "password")
      ) {
        try {
          next.select();
        } catch {
          // ignore
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);

  return null;
}
