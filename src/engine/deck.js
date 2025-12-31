// src/engine/deck.js

/**
 * Card shape (matches our state spec):
 * {
 *   id: "AS" | "10H" | ...,
 *   rank: "A"|"2"|...|"10"|"J"|"Q"|"K",
 *   suit: "S"|"H"|"D"|"C"
 * }
 */

export const SUITS = ["S", "H", "D", "C"];
export const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

/**
 * Build a fresh ordered 52-card deck.
 */
export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        id: `${rank}${suit}`,
        rank,
        suit
      });
    }
  }
  return deck;
}

/**
 * Fisher–Yates shuffle (in-place). Returns the same array for convenience.
 */
export function shuffleDeck(deck, rng = Math.random) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/**
 * Create and shuffle a new deck.
 */
export function createShuffledDeck(rng = Math.random) {
  return shuffleDeck(createDeck(), rng);
}

/**
 * Draw a card from remaining deck.
 * Returns:
 *  - { card, remaining, discard } on success
 *  - { card: null, remaining, discard } if empty
 */
export function drawCard(remaining, discard) {
  if (!Array.isArray(remaining) || !Array.isArray(discard)) {
    throw new Error("drawCard expects (remaining:Array, discard:Array)");
  }

  if (remaining.length === 0) {
    return { card: null, remaining, discard };
  }

  const card = remaining[0];
  const nextRemaining = remaining.slice(1);
  const nextDiscard = [...discard, card];

  return { card, remaining: nextRemaining, discard: nextDiscard };
}

/**
 * Reshuffle discard pile into a new remaining deck.
 * Optionally keep the last drawn card out of the reshuffle (common in card games).
 */
export function reshuffleFromDiscard(discard, { keepLastDrawn = true } = {}, rng = Math.random) {
  if (!Array.isArray(discard)) throw new Error("reshuffleFromDiscard expects discard:Array");

  if (discard.length === 0) {
    return { remaining: [], discard: [] };
  }

  const last = keepLastDrawn ? discard[discard.length - 1] : null;
  const pool = keepLastDrawn ? discard.slice(0, -1) : discard.slice();

  const remaining = shuffleDeck(pool, rng);
  const nextDiscard = last ? [last] : [];

  return { remaining, discard: nextDiscard };
}

/**
 * Utility: check if a card is a King.
 */
export function isKing(card) {
  return !!card && card.rank === "K";
}
