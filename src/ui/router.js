import { renderHome } from "./screens/home.js";
import { renderSetup } from "./screens/setup.js";
import { renderGame } from "./screens/game.js";

export function route(state) {
  if (state.app.phase === "setup") return renderSetup(state);
  if (state.app.phase === "playing") return renderGame(state);
  return renderHome(state);
}
