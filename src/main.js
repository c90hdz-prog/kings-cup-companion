import { initStore, dispatch } from "./state/store.js";
import { renderApp } from "./ui/render.js";
import { APP_INIT } from "./state/actions.js";

initStore();
renderApp();
dispatch({ type: APP_INIT });
