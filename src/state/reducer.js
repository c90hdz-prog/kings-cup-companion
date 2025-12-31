import { initialState } from "./initialState.js";
import { APP_INIT, START_GAME, DRAW_REQUESTED, DRAW_RESOLVED, REVEAL_FRONT, REVEAL_COMPLETE } from "./actions.js";


import { createShuffledDeck } from "../engine/deck.js";

export function reducer(state = initialState, action) {
  switch (action.type) {
    case APP_INIT:
      return { ...initialState };

    case START_GAME: {
      const deck = createShuffledDeck();

      return {
        ...state,
        app: {
          ...state.app,
          phase: "playing",
          gameId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          startedAt: Date.now(),
          endedAt: null
        },
        game: {
          ...state.game,
          deck: {
            remaining: deck,
            discard: []
          },
          progress: { kingsDrawn: 0 },
          effects: { mateLink: null, houseRules: [] },
          turn: {
            currentCard: null,
            resolved: null,
            joke: null,
            actorPlayerId: null,
            targetPlayerId: null
          }
        },
        ui: {
          ...state.ui,
          overlays: {
            ...state.ui.overlays,
            menuOpen: false,
            choiceOpen: false,
            mateOpen: false,
            ruleInputOpen: false,
            rulesListOpen: false,
            confirmRestartOpen: false,
            deckExhaustedOpen: false
          },
          animation: { inputLocked: false, isRevealing: false, revealStage: "front" },
          pendingChoice: { type: null, cardId: null }
        },
        toast: { open: false, message: "", variant: "neutral", shownAt: null }
      };
    }

case DRAW_REQUESTED: {
  if (state.app.phase !== "playing") return state;
  if (state.ui.animation.inputLocked) return state;

  return {
    ...state,
    ui: {
      ...state.ui,
      animation: {
        ...state.ui.animation,
        inputLocked: true,
        isRevealing: true,
        revealStage: "back"
      }
    }
  };
}


case DRAW_RESOLVED: {
  const { card, remaining, discard } = action.payload;

  return {
    ...state,
    game: {
      ...state.game,
      deck: { remaining, discard },
      turn: { ...state.game.turn, currentCard: card }
    },
    ui: {
      ...state.ui,
      animation: {
        ...state.ui.animation,
        inputLocked: true,
        isRevealing: true,
        revealStage: "back"
      }
    }
  };
}
case REVEAL_FRONT: {
  return {
    ...state,
    ui: {
      ...state.ui,
      animation: {
        ...state.ui.animation,
        revealStage: "front"
      }
    }
  };
}


case REVEAL_COMPLETE: {
  return {
    ...state,
    ui: {
      ...state.ui,
      animation: {
        ...state.ui.animation,
        inputLocked: false,
        isRevealing: false,
        revealStage: "front"
      }
    }
  };
}



    default:
      return state;
  }
}
