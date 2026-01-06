
import { requestDraw } from "../../controller.js";
import { dispatch } from "../../state/store.js";
import { RESTART_SAME_PLAYERS } from "../../state/actions.js";
import { GO_HOME } from "../../state/actions.js";


export function renderGame(state) {
  const el = document.createElement("div");
  el.className = "screen game";

  const remainingCount = state.game.deck.remaining.length;
  const discardCount = state.game.deck.discard.length;


  const kings = state.game.progress.kingsDrawn ?? 0;
  const finalOpen = !!state.ui.overlays.finalKingOpen;
  const players = state.game.players ?? [];
  const actorId = state.game.turn.actorPlayerId;
  const actorName = players.find((p) => p.id === actorId)?.name;

  let nextName = null;
  if (players.length > 0) {
    const turnCount = state.game.turnCount ?? 0; // already incremented in DRAW_RESOLVED
    const nextIdx = turnCount % players.length;  // next turn after current
    nextName = players[nextIdx]?.name ?? null;
  }
const hasPlayers = players.length > 0 && state.game.turnCount > 0;

const turnLine = hasPlayers
  ? `
    <div class="turn-line">
      <span class="turn-label">Now</span>
      <span class="turn-name">${actorName ?? "—"}</span>
      <span class="turn-sep">•</span>
      <span class="turn-label">Next</span>
      <span class="turn-name">${nextName ?? "—"}</span>
    </div>
  `
  : "";

  const card = state.game.turn.currentCard;
  const rule = state.game.turn.resolved;

  const stage = state.ui.animation.revealStage ?? "front";

  // ✅ If we have never drawn a card yet, show the BACK art instead of a blank front
  const hasCard = !!card;
  const effectiveStage = hasCard ? stage : "back";

  const showFront = effectiveStage === "front";


  const suitMap = { H: "♥", D: "♦", C: "♣", S: "♠" };

const rank = card?.rank ?? "";
const suit = card ? (suitMap[card.suit] ?? "") : "";

const isKing = rank === "K";
const kingClass = isKing ? "king" : "";

const cardInner =
  card && showFront
    ? `
      <div class="card-face">
        <div class="card-corner top">
          <span class="rank">${rank}</span>
          <span class="suit">${suit}</span>
        </div>

        <div class="card-center">${suit}</div>

        <div class="card-corner bottom">
          <span class="suit">${suit}</span>
          <span class="rank">${rank}</span>
        </div>
      </div>
    `
    : "";

  const cardClass = showFront ? "front" : "back";
  const animClass = state.ui.animation.isRevealing ? "revealing" : "";

  const disabledAttr = state.ui.animation.inputLocked ? "disabled" : "";

  el.innerHTML = `
    <div class="game-header">
      <h1>King's Cup</h1>
      <button class="icon-btn hold-btn" id="homeHoldBtn" aria-label="Hold to go Home">
        Home
      </button>
    </div>


<div class="game-meta chips">
  <div class="chipstat">Deck <b>${remainingCount}</b></div>
  <div class="chipstat">Discard <b>${discardCount}</b></div>
  <div class="chipstat">Kings <b>${kings}</b>/4</div>
</div>

<div class="kings-dots" aria-label="Kings progress">
  ${[0,1,2,3].map(i => `<span class="dot ${kings > i ? "on" : ""}"></span>`).join("")}
</div>

${turnLine}


    <div class="card-stage">
      <div class="card-box ${cardClass} ${animClass} ${kingClass}">${cardInner}</div>

    </div>

    ${finalOpen ? "" : `<p class="tap-hint"><em>Tap the card to draw.</em></p>`}





    ${rule && effectiveStage === "front" ? `
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
// Tap/click card to draw (mobile-friendly)
const cardBox = el.querySelector(".card-box");
if (cardBox) {
  cardBox.addEventListener("click", () => requestDraw());
  cardBox.addEventListener("pointerup", (e) => {
    e.preventDefault();
    requestDraw();
  }, { passive: false });
}





  // Final overlay handler
if (finalOpen) {
  el.querySelector("#restartBtn")?.addEventListener("click", () => {
    dispatch({ type: RESTART_SAME_PLAYERS });
  });
}


// Hold-to-home (accident proof)
const homeBtn = el.querySelector("#homeHoldBtn");
if (homeBtn) {
  let t = null;

  const startHold = (e) => {
    e.preventDefault();
    if (state.ui.animation.inputLocked) return; // optional guard
    homeBtn.classList.add("holding");
    t = setTimeout(() => {
      dispatch({ type: GO_HOME });
    }, 1500); // 1.5s hold
  };

  const cancelHold = () => {
    homeBtn.classList.remove("holding");
    if (t) clearTimeout(t);
    t = null;
  };

  homeBtn.addEventListener("pointerdown", startHold, { passive: false });
  homeBtn.addEventListener("pointerup", cancelHold);
  homeBtn.addEventListener("pointerleave", cancelHold);
  homeBtn.addEventListener("pointercancel", cancelHold);

  // Optional: prevent long-press context menu on some browsers
  homeBtn.addEventListener("contextmenu", (e) => e.preventDefault());
}




  return el;
}

