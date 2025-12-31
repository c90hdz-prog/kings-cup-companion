// src/ui/components/DeckStack.js

export function renderDeckStack({ remainingCount = 0, max = 52, isRevealing = false } = {}) {
  const el = document.createElement("div");
  el.className = "deck-stack";

  const pct = Math.max(0, Math.min(1, remainingCount / max));
  const layers = Math.max(1, Math.min(10, Math.ceil(pct * 10)));

  el.style.setProperty("--pct", String(pct));
  el.style.setProperty("--layers", String(layers));

  const pileClass = isRevealing ? "deck-stack__pile reacting" : "deck-stack__pile";

  el.innerHTML = `
    <div class="deck-stack__label">
      <div class="deck-stack__count">${remainingCount}</div>
      <div class="deck-stack__sub">left</div>
    </div>
    <div class="${pileClass}" aria-label="Deck remaining"></div>
  `;

  return el;
}

