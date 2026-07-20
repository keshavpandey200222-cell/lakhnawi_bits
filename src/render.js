import { state, saveState, getCartRestaurant, getCartRestaurantId, getBillingDetails } from "./state.js";
import { updateOrderStatusOnServer, updateMenuItemPriceOnServer, deleteMenuItemOnServer } from "./api.js";
import { ALL_CATEGORIES, LUCKNOW_LOCALITIES, AVAILABLE_COUPONS } from "./data/restaurants.js";


import { portalLandingView } from "./views/portalLandingView.js";
import { homeView } from "./views/homeView.js";
import { menuView } from "./views/menuView.js";
import { profileView } from "./views/profileView.js";
import { trackingView } from "./views/trackingView.js";
import { restaurantView } from "./views/restaurantView.js";
import { modalsView } from "./views/modalsView.js";


const googleMapNodes = [
  { name: "Aminabad Old Market", position: { lat: 26.8415, lng: 80.9248 } },
  { name: "Hazratganj Crossing", position: { lat: 26.8510, lng: 80.9440 } },
  { name: "Gomti River Bridge", position: { lat: 26.8568, lng: 80.9632 } },
  { name: "Gomti Nagar (Your Residence)", position: { lat: 26.8600, lng: 81.0000 } }
];




export function navigateTo(view, isInitialLoad = false) {
  if (!isInitialLoad) {
    state.activeView = view;
    saveState();
    if (view === 'portal-landing') {
      window.location.href = 'index.html';
    } else {
      window.location.href = `${view}.html`;
    }
    return; // Stop execution, browser will navigate away
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




export function renderCategories() {
  const container = document.getElementById("category-pills-container");
  if (!container) return;

  container.innerHTML = ALL_CATEGORIES.map(cat => `
    <button class="category-pill ${state.selectedCategory === cat ? 'active' : ''}" data-category="${cat}">
      ${cat === "All" ? '<i class="bi bi-compass me-1"></i>All Specialties' : cat}
    </button>
  `).join('');

  container.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      state.selectedCategory = target.getAttribute('data-category') || 'All';
      renderCategories();
      renderRestaurants();
    });
  });
}

export function renderRestaurants() {
  const grid = document.getElementById("restaurant-grid");
  if (!grid) return;

  const filtered = state.restaurants.filter(rest => {
    const matchesLocality = state.selectedLocality === "All Localities" || rest.locality === state.selectedLocality;
    const matchesCategory = state.selectedCategory === "All" || rest.categories.includes(state.selectedCategory);
    const matchesSearch = rest.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          rest.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          rest.locality.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                          rest.menu.some(m => m.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
    return matchesLocality && matchesCategory && matchesSearch;
  });

  const gridTitle = document.getElementById("restaurant-grid-title");
  if (gridTitle) {
    gridTitle.innerText = state.selectedLocality === "All Localities" 
      ? "Top Dining Spots in Lucknow" 
      : `Famous Eateries in ${state.selectedLocality}`;
  }

  const countBadge = document.getElementById("restaurant-count-badge");
  if (countBadge) {
    countBadge.innerText = `Showing ${filtered.length} active kitchens`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-12 py-5 text-center bg-white border rounded-3 p-4 my-2">
        <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 56px; height: 56px;">
          <i class="bi bi-search text-muted fs-4"></i>
        </div>
        <h6 class="font-display fw-bold text-dark mb-1">No eateries found</h6>
        <p class="text-muted small mx-auto mb-4" style="max-width: 340px;">
          We couldn't locate any dining kitchens matching your filters. Try picking another region or clear search inputs.
        </p>
        <button id="clear-filters-btn" class="btn btn-sm btn-outline-saffron px-4 rounded-pill">
          Clear All Filters
        </button>
      </div>
    `;

    document.getElementById("clear-filters-btn")?.addEventListener('click', () => {
      state.searchQuery = "";
      state.selectedCategory = "All";
      state.selectedLocality = "All Localities";
      
      const searchInput = document.getElementById("nav-search-input");
      if (searchInput) searchInput.value = "";
      
      const localitySelect = document.getElementById("nav-locality-select");
      if (localitySelect) localitySelect.value = "All Localities";

      renderCategories();
      renderRestaurants();
    });
    return;
  }

  grid.innerHTML = filtered.map(rest => {
    const isFav = state.favorites.includes(rest.id);
    const badgeHTML = rest.reviewsCount > 50 
      ? `<span class="badge bg-dark text-white rounded-pill px-2.5 py-1 text-uppercase fw-bold" style="font-size: 8px; letter-spacing: 0.5px;">Royal Pick</span>` 
      : "";

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 border rounded-4 overflow-hidden shadow-xs hover-shadow transition restaurant-card" data-id="${rest.id}" style="cursor: pointer; background-color: #ffffff;">
          
          <!-- Image frame -->
          <div class="position-relative" style="height: 190px; overflow: hidden;">
            <img src="${rest.banner}" alt="${rest.name}" class="w-100 h-100 object-cover card-img-top">
            
            <!-- Quick badge overlays -->
            <div class="position-absolute d-flex gap-2 align-items-center" style="top: 14px; left: 14px; z-index: 5;">
              ${badgeHTML}
              <span class="badge bg-white text-dark rounded-pill shadow-xs border px-2.5 py-1.5 fw-bold d-inline-flex align-items-center gap-1" style="font-size: 10px;">
                <i class="bi bi-clock-fill text-saffron"></i>${rest.deliveryTime}
              </span>
            </div>

            <!-- Favorite toggle floating button -->
            <button class="btn btn-light rounded-circle shadow-sm p-0 d-flex align-items-center justify-content-center favorite-toggle-btn" 
                    data-id="${rest.id}" 
                    style="width: 36px; height: 36px; position: absolute; right: 14px; top: 14px; z-index: 10; border: 0;">
              <i class="bi ${isFav ? 'bi-heart-fill text-danger' : 'bi-heart text-muted'}" style="font-size: 15px;"></i>
            </button>

            <!-- Gradient edge cover -->
            <div class="position-absolute w-100" style="bottom: 0; left: 0; height: 40px; background: linear-gradient(to top, rgba(0,0,0,0.1), transparent); pointer-events: none;"></div>
          </div>

          <!-- Body contents -->
          <div class="card-body p-4 text-start">
            <div class="d-flex justify-content-between align-items-start gap-2.5 mb-1.5">
              <h5 class="card-title font-display fw-bold text-dark m-0 fs-6 line-clamp-1">${rest.name}</h5>
              
              <!-- Stars -->
              <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10 d-inline-flex align-items-center gap-1.5 px-2 py-1" style="font-size: 11px;">
                <i class="bi bi-star-fill"></i>${rest.rating}
              </span>
            </div>

            <p class="card-text text-muted small mb-3.5 line-clamp-2">${rest.description}</p>
            
            <!-- Bottom detail rows -->
            <div class="pt-3 border-top d-flex justify-content-between align-items-center gap-2" style="border-color: #f1f1f4 !important;">
              <span class="small text-dark fw-medium d-inline-flex align-items-center gap-1">
                <i class="bi bi-geo-alt text-muted"></i>${rest.locality}
              </span>
              <span class="small text-muted font-mono" style="font-size: 11px;">
                Min: ₹${rest.minOrder} &bull; Delivery ₹${rest.deliveryFee}
              </span>
            </div>

          </div>

        </div>
      </div>
    `;
  }).join('');

  
  grid.querySelectorAll('.restaurant-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const target = e.target;
      if (target.closest('.favorite-toggle-btn')) return;

      const restId = card.getAttribute('data-id');
      if (restId) {
        state.selectedRestaurantId = restId;
        saveState();
        navigateTo('menu');
      }
    });
  });

  
  grid.querySelectorAll('.favorite-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const restId = btn.getAttribute('data-id');
      if (restId) {
        const idx = state.favorites.indexOf(restId);
        if (idx > -1) {
          state.favorites.splice(idx, 1);
        } else {
          state.favorites.push(restId);
        }
        saveState();
        renderRestaurants();
      }
    });
  });
}




export function renderMenu() {
  const rest = state.restaurants.find(r => r.id === state.selectedRestaurantId);
  if (!rest) {
    navigateTo('home');
    return;
  }

  
  const bannerImg = document.getElementById("menu-banner-img") || document.getElementById("menu-hero-img");
  const logoImg = document.getElementById("menu-restaurant-logo");
  const nameEl = document.getElementById("menu-restaurant-name") || document.getElementById("menu-hero-name");
  const descEl = document.getElementById("menu-restaurant-desc") || document.getElementById("menu-hero-description");
  const localityEl = document.getElementById("menu-restaurant-locality");
  const ratingEl = document.getElementById("menu-restaurant-rating") || document.getElementById("menu-stat-rating");
  const feeEl = document.getElementById("menu-restaurant-delivery-fee") || document.getElementById("menu-stat-delivery");
  const minOrderEl = document.getElementById("menu-stat-minorder");

  if (bannerImg) bannerImg.src = rest.banner;
  if (logoImg) logoImg.src = rest.logo || rest.banner;
  if (nameEl) nameEl.innerText = rest.name;
  if (descEl) descEl.innerText = rest.description;
  if (localityEl) localityEl.innerHTML = `<i class="bi bi-geo-alt-fill text-danger me-1"></i> Aminabad Bypass Crossing, ${rest.locality}, Lucknow`;
  
  if (ratingEl) {
    if (ratingEl.id === "menu-stat-rating") {
      ratingEl.innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i>${rest.rating}`;
    } else {
      ratingEl.innerHTML = `<i class="bi bi-star-fill text-warning me-1"></i>${rest.rating} (${rest.reviewsCount}+ ratings)`;
    }
  }

  if (feeEl) {
    if (feeEl.id === "menu-stat-delivery") {
      feeEl.innerHTML = `<i class="bi bi-clock me-1"></i>${rest.deliveryTime}`;
    } else {
      feeEl.innerHTML = `<i class="bi bi-bicycle text-muted me-1"></i>₹${rest.deliveryFee} Delivery Charge &bull; <i class="bi bi-clock-fill text-muted mx-1"></i> ${rest.deliveryTime}`;
    }
  }

  if (minOrderEl) {
    minOrderEl.innerText = `₹${rest.minOrder}`;
  }

  const badgesEl = document.getElementById("menu-hero-badges");
  if (badgesEl) {
    badgesEl.innerHTML = rest.categories.map(c => `
      <span class="badge bg-warning text-dark fw-bold text-uppercase px-2.5 py-1" style="font-size: 9px; letter-spacing: 0.5px;">${c}</span>
    `).join(' ');
  }

  
  const pList = document.getElementById("menu-category-pills");
  if (pList) {
    const cats = ["All", ...rest.categories];
    pList.innerHTML = cats.map(c => `
      <button class="category-pill ${state.menuActiveCategory === c ? 'active' : ''}" data-category="${c}">
        ${c}
      </button>
    `).join('');

    pList.querySelectorAll('.category-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        state.menuActiveCategory = btn.getAttribute('data-category') || 'All';
        renderMenu();
      });
    });
  }

  
  const activeMenu = rest.menu.filter(item => {
    const matchCat = state.menuActiveCategory === 'All' || item.category === state.menuActiveCategory;
    const matchSearch = item.name.toLowerCase().includes(state.menuSearchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(state.menuSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const grid = document.getElementById("menu-items-grid");
  if (!grid) return;

  if (activeMenu.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-egg-fried fs-1 text-muted opacity-40 mb-2 d-block"></i>
        <h6 class="fw-bold text-dark">No dishes matched.</h6>
        <p class="text-muted small">Try modifying your search or picking another category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = activeMenu.map(item => {
    const cartUnit = state.cartItems.find(c => c.menuItem.id === item.id);
    const quantity = cartUnit ? cartUnit.quantity : 0;
    
    const isVegIcon = item.isVeg 
      ? `<span class="d-inline-flex align-items-center justify-content-center border rounded p-0.5" style="width: 13px; height: 13px; border-color: #22c55e;"><span class="rounded-circle" style="width: 6px; height: 6px; background-color: #22c55e;"></span></span>` 
      : `<span class="d-inline-flex align-items-center justify-content-center border rounded p-0.5" style="width: 13px; height: 13px; border-color: #ef4444;"><span class="rounded-circle" style="width: 6px; height: 6px; background-color: #ef4444;"></span></span>`;

    const popularBadge = item.isPopular 
      ? `<span class="badge bg-warning bg-opacity-15 text-warning-emphasis border border-warning border-opacity-10 text-uppercase font-mono me-1" style="font-size: 8px; letter-spacing: 0.5px;">Bestseller</span>` 
      : "";

    return `
      <div class="col-md-6">
        <div class="card p-3 border rounded-3 text-start bg-white shadow-xs position-relative overflow-hidden h-100">
          <div class="d-flex gap-3 justify-content-between">
            
            <!-- Information text panel -->
            <div class="text-start">
              <div class="d-flex align-items-center gap-2 mb-1.5">
                ${isVegIcon}
                ${popularBadge}
                <span class="text-muted small" style="font-size: 10px;">${item.category}</span>
              </div>
              <strong class="text-dark d-block font-display" style="font-size: 14px;">${item.name}</strong>
              <span class="fw-bold text-dark font-sans d-block mt-0.5" style="font-size: 13px;">₹${item.price}</span>
              <p class="text-muted small m-0 mt-2 lh-base line-clamp-2" style="font-size: 11px;">${item.description}</p>
              
              <!-- Cart quantity switchers -->
              <div class="mt-4">
                ${quantity > 0 ? `
                  <div class="d-inline-flex align-items-center border rounded bg-white p-0.5" style="border-color: #ea580c !important;">
                    <button class="btn btn-sm btn-link text-decoration-none text-saffron fw-bold p-0 px-2.5 border-0 bg-transparent menu-qty-btn" data-id="${item.id}" data-change="-1">-</button>
                    <span class="small fw-bold px-1.5 text-dark" style="font-size: 12px;">${quantity}</span>
                    <button class="btn btn-sm btn-link text-decoration-none text-saffron fw-bold p-0 px-2.5 border-0 bg-transparent menu-qty-btn" data-id="${item.id}" data-change="1">+</button>
                  </div>
                ` : `
                  <button class="btn btn-sm btn-outline-saffron px-3.5 py-1.5 fw-bold rounded menu-add-btn" data-id="${item.id}" style="font-size: 11px;">
                    <i class="bi bi-plus-lg me-1"></i>ADD TO BAG
                  </button>
                `}
              </div>
            </div>

            <!-- Image Panel (Optional fallback if empty) -->
            ${item.image ? `
              <div class="shrink-0 rounded-3 border overflow-hidden shadow-xs" style="width: 110px; height: 110px; border-color: #f1f1f4;">
                <img src="${item.image}" alt="${item.name}" class="w-100 h-100 object-cover" style="object-fit: cover;">
              </div>
            ` : `
              <div class="shrink-0 rounded-3 border overflow-hidden bg-light d-flex align-items-center justify-content-center text-muted" style="width: 110px; height: 110px; border-color: #f1f1f4; background-color: #fafafa;">
                <i class="bi bi-egg-fried fs-3 text-secondary opacity-30"></i>
              </div>
            `}

          </div>
        </div>
      </div>
    `;
  }).join('');

  
  grid.querySelectorAll('.menu-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.currentTarget.getAttribute('data-id') || '';
      const selectedItem = rest.menu.find(m => m.id === itemId);
      if (selectedItem) {
        addToCart(selectedItem, rest);
      }
    });
  });

  
  grid.querySelectorAll('.menu-qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const itemId = target.getAttribute('data-id') || '';
      const change = parseInt(target.getAttribute('data-change') || '0');
      updateCartQuantity(itemId, change);
    });
  });

  
  const reviewsContainer = document.getElementById("menu-reviews-container");
  const reviewsSummaryBadge = document.getElementById("menu-reviews-summary-badge");
  
  if (reviewsContainer) {
    const restReviews = state.reviews.filter(r => r.restaurantId === rest.id);
    
    if (reviewsSummaryBadge) {
      reviewsSummaryBadge.innerText = `${restReviews.length} Verified Review${restReviews.length === 1 ? '' : 's'}`;
      reviewsSummaryBadge.className = `badge ${restReviews.length > 0 ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-10' : 'bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10'} px-3 py-2 rounded-pill small`;
    }

    if (restReviews.length === 0) {
      reviewsContainer.innerHTML = `
        <div class="col-12 py-4 text-center text-muted bg-light border rounded-3">
          <i class="bi bi-chat-left-heart fs-3 text-secondary opacity-40 mb-2 d-block text-saffron" style="color: #ea580c;"></i>
          <h6 class="fw-bold text-dark m-0">No reviews yet</h6>
          <p class="text-muted small m-0 mt-1">Be the first verified Nawab to order and write a review!</p>
        </div>
      `;
    } else {
      reviewsContainer.innerHTML = restReviews.map(rev => {
        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
          if (i <= rev.rating) {
            starsHtml += `<i class="bi bi-star-fill text-warning me-0.5" style="font-size: 13px;"></i>`;
          } else {
            starsHtml += `<i class="bi bi-star text-secondary me-0.5" style="font-size: 13px;"></i>`;
          }
        }
        
        return `
          <div class="col-md-6">
            <div class="card p-3 border rounded-3 bg-white shadow-xs text-start h-100">
              <div class="d-flex justify-content-between align-items-center mb-2.5">
                <div>
                  <strong class="text-dark d-block font-display" style="font-size: 13.5px;">${rev.customerName}</strong>
                  <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10 text-[9px] px-2 py-0.5 mt-1" style="font-size: 9px;">
                    <i class="bi bi-patch-check-fill me-0.5"></i> Verified Nawab
                  </span>
                </div>
                <div class="text-end">
                  <div class="d-flex align-items-center mb-1">
                    ${starsHtml}
                  </div>
                  <span class="text-muted" style="font-size: 10px;">${rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Order'}</span>
                </div>
              </div>
              <p class="text-muted small m-0 lh-base" style="font-size: 12px; font-style: italic;">"${rev.reviewText}"</p>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function addToCart(item, targetRestaurant) {
  const currentRestId = getCartRestaurantId();
  if (currentRestId && currentRestId !== targetRestaurant.id) {
    state.conflictItem = { item, restaurant: targetRestaurant };
    const conflictModalEl = document.getElementById("conflict-modal");
    if (conflictModalEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(conflictModalEl);
      modal.show();
    }
    return;
  }

  const existing = state.cartItems.find(c => c.menuItem.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cartItems.push({ menuItem: item, quantity: 1 });
  }

  saveState();
  renderMenu();
  renderHeader();
  renderCartDrawer();
}

function updateCartQuantity(itemId, change) {
  const existing = state.cartItems.find(c => c.menuItem.id === itemId);
  if (existing) {
    existing.quantity += change;
    if (existing.quantity <= 0) {
      state.cartItems = state.cartItems.filter(c => c.menuItem.id !== itemId);
    }
  }

  saveState();
  renderMenu();
  renderHeader();
  renderCartDrawer();
}




export function renderCartDrawer() {
  const scrollContent = document.getElementById("cart-scroll-content");
  const billingPanel = document.getElementById("cart-billing-panel");
  if (!scrollContent || !billingPanel) return;

  const activeRest = getCartRestaurant();

  if (state.cartItems.length === 0) {
    scrollContent.innerHTML = `
      <div class="py-5 text-center my-4">
        <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3.5" style="width: 56px; height: 56px;">
          <i class="bi bi-cart3 text-muted fs-4"></i>
        </div>
        <h6 class="font-display fw-bold text-dark mb-1">Your bag is empty</h6>
        <p class="text-muted small mx-auto mb-4" style="max-width: 250px;">
          Explore culinary kitchens to load your shopping bag with Lucknow's finest.
        </p>
        <button class="btn btn-sm btn-saffron rounded-pill px-4" data-bs-dismiss="offcanvas">
          Browse Delicacies
        </button>
      </div>
    `;
    billingPanel.classList.add('d-none');
    return;
  }

  billingPanel.classList.remove('d-none');

  let itemsHTML = `
    <!-- Restaurant Source Title Header -->
    <div class="pb-3 border-bottom mb-4 text-start">
      <span class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 8px; letter-spacing: 0.5px;">Ordering Fresh From</span>
      <h6 class="font-display fw-bold text-dark m-0 fs-6">${activeRest?.name}</h6>
      <span class="text-muted small mt-0.5 d-inline-flex align-items-center gap-1">
        <i class="bi bi-geo-alt-fill text-danger"></i>${activeRest?.locality}
      </span>
    </div>

    <!-- Items Array list -->
    <div class="d-flex flex-column gap-3.5 text-start">
  `;

  itemsHTML += state.cartItems.map(item => `
    <div class="d-flex align-items-center justify-content-between gap-3">
      <div class="text-start">
        <strong class="d-block text-dark small font-display">${item.menuItem.name}</strong>
        <span class="text-muted small font-sans">₹${item.menuItem.price} &times; ${item.quantity}</span>
      </div>
      
      <!-- Stepper Controls -->
      <div class="d-flex align-items-center gap-2">
        <div class="d-flex align-items-center border rounded bg-white p-0.5">
          <button class="btn btn-sm btn-link text-decoration-none text-muted fw-bold p-0 px-2 border-0 bg-transparent cart-qty-btn" data-id="${item.menuItem.id}" data-change="-1">-</button>
          <span class="small fw-bold px-1 text-dark" style="font-size: 12px;">${item.quantity}</span>
          <button class="btn btn-sm btn-link text-decoration-none text-muted fw-bold p-0 px-2 border-0 bg-transparent cart-qty-btn" data-id="${item.menuItem.id}" data-change="1">+</button>
        </div>
        
        <!-- Delete item trigger -->
        <button class="btn btn-light rounded border p-0 d-flex align-items-center justify-content-center text-danger cart-delete-btn" 
                data-id="${item.menuItem.id}" 
                style="width: 28px; height: 28px; border: 0;">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

  itemsHTML += `
    </div>

    <!-- Saffron Promo Coupons Area -->
    <div class="mt-5 border-top pt-4 text-start">
      <h6 class="text-uppercase text-muted fw-bold mb-2.5" style="font-size: 9px; letter-spacing: 0.5px;">Promo Code Offers</h6>
      <div class="input-group input-group-sm">
        <input type="text" id="cart-coupon-input" placeholder="Enter coupon (e.g. LUCKNOW100)" class="form-control" style="font-size: 11.5px;" value="${state.appliedCoupon ? state.appliedCoupon.code : ''}" ${state.appliedCoupon ? 'disabled' : ''}>
        <button type="button" id="cart-coupon-apply" class="btn ${state.appliedCoupon ? 'btn-danger' : 'btn-dark'} fw-bold px-3">
          ${state.appliedCoupon ? 'Remove' : 'Apply'}
        </button>
      </div>
      <div id="cart-coupon-status" class="small mt-1.5 fw-semibold ${state.appliedCoupon ? 'text-success' : 'text-danger'}">
        ${state.appliedCoupon ? `<i class="bi bi-check-circle-fill me-1"></i>Coupon "${state.appliedCoupon.code}" applied! Save ₹${getBillingDetails().discount}` : ''}
      </div>
    </div>
  `;

  scrollContent.innerHTML = itemsHTML;

  const billing = getBillingDetails();
  
  const elSubtotal = document.getElementById("cart-calc-subtotal");
  const elDiscountRow = document.getElementById("cart-discount-row");
  const elDiscount = document.getElementById("cart-calc-discount");
  const elDelivery = document.getElementById("cart-calc-delivery");
  const elTax = document.getElementById("cart-calc-tax");
  const elTotal = document.getElementById("cart-calc-total");

  if (elSubtotal) elSubtotal.innerText = `₹${billing.subtotal}`;
  
  if (elDiscountRow && elDiscount) {
    if (billing.discount > 0) {
      elDiscountRow.classList.remove('d-none');
      elDiscount.innerText = `-₹${billing.discount}`;
    } else {
      elDiscountRow.classList.add('d-none');
    }
  }

  if (elDelivery) elDelivery.innerText = `₹${billing.deliveryFee}`;
  if (elTax) elTax.innerText = `₹${billing.taxAndFees}`;
  if (elTotal) elTotal.innerText = `₹${billing.total}`;

  
  scrollContent.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const id = target.getAttribute('data-id') || '';
      const change = parseInt(target.getAttribute('data-change') || '0');
      updateCartQuantity(id, change);
    });
  });

  scrollContent.querySelectorAll('.cart-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const id = target.getAttribute('data-id') || '';
      state.cartItems = state.cartItems.filter(c => c.menuItem.id !== id);
      saveState();
      renderMenu();
      renderHeader();
      renderCartDrawer();
    });
  });

  
  document.getElementById("cart-coupon-apply")?.addEventListener('click', () => {
    if (state.appliedCoupon) {
      state.appliedCoupon = null;
      renderCartDrawer();
      return;
    }

    const input = document.getElementById("cart-coupon-input");
    const statusEl = document.getElementById("cart-coupon-status");
    if (!input || !statusEl) return;

    const code = input.value.toUpperCase().trim();
    if (!code) return;

    const coupon = AVAILABLE_COUPONS.find(c => c.code === code);
    if (!coupon) {
      statusEl.classList.remove('text-success');
      statusEl.classList.add('text-danger');
      statusEl.innerHTML = `<i class="bi bi-x-circle-fill me-1"></i>Invalid coupon code. Try "LUCKNOW100".`;
      return;
    }

    const billingTemp = getBillingDetails();
    if (billingTemp.subtotal < coupon.minOrder) {
      statusEl.classList.remove('text-success');
      statusEl.classList.add('text-danger');
      statusEl.innerHTML = `<i class="bi bi-info-circle-fill me-1"></i>Order amount must be above ₹${coupon.minOrder} to apply.`;
      return;
    }

    state.appliedCoupon = coupon;
    renderCartDrawer();
  });
}




export function openOrderDetailsModal(orderId) {
  const order = state.orderHistory.find(o => o.id === orderId);
  if (!order) return;

  const idEl = document.getElementById("detail-order-id");
  const restNameEl = document.getElementById("detail-restaurant-name");
  const dateEl = document.getElementById("detail-order-date");
  const statusEl = document.getElementById("detail-order-status");
  const containerEl = document.getElementById("detail-items-container");
  const subtotalEl = document.getElementById("detail-subtotal");
  const deliveryEl = document.getElementById("detail-delivery");
  const cgstEl = document.getElementById("detail-cgst");
  const sgstEl = document.getElementById("detail-sgst");
  const packagingEl = document.getElementById("detail-packaging");
  const discountRow = document.getElementById("detail-discount-row");
  const discountEl = document.getElementById("detail-discount");
  const totalEl = document.getElementById("detail-total");
  const addressEl = document.getElementById("detail-address");
  const paymentEl = document.getElementById("detail-payment-method");

  if (idEl) idEl.innerText = `Order #${order.id.toUpperCase()}`;
  if (restNameEl) restNameEl.innerText = order.restaurantName;
  if (dateEl) dateEl.innerText = order.date;

  if (statusEl) {
    statusEl.innerText = order.status;
    statusEl.className = "badge px-2.5 py-1.5 text-uppercase ";
    if (order.status === 'delivered') {
      statusEl.classList.add("bg-success-subtle", "text-success", "border", "border-success-subtle");
    } else {
      statusEl.classList.add("bg-danger", "text-white", "animate-pulse");
    }
  }

  if (containerEl) {
    containerEl.innerHTML = order.items.map(item => `
      <div class="d-flex align-items-center justify-content-between py-2.5 border-bottom border-light">
        <div class="d-flex align-items-center gap-2.5">
          <span class="d-inline-flex align-items-center justify-content-center border rounded" 
                style="width: 14px; height: 14px; padding: 2px; border-color: ${item.menuItem.isVeg ? '#22c55e' : '#ef4444'};">
            <span class="rounded-circle" style="width: 6px; height: 6px; background-color: ${item.menuItem.isVeg ? '#22c55e' : '#ef4444'};"></span>
          </span>
          <div>
            <span class="fw-bold text-dark font-display" style="font-size: 13.5px;">${item.menuItem.name}</span>
            <span class="text-muted d-block font-mono" style="font-size: 11px;">₹${item.menuItem.price} &times; ${item.quantity}</span>
          </div>
        </div>
        <strong class="text-dark font-sans" style="font-size: 13.5px;">₹${item.menuItem.price * item.quantity}</strong>
      </div>
    `).join('');
  }

  const gstRate = 0.05;
  const calculatedGst = order.subtotal * gstRate;
  const cgst = calculatedGst / 2;
  const sgst = calculatedGst / 2;
  const packagingCharge = Math.max(0, order.taxAndFees - calculatedGst);

  if (subtotalEl) subtotalEl.innerText = `₹${order.subtotal}`;
  if (deliveryEl) deliveryEl.innerText = `₹${order.deliveryFee}`;
  if (cgstEl) cgstEl.innerText = `₹${cgst.toFixed(2)}`;
  if (sgstEl) sgstEl.innerText = `₹${sgst.toFixed(2)}`;
  if (packagingEl) packagingEl.innerText = `₹${packagingCharge.toFixed(2)}`;

  if (order.discount > 0) {
    if (discountRow) discountRow.classList.remove("d-none");
    if (discountEl) discountEl.innerText = `-₹${order.discount}`;
  } else {
    if (discountRow) discountRow.classList.add("d-none");
  }

  if (totalEl) totalEl.innerText = `₹${order.total}`;
  if (addressEl) addressEl.innerText = state.userProfile.address || order.eta;
  if (paymentEl) {
    let pm = order.paymentMethod;
    if (pm === 'cod') pm = 'Cash on Delivery';
    else if (pm === 'card') pm = 'Credit / Debit Card';
    else if (pm === 'upi') pm = 'UPI Payment';
    paymentEl.innerText = pm;
  }

  const modalEl = document.getElementById("order-details-modal");
  if (modalEl) {
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

export function renderProfile() {
  const displayName = document.getElementById("profile-display-name");
  const readEmail = document.getElementById("profile-read-email");
  const readPhone = document.getElementById("profile-read-phone");
  const readAddress = document.getElementById("profile-read-address");

  if (displayName) displayName.innerText = state.userProfile.name;
  if (readEmail) readEmail.innerHTML = `<i class="bi bi-envelope text-muted me-2"></i>${state.userProfile.email}`;
  if (readPhone) readPhone.innerHTML = `<i class="bi bi-telephone text-muted me-2"></i>${state.userProfile.phone}`;
  if (readAddress) readAddress.innerHTML = `<i class="bi bi-geo-alt text-danger me-2"></i>${state.userProfile.address}`;

  const countTitle = document.getElementById("profile-orders-count");
  if (countTitle) countTitle.innerText = `${state.orderHistory.length} total orders`;

  const list = document.getElementById("profile-orders-list");
  if (!list) return;

  if (state.orderHistory.length === 0) {
    list.innerHTML = `
      <div class="py-5 text-center bg-light border border-dashed rounded-3 p-4">
        <i class="bi bi-receipt text-muted fs-2 mb-2 d-block"></i>
        <h6 class="fw-bold text-dark mb-1">No orders found</h6>
        <p class="text-muted small m-0 mb-3">You haven't placed any royal orders with Lakhnawi Bites yet!</p>
        <button class="btn btn-sm btn-saffron rounded-pill px-4 profile-shop-now-btn">Order Now</button>
      </div>
    `;

    list.querySelector('.profile-shop-now-btn')?.addEventListener('click', () => {
      navigateTo('home');
    });
    return;
  }

  list.innerHTML = state.orderHistory.map(order => {
    const isActive = order.status !== 'delivered';
    const itemsText = order.items.map(item => `${item.menuItem.name} (${item.quantity})`).join(', ');

    return `
      <div class="card p-4 border rounded-3 text-start bg-white shadow-xs">
        <div class="d-flex flex-wrap justify-content-between align-items-center pb-3 border-bottom mb-3.5 gap-2">
          <div>
            <span class="badge bg-dark border text-uppercase font-mono text-[9px] me-2" style="font-size: 10px;">${order.id}</span>
            <span class="text-muted small">${order.date}</span>
          </div>
          <span class="badge ${order.status === 'delivered' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-10' : 'bg-danger text-white animate-pulse'} px-2.5 py-1.5 text-uppercase" style="font-size: 11px;">
            ${order.status}
          </span>
        </div>

        <div class="mb-3.5 text-start">
          <span class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 8px; letter-spacing: 0.5px;">Eatery Kitchen</span>
          <strong class="text-dark d-block font-display fs-6">${order.restaurantName}</strong>
          <span class="text-muted small d-block mt-1">${itemsText}</span>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pt-3 border-top gap-3">
          <div>
            <span class="text-uppercase text-muted fw-bold d-block" style="font-size: 8px; letter-spacing: 0.5px;">Amount Paid</span>
            <strong class="text-dark d-block fs-6 font-sans mt-0.5">₹${order.total}</strong>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-sm btn-outline-secondary px-3.5 py-2 fw-semibold text-muted d-inline-flex align-items-center gap-1.5 rounded view-details-profile-btn" data-id="${order.id}">
              <i class="bi bi-receipt"></i>
              <span>View Invoice</span>
            </button>

            ${isActive ? `
              <button class="btn btn-sm btn-saffron px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-1.5 rounded tracking-profile-btn" data-id="${order.id}">
                <i class="bi bi-geo-alt-fill text-white"></i>
                <span>Live Track</span>
              </button>
            ` : `
              <button class="btn btn-sm btn-warning bg-warning bg-opacity-10 text-warning border border-warning border-opacity-10 px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 rounded rate-review-profile-btn" data-order-id="${order.id}" data-restaurant-id="${order.restaurantId}" data-restaurant-name="${order.restaurantName}">
                <i class="bi bi-star-fill text-warning"></i>
                <span>Rate & Review</span>
              </button>
              <button class="btn btn-sm btn-light border px-3.5 py-2 fw-semibold text-muted d-inline-flex align-items-center gap-1.5 rounded reorder-profile-btn" data-id="${order.restaurantId}">
                <i class="bi bi-arrow-repeat"></i>
                <span>Order Again</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.view-details-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const orderId = e.currentTarget.getAttribute('data-id');
      if (orderId) {
        openOrderDetailsModal(orderId);
      }
    });
  });

  list.querySelectorAll('.tracking-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.activeOrderId = e.currentTarget.getAttribute('data-id');
      saveState();
      navigateTo('tracking');
    });
  });

  list.querySelectorAll('.reorder-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      state.selectedRestaurantId = e.currentTarget.getAttribute('data-id');
      navigateTo('menu');
    });
  });

  list.querySelectorAll('.rate-review-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const btnEl = e.currentTarget;
      const orderId = btnEl.getAttribute('data-order-id');
      const restaurantId = btnEl.getAttribute('data-restaurant-id');
      const restaurantName = btnEl.getAttribute('data-restaurant-name');

      
      const inputRestId = document.getElementById("review-restaurant-id");
      const inputOrderId = document.getElementById("review-order-id");
      const modalSubtitle = document.getElementById("review-modal-subtitle");
      
      if (inputRestId) inputRestId.value = restaurantId;
      if (inputOrderId) inputOrderId.value = orderId;
      if (modalSubtitle) modalSubtitle.innerText = `Share your experience with ${restaurantName}`;

      
      const stars = document.querySelectorAll("#star-rating-container .star-btn");
      stars.forEach(s => {
        s.className = "bi bi-star star-btn text-secondary";
      });
      
      const ratingValue = document.getElementById("review-rating-value");
      if (ratingValue) ratingValue.value = "";

      const textFeedback = document.getElementById("rating-text-feedback");
      if (textFeedback) textFeedback.innerText = "Choose 1 to 5 stars";

      const textInput = document.getElementById("review-text-input");
      if (textInput) textInput.value = "";

      
      const errMsg = document.getElementById("review-error-msg");
      if (errMsg) errMsg.classList.add("d-none");
      const successMsg = document.getElementById("review-success-msg");
      if (successMsg) successMsg.classList.add("d-none");

      
      const modalEl = document.getElementById("rate-review-modal");
      if (modalEl) {
        const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
      }
    });
  });
}




export function renderOrderTracking() {
  const order = state.orderHistory.find(o => o.id === state.activeOrderId);
  if (!order) {
    navigateTo('home');
    return;
  }

  const deliveryAddressEl = document.getElementById("tracking-delivery-address");
  if (deliveryAddressEl) {
    deliveryAddressEl.innerText = order.restaurantId === "idris-chowk" 
      ? "Chowk Road crossing, Hazratganj Bypass, Lucknow, UP." 
      : "Aminabad Bypass, Gomti Nagar Crossing, Lucknow, UP.";
  }

  const ffBtn = document.getElementById("tracking-fast-forward");
  if (ffBtn) {
    if (order.status === "delivered") {
      ffBtn.disabled = true;
      ffBtn.classList.add('disabled', 'opacity-50');
    } else {
      ffBtn.disabled = false;
      ffBtn.classList.remove('disabled', 'opacity-50');
    }
  }

  const rateBtn = document.getElementById("tracking-rate-btn");
  if (rateBtn) {
    if (order.status === "delivered") {
      rateBtn.classList.remove('d-none');
      rateBtn.classList.add('d-flex');
      rateBtn.onclick = () => {
        const inputRestId = document.getElementById("review-restaurant-id");
        const inputOrderId = document.getElementById("review-order-id");
        const modalSubtitle = document.getElementById("review-modal-subtitle");
        
        if (inputRestId) inputRestId.value = order.restaurantId;
        if (inputOrderId) inputOrderId.value = order.id;
        if (modalSubtitle) modalSubtitle.innerText = `Share your experience with ${order.restaurantName}`;

        const stars = document.querySelectorAll("#star-rating-container .star-btn");
        stars.forEach(s => {
          s.className = "bi bi-star star-btn text-secondary";
        });
        
        const ratingValue = document.getElementById("review-rating-value");
        if (ratingValue) ratingValue.value = "";

        const textFeedback = document.getElementById("rating-text-feedback");
        if (textFeedback) textFeedback.innerText = "Choose 1 to 5 stars";

        const textInput = document.getElementById("review-text-input");
        if (textInput) textInput.value = "";

        const errMsg = document.getElementById("review-error-msg");
        if (errMsg) errMsg.classList.add("d-none");
        const successMsg = document.getElementById("review-success-msg");
        if (successMsg) successMsg.classList.add("d-none");

        const modalEl = document.getElementById("rate-review-modal");
        if (modalEl) {
          const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          modalInstance.show();
        }
      };
    } else {
      rateBtn.classList.add('d-none');
      rateBtn.classList.remove('d-flex');
    }
  }

  const etaVal = document.getElementById("tracking-eta-val");
  const statusBadge = document.getElementById("tracking-status-badge");
  
  if (etaVal) {
    if (order.status === "delivered") {
      etaVal.innerText = "Arrived!";
    } else if (order.status === "dispatched") {
      etaVal.innerText = "12 Mins";
    } else if (order.status === "preparing") {
      etaVal.innerText = "20 Mins";
    } else {
      etaVal.innerText = "30 Mins";
    }
  }

  if (statusBadge) {
    statusBadge.innerText = order.status;
    statusBadge.className = `badge border text-uppercase ${
      order.status === 'delivered' ? 'bg-success' : 'bg-dark'
    }`;
  }

  const stepsDef = ['confirmed', 'preparing', 'dispatched', 'delivered'];
  const activeIdx = stepsDef.indexOf(order.status);

  for (let i = 1; i <= 4; i++) {
    const idx = i - 1;
    const stepEl = document.getElementById(`tracking-step-${i}`);
    if (stepEl) {
      const node = stepEl.querySelector('.step-node');
      const title = stepEl.querySelector('.step-title');
      
      if (node && title) {
        if (idx < activeIdx) {
          node.className = "step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0 bg-danger border-danger text-white";
          title.className = "fw-bold mb-1 step-title text-dark";
        } else if (idx === activeIdx) {
          node.className = "step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0 bg-dark border-dark text-white shadow";
          title.className = "fw-bold mb-1 step-title text-danger";
        } else {
          node.className = "step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0 bg-white text-muted border-secondary-subtle";
          title.className = "fw-bold mb-1 step-title text-muted";
        }
      }
    }
  }

  setTimeout(() => {
    initializeTrackingMap(order);
  }, 100);
}

function getRiderLatLng(status) {
  switch (status) {
    case "confirmed":
      return { lat: 26.8415, lng: 80.9248 };
    case "preparing":
      return { lat: 26.8462, lng: 80.9344 };
    case "dispatched":
      return { lat: 26.8568, lng: 80.9632 };
    case "delivered":
      return { lat: 26.8600, lng: 81.0000 };
    default:
      return { lat: 26.8415, lng: 80.9248 };
  }
}

function initializeTrackingMap(order) {
  const container = document.getElementById('map-container');
  if (!container) return;

  const riderLatLng = getRiderLatLng(order.status);
  const activeStepIdx = ['confirmed', 'preparing', 'dispatched', 'delivered'].indexOf(order.status);

  if (state.mapInstance) {
    state.mapMarkers.forEach(m => m.remove());
    state.mapMarkers = [];
    if (state.mapPolyline) state.mapPolyline.remove();
    if (state.mapRiderMarker) state.mapRiderMarker.remove();

    state.mapInstance.panTo([riderLatLng.lat, riderLatLng.lng]);
  } else {
    state.mapInstance = window.L.map(container, {
      center: [26.8510, 80.9550],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(state.mapInstance);
  }

  googleMapNodes.forEach((node, idx) => {
    const isCompletedOrActive = idx <= activeStepIdx;
    const markerColor = isCompletedOrActive ? "#ea580c" : "#71717a";
    const markerBorder = isCompletedOrActive ? "#ffffff" : "#e4e4e7";

    const customIcon = window.L.divIcon({
      html: `
        <div style="
          width: 16px; 
          height: 16px; 
          background-color: ${markerColor}; 
          border: 2px solid ${markerBorder}; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 4px; height: 4px; background-color: white; border-radius: 50%;"></div>
        </div>
      `,
      className: 'custom-leaflet-node-icon',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const marker = window.L.marker([node.position.lat, node.position.lng], { icon: customIcon })
      .addTo(state.mapInstance)
      .bindPopup(`
        <div class="p-1 font-sans text-xs">
          <strong class="text-zinc-950 block font-bold" style="font-size: 11.5px; color:#18181b;">${node.name}</strong>
          <span class="text-muted" style="font-size: 9.5px;">${idx === 0 ? "Starting Kitchen" : idx === googleMapNodes.length - 1 ? "Delivery Destination" : "Transit Waypoint"}</span>
        </div>
      `);
    
    state.mapMarkers.push(marker);
  });

  const latlngs = googleMapNodes.map(n => [n.position.lat, n.position.lng]);
  state.mapPolyline = window.L.polyline(latlngs, {
    color: "#ea580c",
    weight: 4,
    opacity: 0.8,
    dashArray: "6, 6"
  }).addTo(state.mapInstance);

  const riderIcon = window.L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: #ea580c;
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 10px rgba(234, 88, 12, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        animation: pulse-ring-leaflet 1.5s infinite;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
      <style>
        @keyframes pulse-ring-leaflet {
          0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(234, 88, 12, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
        }
      </style>
    `,
    className: 'custom-leaflet-rider-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  state.mapRiderMarker = window.L.marker([riderLatLng.lat, riderLatLng.lng], { icon: riderIcon })
    .addTo(state.mapInstance)
    .bindPopup(`
      <div class="p-1 font-sans text-xs">
        <strong class="text-zinc-950 block font-bold" style="font-size: 11px; color:#18181b;">Ramesh Kumar (Your Rider)</strong>
        <span class="text-danger fw-bold" style="font-size: 9.5px;">On the way with your Awadhi meal!</span>
      </div>
    `);

  state.mapInstance.panTo([riderLatLng.lat, riderLatLng.lng]);
}




export function renderPortalLanding() {
  const custSelect = document.getElementById("landing-customer-select");
  const restSelect = document.getElementById("landing-restaurant-select");

  if (custSelect) {
    custSelect.innerHTML = state.customerProfiles.map(p => `
      <option value="${p.id}" ${p.id === state.currentCustomerId ? 'selected' : ''}>${p.name} (${p.locality})</option>
    `).join('');
  }

  if (restSelect) {
    restSelect.innerHTML = state.restaurants.map(r => `
      <option value="${r.id}" ${r.id === state.currentRestaurantId ? 'selected' : ''}>${r.name} (${r.locality})</option>
    `).join('');
  }
}




export function renderRestaurantWorkspace() {
  const activeRest = state.restaurants.find(r => r.id === state.currentRestaurantId);
  if (!activeRest) {
    navigateTo('portal-landing');
    return;
  }

  const titleEl = document.getElementById("rest-owner-title");
  const descEl = document.getElementById("rest-owner-desc");
  const bannerEl = document.getElementById("rest-owner-hero-img");

  if (titleEl) titleEl.innerText = activeRest.name;
  if (descEl) descEl.innerText = activeRest.description;
  if (bannerEl) bannerEl.src = activeRest.banner;

  const matchedOrders = state.orderHistory.filter(o => o.restaurantId === state.currentRestaurantId);
  const pendingOrders = matchedOrders.filter(o => o.status !== 'delivered');
  const revenue = matchedOrders.reduce((acc, o) => acc + o.total, 0);

  const statOrders = document.getElementById("rest-stat-orders");
  const statPending = document.getElementById("rest-stat-pending");
  const statRevenue = document.getElementById("rest-stat-revenue");
  const statMenuCount = document.getElementById("rest-stat-menu-count");

  if (statOrders) statOrders.innerText = matchedOrders.length.toString();
  if (statPending) statPending.innerText = pendingOrders.length.toString();
  if (statRevenue) statRevenue.innerText = `₹${revenue}`;
  if (statMenuCount) statMenuCount.innerText = activeRest.menu.length.toString();

  const ordersListEl = document.getElementById("rest-orders-queue-list");
  if (ordersListEl) {
    if (matchedOrders.length === 0) {
      ordersListEl.innerHTML = `
        <div class="py-5 text-center bg-white border rounded-3 p-4">
          <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 52px; height: 52px;">
            <i class="bi bi-receipt text-muted fs-4"></i>
          </div>
          <h6 class="font-display fw-bold text-dark mb-1">No orders received yet</h6>
          <p class="text-muted small mx-auto m-0" style="max-width: 320px;">
            Once Lucknow foodies place orders for your kitchen, they will appear in real-time here.
          </p>
        </div>
      `;
    } else {
      ordersListEl.innerHTML = matchedOrders.map(order => {
        let statusBadge = "";
        let actionBtn = "";

        if (order.status === 'confirmed') {
          statusBadge = `<span class="badge bg-warning text-dark fw-bold" style="font-size: 10px;">PENDING ACCEPTANCE</span>`;
          actionBtn = `
            <button class="btn btn-sm btn-saffron px-3 py-1.5 fw-bold rest-order-action-btn" data-order-id="${order.id}" data-action="accept">
              Accept & Cook
            </button>
          `;
        } else if (order.status === 'preparing') {
          statusBadge = `<span class="badge bg-info text-dark fw-bold" style="font-size: 10px;">COOKING IN PROGRESS</span>`;
          actionBtn = `
            <button class="btn btn-sm btn-dark px-3 py-1.5 fw-bold rest-order-action-btn" data-order-id="${order.id}" data-action="dispatch">
              Dispatch Order
            </button>
          `;
        } else if (order.status === 'dispatched') {
          statusBadge = `<span class="badge bg-primary text-white fw-bold" style="font-size: 10px;">OUT FOR DELIVERY</span>`;
          actionBtn = `
            <button class="btn btn-sm btn-success px-3 py-1.5 fw-bold rest-order-action-btn" data-order-id="${order.id}" data-action="deliver">
              Mark Delivered
            </button>
          `;
        } else {
          statusBadge = `<span class="badge bg-success text-white fw-bold" style="font-size: 10px;">DELIVERED & CLOSED</span>`;
          actionBtn = `<span class="text-muted small fw-semibold"><i class="bi bi-check-all text-success"></i> Completed</span>`;
        }

        const itemsSummary = order.items.map(item => `
          <div class="d-flex justify-content-between align-items-center small py-1 border-bottom border-light">
            <span class="text-dark fw-semibold">${item.menuItem.name} <span class="text-muted fw-normal">x${item.quantity}</span></span>
            <span class="text-muted">₹${item.menuItem.price * item.quantity}</span>
          </div>
        `).join('');

        return `
          <div class="card border rounded-3 p-4 bg-white shadow-xs">
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-3 border-bottom border-light gap-3">
              <div>
                <strong class="text-dark font-sans d-block" style="font-size: 14px;">Order #${order.id}</strong>
                <span class="text-muted small d-block mt-0.5"><i class="bi bi-clock me-1"></i>${order.date} | Payment: ${order.paymentMethod}</span>
              </div>
              <div class="d-flex align-items-center gap-3">
                ${statusBadge}
                <div class="rest-action-wrapper">
                  ${actionBtn}
                </div>
              </div>
            </div>
            
            <div class="row pt-3 g-3">
              <div class="col-md-7">
                <span class="text-uppercase text-muted fw-bold d-block mb-2" style="font-size: 8px; letter-spacing: 0.5px;">Ordered Recipes</span>
                <div class="d-flex flex-column gap-1">
                  ${itemsSummary}
                  <div class="d-flex justify-content-between align-items-center mt-2 fw-bold text-dark small">
                    <span>Total Bill (incl. Taxes)</span>
                    <span style="font-size: 14px;">₹${order.total}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-5 bg-light p-3 rounded-3 border">
                <span class="text-uppercase text-muted fw-bold d-block mb-1.5" style="font-size: 8px; letter-spacing: 0.5px;">Customer Delivery Location</span>
                <strong class="d-block text-dark small"><i class="bi bi-person-fill text-muted me-1"></i>${state.userProfile.name}</strong>
                <p class="text-muted small m-0 mt-1 lh-base"><i class="bi bi-geo-alt-fill text-danger me-1"></i>${state.userProfile.address}</p>
                <span class="text-muted small d-block mt-1.5"><i class="bi bi-telephone-fill text-muted me-1"></i>${state.userProfile.phone}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      ordersListEl.querySelectorAll('.rest-order-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget;
          const orderId = target.getAttribute('data-order-id') || '';
          const action = target.getAttribute('data-action') || '';
          
          const targetOrder = state.orderHistory.find(o => o.id === orderId);
          if (targetOrder) {
            if (action === 'accept') {
              targetOrder.status = 'preparing';
              targetOrder.trackingStep = 2;
            } else if (action === 'dispatch') {
              targetOrder.status = 'dispatched';
              targetOrder.trackingStep = 3;
            } else if (action === 'deliver') {
              targetOrder.status = 'delivered';
              targetOrder.trackingStep = 4;
            }

            updateOrderStatusOnServer(orderId, targetOrder.status, targetOrder.trackingStep);
            saveState();
            renderRestaurantWorkspace();
          }
        });
      });
    }
  }

  const catalogTbody = document.getElementById("rest-menu-catalog-tbody");
  if (catalogTbody) {
    catalogTbody.innerHTML = activeRest.menu.map(item => {
      const isVegIcon = item.isVeg 
        ? `<i class="bi bi-dot border border-success rounded text-success fs-4 px-0.5 py-0 line-height-1 bg-success bg-opacity-5" title="Veg"></i>` 
        : `<i class="bi bi-dot border border-danger rounded text-danger fs-4 px-0.5 py-0 line-height-1 bg-danger bg-opacity-5" title="Non-Veg"></i>`;

      return `
        <tr data-item-id="${item.id}">
          <td>
            <div style="width: 40px; height: 40px;" class="bg-light rounded overflow-hidden shrink-0 border">
              <img src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=80'}" alt="${item.name}" class="w-100 h-100 object-cover" style="object-fit: cover;">
            </div>
          </td>
          <td>
            <div class="d-flex align-items-center gap-1.5">
              ${isVegIcon}
              <strong class="text-dark d-block" style="font-size: 13.5px;">${item.name}</strong>
              <span class="badge bg-light border text-muted px-2 py-0.5" style="font-size: 9px;">${item.category}</span>
            </div>
            <p class="text-muted small m-0 mt-0.5 line-clamp-1" style="max-width: 320px;">${item.description}</p>
          </td>
          <td>
            <div class="input-group input-group-sm" style="max-width: 90px;">
              <span class="input-group-text bg-white border-end-0 text-muted px-1.5" style="font-size: 11px;">₹</span>
              <input type="number" class="form-control text-center py-1 font-sans fw-bold rest-item-price-input" data-id="${item.id}" value="${item.price}" style="font-size: 12px;" />
            </div>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-danger py-1 px-2.5 rest-delete-item-btn" data-id="${item.id}" style="font-size: 11.5px;">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    catalogTbody.querySelectorAll('.rest-item-price-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target;
        const itemId = target.getAttribute('data-id') || '';
        const newPrice = parseInt(target.value) || 0;
        
        if (newPrice > 0) {
          const dish = activeRest.menu.find(m => m.id === itemId);
          if (dish) {
            dish.price = newPrice;
            updateMenuItemPriceOnServer(activeRest.id, itemId, newPrice);
            saveState();
            renderRestaurantWorkspace();
          }
        }
      });
    });

    catalogTbody.querySelectorAll('.rest-delete-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        const itemId = target.getAttribute('data-id') || '';
        
        activeRest.menu = activeRest.menu.filter(m => m.id !== itemId);
        deleteMenuItemOnServer(activeRest.id, itemId);
        saveState();
        renderRestaurantWorkspace();
      });
    });
  }

  
  const reviewsListEl = document.getElementById("rest-reviews-list");
  if (reviewsListEl) {
    const matchedReviews = state.reviews.filter(rev => rev.restaurantId === activeRest.id);
    if (matchedReviews.length === 0) {
      reviewsListEl.innerHTML = `
        <div class="py-5 text-center bg-white border rounded-3 p-4">
          <div class="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 52px; height: 52px;">
            <i class="bi bi-star text-muted fs-4"></i>
          </div>
          <h6 class="font-display fw-bold text-dark mb-1">No reviews received yet</h6>
          <p class="text-muted small mx-auto m-0" style="max-width: 320px;">
            When foodies leave reviews and star ratings for your kitchen, they will show up here.
          </p>
        </div>
      `;
    } else {
      reviewsListEl.innerHTML = matchedReviews.map(rev => {
        let starsHTML = "";
        const ratingNum = parseInt(rev.rating) || 5;
        for (let i = 1; i <= 5; i++) {
          if (i <= ratingNum) {
            starsHTML += `<i class="bi bi-star-fill text-warning me-1"></i>`;
          } else {
            starsHTML += `<i class="bi bi-star text-muted me-1"></i>`;
          }
        }

        return `
          <div class="card border rounded-3 p-4 bg-white shadow-xs mb-3">
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div>
                <strong class="text-dark font-sans d-block" style="font-size: 14px;">${rev.customerName || 'Anonymous Nawab'}</strong>
                <div class="d-flex align-items-center mt-1">
                  ${starsHTML}
                  <span class="badge bg-light border text-muted ms-2" style="font-size: 9px;">Verified Buyer</span>
                </div>
              </div>
              <span class="text-muted small" style="font-size: 11px;">
                <i class="bi bi-calendar2-check me-1"></i> Verified Review
              </span>
            </div>
            <div class="mt-3 bg-light p-3 rounded-3 border-start border-3 border-warning">
              <p class="text-dark small m-0 lh-base" style="font-style: italic;">
                "${rev.reviewText}"
              </p>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}
