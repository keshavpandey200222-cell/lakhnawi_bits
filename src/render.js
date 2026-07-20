import { state, saveState } from "./state.js";
import { LUCKNOW_LOCALITIES } from "./data/restaurants.js";

// Import view-render functions
import { renderPortalLanding } from "./views/portalLandingView.js";
import { renderCategories, renderRestaurants } from "./views/homeView.js";
import { renderMenu, addToCart, updateCartQuantity } from "./views/menuView.js";
import { renderProfile, openOrderDetailsModal } from "./views/profileView.js";
import { renderOrderTracking } from "./views/trackingView.js";
import { renderRestaurantWorkspace } from "./views/restaurantView.js";
import { renderCartDrawer } from "./views/modalsView.js";

// Re-export view-render functions so they can be imported transparently from render.js
export {
  renderPortalLanding,
  renderCategories,
  renderRestaurants,
  renderMenu,
  addToCart,
  updateCartQuantity,
  renderProfile,
  openOrderDetailsModal,
  renderOrderTracking,
  renderRestaurantWorkspace,
  renderCartDrawer
};

export function navigateTo(view, isInitialLoad = false) {
  if (!isInitialLoad) {
    state.activeView = view;
    saveState();
    if (view === 'portal-landing') {
      window.location.href = 'index.html';
    } else {
      window.location.href = `${view}.html`;
    }
    return;
  }

  state.activeView = view;
  saveState();

  const views = ['portal-landing-view', 'home-view', 'menu-view', 'profile-view', 'tracking-view', 'restaurant-view'];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) {
      el.classList.add('d-none');
      el.classList.remove('d-block');
    }
  });

  const targetEl = document.getElementById(`${view}-view`);
  if (targetEl) {
    targetEl.classList.remove('d-none');
    targetEl.classList.add('d-block');
  }

  if (view === 'portal-landing') {
    renderPortalLanding();
  } else if (view === 'home') {
    renderCategories();
    renderRestaurants();
  } else if (view === 'menu') {
    renderMenu();
  } else if (view === 'profile') {
    renderProfile();
  } else if (view === 'tracking') {
    renderOrderTracking();
  } else if (view === 'restaurant') {
    renderRestaurantWorkspace();
  }

  renderHeader();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function renderHeader() {
  const totalQty = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const badgeElDesktop = document.getElementById("nav-cart-badge-desktop");
  const badgeElMobile = document.getElementById("nav-cart-badge-mobile");
  const badgeInnerEl = document.getElementById("cart-badge-inner");
  
  if (badgeElDesktop) badgeElDesktop.innerText = totalQty.toString();
  if (badgeElMobile) badgeElMobile.innerText = totalQty.toString();
  if (badgeInnerEl) badgeInnerEl.innerText = totalQty.toString();

  const profileNameEl = document.getElementById("nav-profile-name");
  if (profileNameEl) profileNameEl.innerText = state.userProfile.name;

  const selectEl = document.getElementById("nav-locality-select");
  if (selectEl) {
    if (selectEl.children.length === 0) {
      selectEl.innerHTML = LUCKNOW_LOCALITIES.map(loc => `
        <option value="${loc}" ${loc === state.selectedLocality ? 'selected' : ''}>${loc}</option>
      `).join('');
    } else {
      selectEl.value = state.selectedLocality;
    }
  }

  const heroSelectEl = document.getElementById("hero-locality-select");
  if (heroSelectEl) {
    if (heroSelectEl.children.length === 0) {
      heroSelectEl.innerHTML = LUCKNOW_LOCALITIES.map(loc => `
        <option value="${loc}" ${loc === state.selectedLocality ? 'selected' : ''}>${loc}</option>
      `).join('');
    } else {
      heroSelectEl.value = state.selectedLocality;
    }
  }

  const switcherContainer = document.getElementById("nav-portal-switcher-container");
  const activeBadge = document.getElementById("nav-portal-active-badge");
  const cartBtnDesktop = document.getElementById("nav-cart-btn-desktop");
  const cartBtnMobile = document.getElementById("nav-cart-btn-mobile");
  const profileBtnDesktop = document.getElementById("nav-profile-btn-desktop");
  const profileBtnMobile = document.getElementById("nav-profile-btn-mobile");

  const cartBtn = document.getElementById("nav-cart-btn");
  const profileBtn = document.getElementById("nav-profile-btn");
  const cartCountEl = document.getElementById("nav-cart-count");

  if (cartCountEl) {
    cartCountEl.innerText = totalQty.toString();
    if (totalQty > 0) {
      cartCountEl.classList.remove('d-none');
    } else {
      cartCountEl.classList.add('d-none');
    }
  }

  if (state.activeView === 'portal-landing') {
    if (switcherContainer) switcherContainer.classList.add('d-none');
    if (cartBtnDesktop) cartBtnDesktop.classList.add('d-none');
    if (cartBtnMobile) cartBtnMobile.classList.add('d-none');
    if (profileBtnDesktop) profileBtnDesktop.classList.add('d-none');
    if (profileBtnMobile) profileBtnMobile.classList.add('d-none');

    if (cartBtn) cartBtn.classList.add('d-none');
    if (profileBtn) profileBtn.classList.add('d-none');
  } else if (state.activeView === 'restaurant') {
    if (switcherContainer) switcherContainer.classList.remove('d-none');
    
    const activeRest = state.restaurants.find(r => r.id === state.currentRestaurantId);
    if (activeBadge) {
      activeBadge.innerHTML = `<i class="bi bi-egg-fried text-warning me-1"></i>Kitchen: ${activeRest ? activeRest.name : 'Owner'}`;
      activeBadge.classList.remove('bg-saffron');
      activeBadge.classList.add('bg-dark');
    }

    if (cartBtnDesktop) cartBtnDesktop.classList.add('d-none');
    if (cartBtnMobile) cartBtnMobile.classList.add('d-none');
    if (profileBtnDesktop) profileBtnDesktop.classList.add('d-none');
    if (profileBtnMobile) profileBtnMobile.classList.add('d-none');

    if (cartBtn) cartBtn.classList.add('d-none');
    if (profileBtn) profileBtn.classList.add('d-none');
  } else {
    if (switcherContainer) switcherContainer.classList.remove('d-none');
    
    const activeCust = state.customerProfiles.find(p => p.id === state.currentCustomerId);
    if (activeBadge) {
      activeBadge.innerHTML = `<i class="bi bi-person text-white me-1"></i>Foodie: ${activeCust ? activeCust.name : 'Customer'}`;
      activeBadge.classList.remove('bg-dark');
      activeBadge.classList.add('bg-saffron');
    }

    if (cartBtnDesktop) cartBtnDesktop.classList.remove('d-none');
    if (cartBtnMobile) cartBtnMobile.classList.remove('d-none');
    if (profileBtnDesktop) profileBtnDesktop.classList.remove('d-none');
    if (profileBtnMobile) profileBtnMobile.classList.remove('d-none');

    if (cartBtn) cartBtn.classList.remove('d-none');
    if (profileBtn) profileBtn.classList.remove('d-none');
  }
}
