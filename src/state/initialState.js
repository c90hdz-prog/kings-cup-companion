export const initialState = {
  app: {
    phase: "home", // "home" | "setup" | "playing"
    gameId: null,
    startedAt: null,
    endedAt: null
  },

  game: {
    players: [],         // ✅ NEW
    turnCount: 0,        // ✅ NEW
    deck: { remaining: [], discard: [] },
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
    overlays: {
      menuOpen: false,
      choiceOpen: false,
      mateOpen: false,
      ruleInputOpen: false,
      rulesListOpen: false,
      confirmRestartOpen: false,
      deckExhaustedOpen: false,
      finalKingOpen: false
    },
    animation: { inputLocked: false, isRevealing: false, revealStage: "front" },
    pendingChoice: { type: null, cardId: null }
  },

  toast: { open: false, message: "", variant: "neutral", shownAt: null }
};
