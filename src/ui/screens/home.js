import { dispatch } from "../../state/store.js";
import { START_GAME } from "../../state/actions.js";

export function renderHome(state) {
  const el = document.createElement("div");
  el.className = "screen home";

  el.innerHTML = `
    <h1>King’s Cup Companion</h1>
    <p>Scaffold is working ✅</p>
    <button id="startBtn">Start Game</button>
  `;

  el.querySelector("#startBtn").addEventListener("click", () => {
    dispatch({ type: START_GAME });
  });

  return el;
}
