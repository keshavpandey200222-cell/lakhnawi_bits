import { state, saveState, getCartRestaurantId } from "../state.js";
import { navigateTo, renderHeader } from "../render.js";
import { renderCartDrawer } from "./modalsView.js";

export const menuView = `
        <!-- ================= RESTAURANT MENU VIEW ================= -->
        <div id="menu-view" class="container py-4 d-none">
          
          <!-- Back Button -->
          <button id="menu-back-btn" class="btn btn-link text-decoration-none text-muted fw-bold p-0 mb-4 d-inline-flex align-items-center gap-2 border-0 bg-transparent" style="font-size: 13px;">
            <i class="bi bi-arrow-left"></i>
            <span>Back to all Lucknow Eateries</span>
          </button>

          <!-- Restaurant Hero Section (populated dynamically) -->
          <div id="menu-hero-banner" class="position-relative rounded-4 text-white overflow-hidden mb-5 p-4 p-md-5 d-flex align-items-end" style="min-height: 220px; background: linear-gradient(180deg, rgba(9,9,11,0.2) 0%, rgba(9,9,11,0.85) 100%);">
            <!-- Background Image dynamically replaced -->
            <img src="" id="menu-hero-img" alt="" class="position-absolute w-100 h-100 object-cover opacity-25" style="object-fit: cover; z-index: -1; top: 0; left: 0;">
            
            <div class="row w-100 align-items-end g-3" style="z-index: 1;">
              <div class="col-lg-8 text-start">
                <div class="d-flex flex-wrap gap-2 mb-2" id="menu-hero-badges">
                  <!-- Badges populated dynamically -->
                </div>
                <h1 class="display-6 font-display fw-bold text-white mb-2" id="menu-hero-name">
                  Restaurant Name
                </h1>
                <p class="small text-light text-opacity-75 mb-0" id="menu-hero-description" style="max-width: 600px;">
                  Restaurant description
                </p>
              </div>

              <!-- Quick stats board -->
              <div class="col-lg-4 d-flex justify-content-lg-end">
                <div class="d-flex gap-3 bg-dark bg-opacity-75 border border-secondary border-opacity-20 p-3 rounded-3 shadow-sm backdrop-blur">
                  <div class="text-center px-2">
                    <span class="d-block text-muted text-uppercase fw-bold mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Rating</span>
                    <span class="fw-bold text-warning d-inline-flex align-items-center gap-1" id="menu-stat-rating" style="font-size: 14px;">
                      <i class="bi bi-star-fill"></i>
                      4.8
                    </span>
                  </div>
                  <div class="vr bg-secondary opacity-20"></div>
                  <div class="text-center px-2">
                    <span class="d-block text-muted text-uppercase fw-bold mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Delivery</span>
                    <span class="fw-bold text-light d-inline-flex align-items-center gap-1" id="menu-stat-delivery" style="font-size: 13px;">
                      <i class="bi bi-clock"></i>
                      25-35 min
                    </span>
                  </div>
                  <div class="vr bg-secondary opacity-20"></div>
                  <div class="text-center px-2">
                    <span class="d-block text-muted text-uppercase fw-bold mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Min Order</span>
                    <span class="fw-bold text-light d-block" id="menu-stat-minorder" style="font-size: 13px;">
                      ₹150
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs & Search Bar Row -->
          <div class="d-flex flex-column md-row gap-3 align-items-md-center justify-content-between border-bottom pb-4 mb-4">
            <!-- Dynamic Category Pills -->
            <div class="d-flex align-items-center gap-2 overflow-x-auto pb-2 pb-md-0" id="menu-category-pills" style="max-width: 100%;">
              <!-- Populate dynamically -->
            </div>

            <!-- Search menu input -->
            <div class="position-relative" style="width: 100%; max-width: 280px;">
              <div class="input-group">
                <span class="input-group-text bg-light border-end-0 text-muted">
                  <i class="bi bi-search"></i>
                </span>
                <input
                  id="menu-search-input"
                  type="text"
                  placeholder="Search in this menu..."
                  class="form-control form-control-sm bg-light border-start-0 py-2"
                  style="font-size: 12px;"
                />
              </div>
            </div>
          </div>

          <!-- Menu items display block -->
          <div class="row g-4 text-start" id="menu-items-grid">
            <!-- Populated dynamically -->
          </div>

          <!-- Customer Reviews Section -->
          <div class="mt-5 pt-5 border-top text-start" id="menu-reviews-section">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 class="font-display fw-bold text-dark mb-1">Culinary Guestbook</h4>
                <p class="text-muted small m-0">Verified ratings & feedback from the Nawabs of Lucknow.</p>
              </div>
              <span class="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-10 px-3 py-2 rounded-pill small" id="menu-reviews-summary-badge">
                No reviews yet
              </span>
            </div>
            
            <div class="row g-3" id="menu-reviews-container">
              <!-- Reviews list populated dynamically -->
            </div>
          </div>

        </div>
`;

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

export function addToCart(item, targetRestaurant) {
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

export function updateCartQuantity(itemId, change) {
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
