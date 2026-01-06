
import { initialState } from "./initialState.js";
import {
  APP_INIT,
  GO_HOME,
  OPEN_SETUP,
  ADD_PLAYER,
  REMOVE_PLAYER,
  START_GAME,
  DRAW_REQUESTED,
  DRAW_RESOLVED,
  REVEAL_FRONT,
  REVEAL_COMPLETE,
  FINAL_KING_TRIGGERED,
  RESTART_SAME_PLAYERS
} from "./actions.js";


import { resolveRule } from "../engine/resolver.js";


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
          players: state.game.players ?? [],
          turnCount: 0,
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
            deckExhaustedOpen: false,
            finalKingOpen: false,
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

case GO_HOME:
  return {
    ...state,
    app: { ...state.app, phase: "home" }
  };

case OPEN_SETUP:
  return {
    ...state,
    app: { ...state.app, phase: "setup" }
  };

case ADD_PLAYER: {
  const name = action.payload?.name?.trim();
  if (!name) return state;

  const player = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    name
  };

  return {
    ...state,
    game: {
      ...state.game,
      players: [...(state.game.players ?? []), player]
    }
  };
}

case REMOVE_PLAYER: {
  const id = action.payload?.id;
  return {
    ...state,
    game: {
      ...state.game,
      players: (state.game.players ?? []).filter((p) => p.id !== id)
    }
  };
}


case DRAW_RESOLVED: {
  const { card, remaining, discard } = action.payload;
  const rule = resolveRule(card);

  // King tracking (your current logic)
  const isKing = card?.rank === "K";
  const kingsDrawn = (state.game.progress?.kingsDrawn ?? 0) + (isKing ? 1 : 0);

  // ✅ Player rotation (NEW)
  const players = state.game.players ?? [];
  const nextTurnCount = (state.game.turnCount ?? 0) + 1;

  let actorPlayerId = null;
  if (players.length > 0) {
    const idx = (nextTurnCount - 1) % players.length;
    actorPlayerId = players[idx].id;
  }

  return {
    ...state,
    game: {
      ...state.game,
      deck: { remaining, discard },
      turnCount: nextTurnCount,
      progress: {
        ...state.game.progress,
        kingsDrawn
      },
      turn: {
        ...state.game.turn,
        currentCard: card,
        resolved: rule,
        actorPlayerId,
        targetPlayerId: null
      }
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

case FINAL_KING_TRIGGERED: {
  return {
    ...state,
    ui: {
      ...state.ui,
      overlays: {
        ...state.ui.overlays,
        finalKingOpen: true
      },
      animation: {
        ...state.ui.animation,
        inputLocked: true
      }
    }
  };
}

case RESTART_SAME_PLAYERS: {
  const deck = createShuffledDeck();

  return {
    ...state,
    game: {
      ...state.game,
      players: state.game.players ?? [],
      deck: {
        remaining: deck,
        discard: []
      },
      progress: { kingsDrawn: 0 },
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
        finalKingOpen: false
      },
      animation: {
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
