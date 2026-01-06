// src/state/store.js
import { reducer } from "./reducer.js";
import { initialState } from "./initialState.js";

let state = initialState;
const listeners = new Set();

export function initStore() {
  state = initialState;
}

export function getState() {
  return state;
}

export function dispatch(action) {
  state = reducer(state, action);
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
