export const initialState = {
  app: {
    version: "1.0.0",
    gameId: null,
    phase: "home",
    startedAt: null,
    endedAt: null
  },
  settings: {
    theme: "dark",
    humorMode: "chaotic",
    soundEnabled: true,
    reduceMotion: false
  },
  players: {
    list: [],
    maxPlayers: 12,
    minPlayersForNames: 2
  },
  game: {
    deck: { remaining: [], discard: [] },
    progress: { kingsDrawn: 0 },
    effects: { mateLink: null, houseRules: [] },
    turn: { currentCard: null, resolved: null, joke: null, actorPlayerId: null, targetPlayerId: null }
  },
  ui: {
    overlays: {
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
