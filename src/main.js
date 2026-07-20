import "./index.css";
import { state, loadState } from "./state.js";
import { fetchAllDbState } from "./api.js";
import { navigateTo } from "./render.js";
import { bindAllEvents } from "./events.js";


async function init() {
  await fetchAllDbState();
  loadState();
  bindAllEvents();
  
  if (window.ACTIVE_PAGE_ROUTE) {
    state.activeView = window.ACTIVE_PAGE_ROUTE;
  }
  
  // Route Protection
  const isLoggedOut = !state.currentCustomerId && !state.currentRestaurantId;
  if (isLoggedOut && state.activeView !== 'portal-landing') {
    navigateTo('portal-landing');
    return;
  }
  if (!isLoggedOut && state.activeView === 'portal-landing') {
    if (state.currentCustomerId) {
      navigateTo('home');
    } else if (state.currentRestaurantId) {
      navigateTo('restaurant');
    }
    return;
  }
  
  navigateTo(state.activeView, true);
}


window.addEventListener('DOMContentLoaded', init);
export {};
