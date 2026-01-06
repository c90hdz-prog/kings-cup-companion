import { handleDrawIntent } from "./handlers.js";

let cleanupFns = [];

export function initGestures() {
  // Clear any old listeners (useful if hot reload or re-init happens)
  cleanup();

  // ✅ Keyboard: Space / Enter draws
  const onKeyDown = (e) => {
    // don’t trigger if typing in an input/textarea
    const tag = (e.target?.tagName || "").toLowerCase();
    const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;

    if (typing) return;

    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      handleDrawIntent("keyboard");
    }
  };

  window.addEventListener("keydown", onKeyDown, { passive: false });
  cleanupFns.push(() => window.removeEventListener("keydown", onKeyDown));

  // ✅ Click/tap: delegate to elements marked with [data-drawtap]
  const onPointerUp = (e) => {
    const target = e.target?.closest?.("[data-drawtap]");
    if (!target) return;
    // avoid “ghost clicks” if something else is on top
    e.preventDefault();
    handleDrawIntent("tap");
  };

  // pointerup works for mouse + touch
  window.addEventListener("pointerup", onPointerUp, { passive: false });
  cleanupFns.push(() => window.removeEventListener("pointerup", onPointerUp));
}

export function cleanup() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
}
