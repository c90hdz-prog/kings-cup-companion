import { requestDraw } from "../../controller.js";
import { renderDeckStack } from "../components/DeckStack.js";

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



  const card = state.game.turn.currentCard;

  // Default to front if revealStage isn't set yet (prevents "stuck on back")
  const stage = state.ui.animation.revealStage ?? "front";
  const showFront = stage === "front";

  const displayText = card && showFront ? `${card.rank}${card.suit}` : "";
  const cardClass = showFront ? "front" : "back";
  const animClass = state.ui.animation.isRevealing ? "revealing" : "";

  // Proper disabled attribute
  const disabledAttr = state.ui.animation.inputLocked ? "disabled" : "";

  el.innerHTML = `
  <h1>Game</h1>

  <div class="game-top"></div>

  <p>Deck: <b>${remainingCount}</b> remaining, <b>${discardCount}</b> discarded</p>

  <div style="margin-top:16px;">
    <div class="card-box ${cardClass} ${animClass}">${displayText}</div>
  </div>

  <button id="drawBtn" ${disabledAttr}>Draw (temp)</button>
  <p><em>Next: replace this with swipe.</em></p>
`;

  el.querySelector(".game-top").appendChild(deckEl);


  el.querySelector("#drawBtn").addEventListener("click", () => {
    requestDraw();
  });

  return el;
}
