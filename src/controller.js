import { getState, dispatch } from "./state/store.js";
import {
  DRAW_REQUESTED,
  DRAW_RESOLVED,
  REVEAL_FRONT,
  REVEAL_COMPLETE,
  FINAL_KING_TRIGGERED
} from "./state/actions.js";



import { drawCard } from "./engine/deck.js";

export function requestDraw() {
    
  const state = getState();

  if (state.app.phase !== "playing") return;
  if (state.ui.animation.inputLocked) return;

  dispatch({ type: DRAW_REQUESTED });

  const { remaining, discard } = state.game.deck;
  const res = drawCard(remaining, discard);

  setTimeout(() => {
    dispatch({
      type: DRAW_RESOLVED,
      payload: {
        card: res.card,
        remaining: res.remaining,
        discard: res.discard
      }
    });

    setTimeout(() => dispatch({ type: REVEAL_FRONT }), 180);

    setTimeout(() => {
      dispatch({ type: REVEAL_COMPLETE });

      // ✅ after reveal complete, if this card was the 4th King, open overlay
      const s = getState();
      if (res.card?.rank === "K" && s.game.progress.kingsDrawn >= 4) {
        dispatch({ type: FINAL_KING_TRIGGERED });
      }
    }, 420);
  }, 0);

}


