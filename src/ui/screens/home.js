import { dispatch } from "../../state/store.js";
import { START_GAME, OPEN_SETUP } from "../../state/actions.js";

export function renderHome() {
  const el = document.createElement("div");
  el.className = "screen home";

  el.innerHTML = `
    <div class="home-shell">
      <header class="home-header">
        <div class="home-badge">👑</div>
        <h1 class="home-title">King's Cup</h1>
        <p class="home-subtitle">Quick start or add players for turn rotation.</p>
      </header>

      <section class="home-card">
        <div class="home-card__top">
          <div class="home-card__label">Ready?</div>
          <div class="home-card__hint">Tap a mode to begin.</div>
        </div>

        <div class="home-actions">
          <button id="quickBtn" class="btn btn-primary">Quick Start</button>
          <button id="playersBtn" class="btn btn-ghost">Add Players</button>
        </div>

        <div class="home-footnote">
          <span class="dot"></span>
          <span>21+ Only</span>
        </div>
      </section>
    </div>
  `;

  el.querySelector("#quickBtn").addEventListener("click", () => {
    dispatch({ type: START_GAME });
  });

  el.querySelector("#playersBtn").addEventListener("click", () => {
    dispatch({ type: OPEN_SETUP });
  });

  return el;
}
