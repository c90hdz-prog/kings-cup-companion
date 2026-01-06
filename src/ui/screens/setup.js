import { dispatch } from "../../state/store.js";
import { ADD_PLAYER, REMOVE_PLAYER, START_GAME, GO_HOME } from "../../state/actions.js";

export function renderSetup(state) {
  const el = document.createElement("div");
  el.className = "screen setup";

  const players = state.game.players ?? [];

  el.innerHTML = `
    <div class="screen-shell">
      <div class="screen-head">
        <div class="badge-icon" aria-hidden="true">👥</div>
        <div>
          <h1 class="screen-title">Players</h1>
          <p class="muted">Add names (optional). Turns rotate automatically.</p>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">Add a player</div>

        <div class="row">
          <input id="nameInput" type="text" inputmode="text" autocomplete="off"
            placeholder="Add a name..." maxlength="18" />
          <button class="btn ghost" id="addBtn" type="button">Add</button>
        </div>

        ${
          players.length
            ? `
            <div class="chips">
              ${players
                .map(
                  (p) => `
                    <button class="chip" type="button" data-id="${p.id}" aria-label="Remove ${p.name}">
                      <span class="chip-name">${p.name}</span>
                      <span class="x">×</span>
                    </button>
                  `
                )
                .join("")}
            </div>
          `
            : `<p class="empty muted">No players yet — you can still start and play “pass the phone”.</p>`
        }

        <div class="actions">
          <button class="btn primary" id="startBtn" type="button">
            ${players.length ? "Start Game" : "Start Without Players"}
          </button>
          <button class="btn ghost" id="backBtn" type="button">Back</button>
        </div>
      </div>
    </div>
  `;

  const input = el.querySelector("#nameInput");

  const add = () => {
    const name = input.value.trim();
    if (!name) return;
    dispatch({ type: ADD_PLAYER, payload: { name } });
    input.value = "";
    input.focus();
  };

  el.querySelector("#addBtn").addEventListener("click", add);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") add();
  });

  el.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const id = chip.getAttribute("data-id");
      dispatch({ type: REMOVE_PLAYER, payload: { id } });
    });
  });

  el.querySelector("#startBtn").addEventListener("click", () => {
    dispatch({ type: START_GAME });
  });

  el.querySelector("#backBtn").addEventListener("click", () => {
    dispatch({ type: GO_HOME });
  });

  return el;
}
