import { requestDraw } from "../controller.js";
import { getState } from "../state/store.js";

export function canDrawNow() {
  const s = getState();
  return s.app.phase === "playing" && !s.ui.animation.inputLocked;
}

export function handleDrawIntent(source = "unknown") {
  if (!canDrawNow()) return;
  requestDraw();
}
