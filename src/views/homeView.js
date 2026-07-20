import { state, saveState } from "../state.js";
import { ALL_CATEGORIES } from "../data/restaurants.js";
import { navigateTo } from "../render.js";

export const homeView = `
        <!-- ================= HOME VIEW ================= -->
        <div id="home-view" class="container py-5 d-none">
          
          <!-- Nawabi Heritage Hero Section -->
          <div class="card bg-dark text-white rounded-4 p-4 p-md-5 mb-5 overflow-hidden position-relative border-0 shadow-sm" style="background: linear-gradient(135deg, #09090b 0%, #18181b 100%);">
            <!-- Background watermark image overlay -->
            <div class="position-absolute inset-0 opacity-10" style="background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80'); background-size: cover; background-position: center; mix-blend-mode: overlay; pointer-events: none; top: 0; left: 0; right: 0; bottom: 0;"></div>

            <div class="row align-items-center g-4 position-relative" style="z-index: 1;">
              <div class="col-lg-8 text-start">
                <span class="badge bg-danger-subtle text-danger fw-bold text-uppercase px-3 py-1.5 mb-3 d-inline-flex align-items-center gap-1.5" style="font-size: 10px; letter-spacing: 0.5px;">
                  <i class="bi bi-patch-check-fill text-danger"></i>
                  Authentic Awadhi Heritage
                </span>
                <h1 class="display-5 font-display fw-bold text-white mb-3">
                  Exquisite Gastronomy, <br class="d-none d-sm-inline" />
                  Delivered <span class="text-saffron">Nawabi Style</span>
                </h1>
                <p class="small mb-4" style="max-width: 620px; line-height: 1.6; color: rgba(255, 255, 255, 0.8) !important;">
                  Taste Lucknow's legendary recipes. From Aminabad's melt-in-the-mouth Tunday Galouti Kababs to Hazratganj's royal multi-layered Basket Chaats, cooked fresh and delivered to your doorstep.
                </p>

                <!-- Premium Hero Search Row (Eye-catching Centerpiece) -->
                <div class="hero-search-wrapper mb-4" style="max-width: 650px;">
                  <div class="row g-2">
                    <!-- Hero Locality Selector -->
                    <div class="col-sm-4">
                      <div class="position-relative">
                        <span class="position-absolute text-danger" style="left: 14px; top: 50%; transform: translateY(-50%); z-index: 5;">
                          <i class="bi bi-geo-alt-fill" style="font-size: 14px;"></i>
                        </span>
                        <select class="form-select border-0 ps-5 py-3 rounded-3 text-dark bg-white shadow-sm font-sans" id="hero-locality-select" style="font-size: 13.5px; font-weight: 600; cursor: pointer; height: 50px; outline: none;">
                          <!-- Populated dynamically via JS -->
                        </select>
                      </div>
                    </div>
                    <!-- Hero Search Input Keyword -->
                    <div class="col-sm-8">
                      <div class="position-relative">
                        <span class="position-absolute text-muted" style="left: 16px; top: 50%; transform: translateY(-50%); z-index: 5;">
                          <i class="bi bi-search text-saffron" style="color: #ea580c; font-size: 15px;"></i>
                        </span>
                        <input 
                          type="text" 
                          id="hero-search-input" 
                          class="form-control border-0 ps-5 pe-5 py-3 rounded-3 text-dark bg-white shadow-sm" 
                          placeholder="What would you like to eat today?" 
                          style="font-size: 13.5px; height: 50px; outline: none; font-weight: 500;"
                        />
                        <!-- Clear button for hero search -->
                        <button type="button" class="btn border-0 p-0 position-absolute text-muted d-none" id="hero-search-clear" style="right: 15px; top: 50%; transform: translateY(-50%); z-index: 5; font-size: 14px;">
                          <i class="bi bi-x-circle-fill"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Interactive Nawabi Cravings Quick Chips -->
                  <div class="d-flex flex-wrap align-items-center gap-2 mt-3 text-muted" style="font-size: 12px;">
                    <span class="fw-bold text-light text-opacity-80"><i class="bi bi-fire text-warning me-1"></i>Craving:</span>
                    <button class="btn btn-sm btn-dark bg-dark bg-opacity-40 border border-secondary border-opacity-25 rounded-pill px-2.5 py-0.5 text-light text-decoration-none quick-tag" data-query="Kebab" style="font-size: 11px;">Galouti Kebab</button>
                    <button class="btn btn-sm btn-dark bg-dark bg-opacity-40 border border-secondary border-opacity-25 rounded-pill px-2.5 py-0.5 text-light text-decoration-none quick-tag" data-query="Biryani" style="font-size: 11px;">Awadhi Biryani</button>
                    <button class="btn btn-sm btn-dark bg-dark bg-opacity-40 border border-secondary border-opacity-25 rounded-pill px-2.5 py-0.5 text-light text-decoration-none quick-tag" data-query="Chaat" style="font-size: 11px;">Basket Chaat</button>
                    <button class="btn btn-sm btn-dark bg-dark bg-opacity-40 border border-secondary border-opacity-25 rounded-pill px-2.5 py-0.5 text-light text-decoration-none quick-tag" data-query="Kulfi" style="font-size: 11px;">Prakash Kulfi</button>
                  </div>
                </div>

                <div class="d-flex flex-wrap align-items-center gap-3">
                  <button class="btn btn-saffron px-4 py-2.5 fw-bold text-xs rounded-3 d-inline-flex align-items-center gap-1.5" id="hero-explore-btn">
                    <span>View All Eateries</span>
                    <i class="bi bi-arrow-right"></i>
                  </button>
                  <span class="text-uppercase fw-bold" style="font-size: 10px; letter-spacing: 0.5px; color: rgba(255, 255, 255, 0.55) !important;">
                    ● Hazratganj ● Aminabad ● Gomti Nagar
                  </span>
                </div>
              </div>

              <!-- Hero Dish Circular Graphic -->
              <div class="col-lg-4 d-flex justify-content-center">
                <div class="rounded-circle border border-secondary border-opacity-20 overflow-hidden shadow-lg" style="width: 220px; height: 220px; border-width: 6px;">
                  <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80" alt="Lakhnawi Biryani" class="w-100 h-100 object-cover" style="object-fit: cover;">
                </div>
              </div>
            </div>
          </div>

          <!-- Specialties category pill selection -->
          <div class="text-start mb-5">
            <div class="mb-3">
              <h5 class="font-display fw-bold text-dark mb-1">Browse Lucknow Specialties</h5>
              <p class="text-muted small m-0">Filter culinary spots by famous local regional categories</p>
            </div>
            <div class="d-flex align-items-center gap-2 overflow-x-auto pb-2" id="category-pills-container" style="max-width: 100%;">
              <!-- Populate categories dynamically inside TS -->
            </div>
          </div>

          <!-- Restaurant cards grid layout -->
          <div class="text-start mb-5">
            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 pb-3 border-bottom mb-4">
              <div>
                <h5 class="font-display fw-bold text-dark m-0" id="restaurant-grid-title">
                  Top Dining Spots in Lucknow
                </h5>
                <p class="text-muted small m-0 mt-0.5">Handpicked legendary venues delivering hot and fresh</p>
              </div>
              <span class="badge bg-light border text-muted px-3 py-2 rounded-pill small self-start self-sm-auto" id="restaurant-count-badge">
                Showing 6 active kitchens
              </span>
            </div>

            <!-- Grid Container -->
            <div class="row g-4" id="restaurant-grid">
              <!-- Cards rendered dynamically -->
            </div>
          </div>

        </div>
`;

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
