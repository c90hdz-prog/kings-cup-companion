import { initStore, dispatch, subscribe } from "./state/store.js";
import { renderApp } from "./ui/render.js";
import { APP_INIT } from "./state/actions.js";

// Init store first
initStore();

// Re-render on every state change
subscribe(() => renderApp());

// First paint
renderApp();

// App lifecycle start
dispatch({ type: APP_INIT });

/* Prevent pinch-zoom / gesture zoom (app-like feel) */
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.scale && e.scale !== 1) e.preventDefault();
  },
  { passive: false }
);

document.addEventListener("gesturestart", (e) => e.preventDefault());
