import { requestDraw } from "../../controller.js";
import { renderDeckStack } from "../components/DeckStack.js";
import { dispatch } from "../../state/store.js";
import { RESTART_SAME_PLAYERS } from "../../state/actions.js";


export function renderGame(state) {
  const el = document.createElement("div");
  el.className = "screen game";

  const remainingCount = state.game.deck.remaining.length;
  const discardCount = state.game.deck.discard.length;

  const deckEl = renderDeckStack({
    remainingCount,
    max: 52,
    isRevealing: state.ui.animation.isRevealing
  });

  const kings = state.game.progress.kingsDrawn ?? 0;
  const finalOpen = !!state.ui.overlays.finalKingOpen;

  const card = state.game.turn.currentCard;
  const rule = state.game.turn.resolved;

  const stage = state.ui.animation.revealStage ?? "front";
  const showFront = stage === "front";

  const displayText = card && showFront ? `${card.rank}${card.suit}` : "";
  const cardClass = showFront ? "front" : "back";
  const animClass = state.ui.animation.isRevealing ? "revealing" : "";

  const disabledAttr = state.ui.animation.inputLocked ? "disabled" : "";

  el.innerHTML = `
    <h1>Game</h1>

    <div class="game-top"></div>

    <p>Deck: <b>${remainingCount}</b> remaining, <b>${discardCount}</b> discarded</p>
    <p>Kings drawn: <b>${kings}</b>/4</p>

    <div style="margin-top:16px;">
      <div class="card-box ${cardClass} ${animClass}">${displayText}</div>
    </div>

    <button id="drawBtn" ${disabledAttr}>Draw (temp)</button>
    ${finalOpen ? "" : `<p><em>Next: replace this with swipe.</em></p>`}

    ${rule && stage === "front" ? `
      <div class="rule-box">
        <div class="rule-title">${rule.title}</div>
        <div class="rule-joke">${rule.joke}</div>
      </div>
    ` : ""}

    ${finalOpen ? `
      <div class="overlay-backdrop" id="finalBackdrop"></div>
      <div class="overlay-card">
        <h2>👑 Final King 👑</h2>
        <p>Alright… whoever drew it drinks the cup.</p>
        <button id="restartBtn">Restart</button>
      </div>
    ` : ""}
  `;

  // Insert deck component
  el.querySelector(".game-top").appendChild(deckEl);

  // Button handler (guarded)
  const drawBtn = el.querySelector("#drawBtn");
  if (drawBtn) {
    drawBtn.addEventListener("click", () => requestDraw());
  }

  // Final overlay handler
if (finalOpen) {
  el.querySelector("#restartBtn")?.addEventListener("click", () => {
    dispatch({ type: RESTART_SAME_PLAYERS });
  });
}


  return el;
}

