import { getState, dispatch } from "./state/store.js";
import { DRAW_REQUESTED, DRAW_RESOLVED, REVEAL_FRONT, REVEAL_COMPLETE } from "./state/actions.js";


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

      // Face-down briefly, then reveal the front
      setTimeout(() => dispatch({ type: REVEAL_FRONT }), 180);

      // End animation + unlock
      setTimeout(() => dispatch({ type: REVEAL_COMPLETE }), 420);
    }, 0);


}

