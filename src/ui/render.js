// src/ui/render.js
import { subscribe, getState } from "../state/store.js";
import { renderHome } from "./screens/home.js";
import { renderGame } from "./screens/game.js";

const root = document.getElementById("app");

function doRender(state) {
  root.innerHTML = "";

  if (state.app.phase === "playing") {
    root.appendChild(renderGame(state));
  } else {
    root.appendChild(renderHome(state));
  }
}

export function renderApp() {
  // Render immediately
  doRender(getState());
  

  // Re-render on every state update
  subscribe((state) => doRender(state));
}
