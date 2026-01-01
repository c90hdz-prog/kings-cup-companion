// src/engine/resolver.js
import { RULES_BY_RANK } from "../data/ruleset.js";

export function resolveRule(card) {
  if (!card) return null;

  const rule = RULES_BY_RANK[card.rank];
  if (!rule) return null;

  const joke =
    rule.jokes[Math.floor(Math.random() * rule.jokes.length)];

  return {
    title: rule.title,
    joke
  };
}
