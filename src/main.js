import { initStore, dispatch } from "./state/store.js";
import { renderApp } from "./ui/render.js";
import { APP_INIT } from "./state/actions.js";


// Prevent pinch-zoom / gesture zoom (useful for "app-like" feel)
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.scale && e.scale !== 1) e.preventDefault();
  },
  { passive: false }
);

document.addEventListener("gesturestart", (e) => e.preventDefault());



initStore();
renderApp();
dispatch({ type: APP_INIT });
