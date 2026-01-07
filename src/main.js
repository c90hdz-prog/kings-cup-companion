import { initStore, dispatch, subscribe } from "./state/store.js";
import { renderApp } from "./ui/render.js";
import { APP_INIT } from "./state/actions.js";

/* ---------- PWA: Service Worker ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

/* ---------- PWA: Install Prompt ---------- */
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Expose flag so UI can show install button
  window.__canInstallPWA = true;
  renderApp(); // re-render so Home can show the button
});

window.doInstall = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  window.__canInstallPWA = false;
  renderApp();
};

/* ---------- App boot ---------- */
subscribe(renderApp);
initStore();
dispatch({ type: APP_INIT });
