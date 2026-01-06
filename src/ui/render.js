import { getState } from "../state/store.js";
import { route } from "./router.js";

export function renderApp() {
  const state = getState();          // ✅ THIS is what you’re missing
  const root = document.querySelector("#app");

  root.innerHTML = "";
  root.appendChild(route(state));
}

