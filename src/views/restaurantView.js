import { state, saveState } from "../state.js";
import { navigateTo } from "../render.js";
import { updateOrderStatusOnServer, updateMenuItemPriceOnServer, deleteMenuItemOnServer } from "../api.js";

export const restaurantView = `
        <!-- ================= RESTAURANT OWNER WORKSPACE ================= -->
        <div id="restaurant-view" class="container py-4 py-lg-5 d-none text-start">
          
          <!-- Workspace Header -->
          <div class="card border-0 rounded-4 shadow-sm overflow-hidden mb-4 bg-dark text-white">
            <div class="position-relative" style="height: 160px;">
              <div class="position-absolute w-100 h-100 bg-dark opacity-60" style="z-index: 1; top: 0; left: 0;"></div>
              <img src="" id="rest-owner-hero-img" alt="Kitchen Banner" class="w-100 h-100 object-cover position-absolute" style="object-fit: cover; top: 0; left: 0; z-index: 0;">
              
              <div class="position-absolute bottom-0 start-0 p-4 w-100 d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3" style="z-index: 2;">
                <div>
                  <span class="badge bg-saffron text-white fw-bold text-uppercase px-2.5 py-1 mb-2" style="background-color: #ea580c; font-size: 9px; letter-spacing: 0.5px;">Live Kitchen Dashboard</span>
                  <h2 class="font-display fw-bold text-white m-0" id="rest-owner-title">Restaurant Name</h2>
                  <p class="text-light text-opacity-75 small m-0 mt-1" id="rest-owner-desc">Managing orders & live culinary catalog</p>
                </div>
                <div class="d-flex gap-2 flex-wrap">
                  <button class="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 px-3 py-2 shrink-0" id="rest-owner-password-btn" style="border-color: rgba(255,255,255,0.2); background-color: rgba(255,255,255,0.03); font-size: 11.5px; font-weight: 600; border-radius: 6px;">
                    <i class="bi bi-shield-lock-fill text-warning"></i>
                    <span>Edit Password</span>
                  </button>
                  <button class="btn btn-sm btn-outline-light d-flex align-items-center gap-1.5 px-3 py-2 shrink-0" id="rest-owner-logout-btn" style="border-color: rgba(255,255,255,0.2); background-color: rgba(255,255,255,0.03); font-size: 11.5px; font-weight: 600; border-radius: 6px;">
                    <i class="bi bi-box-arrow-right text-danger"></i>
                    <span>Logout Kitchen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats Cards Block -->
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-3">
              <div class="card border p-3 rounded-3 shadow-xs h-100 bg-white">
                <span class="text-uppercase text-muted fw-bold d-block" style="font-size: 8px; letter-spacing: 0.5px;">Total Orders</span>
                <strong class="text-dark fs-4 font-sans mt-1 d-block" id="rest-stat-orders">0</strong>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card border p-3 rounded-3 shadow-xs h-100 bg-white">
                <span class="text-uppercase text-muted fw-bold d-block" style="font-size: 8px; letter-spacing: 0.5px;">Pending Prep</span>
                <strong class="text-danger fs-4 font-sans mt-1 d-block" id="rest-stat-pending">0</strong>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card border p-3 rounded-3 shadow-xs h-100 bg-white">
                <span class="text-uppercase text-muted fw-bold d-block" style="font-size: 8px; letter-spacing: 0.5px;">Total Revenue</span>
                <strong class="text-success fs-4 font-sans mt-1 d-block" id="rest-stat-revenue">₹0</strong>
              </div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card border p-3 rounded-3 shadow-xs h-100 bg-white">
                <span class="text-uppercase text-muted fw-bold d-block" style="font-size: 8px; letter-spacing: 0.5px;">Menu Items</span>
                <strong class="text-primary fs-4 font-sans mt-1 d-block" id="rest-stat-menu-count">0</strong>
              </div>
            </div>
          </div>

          <!-- Segmented Navigation Tabs -->
          <ul class="nav nav-tabs mb-4 border-bottom" style="font-size: 13.5px; font-weight: 600;">
            <li class="nav-item">
              <button class="nav-link active text-dark px-3 py-2.5 border-bottom border-saffron" id="rest-tab-orders" style="border: none;">
                <i class="bi bi-receipt-cutoff text-saffron me-1.5" style="color: #ea580c;"></i>
                <span>Live Orders Queue</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link text-muted px-3 py-2.5" id="rest-tab-menu" style="border: none;">
                <i class="bi bi-egg-fried me-1.5"></i>
                <span>Edit Menu Offerings</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link text-muted px-3 py-2.5" id="rest-tab-reviews" style="border: none;">
                <i class="bi bi-star me-1.5"></i>
                <span>Customer Reviews</span>
              </button>
            </li>
          </ul>

          <!-- VIEW: LIVE ORDERS QUEUE -->
          <div id="rest-view-orders-block" class="d-block">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="font-display fw-bold text-dark m-0">Incoming Customer Orders</h5>
              <button class="btn btn-sm btn-light border py-1.5 px-3 fw-bold" id="rest-refresh-orders" style="font-size: 11.5px;">
                <i class="bi bi-arrow-clockwise me-1"></i> Refresh Queue
              </button>
            </div>
            
            <div class="d-flex flex-column gap-3" id="rest-orders-queue-list">
              <!-- Render orders queue list dynamically -->
            </div>
          </div>

          <!-- VIEW: EDIT MENU CATALOG -->
          <div id="rest-view-menu-block" class="d-none">
            <div class="row g-4">
              <!-- Left side: Add New Dish Form -->
              <div class="col-lg-4">
                <div class="card border p-4 rounded-3 shadow-xs bg-white">
                  <h5 class="font-display fw-bold text-dark mb-1">Add New Dish</h5>
                  <p class="text-muted small mb-4">Create a custom culinary recipe for your digital Lakhnawi menu.</p>
                  
                  <form id="rest-add-dish-form" class="d-flex flex-column gap-3">
                    <div class="form-group">
                      <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Dish Name</label>
                      <input type="text" id="add-dish-name" required placeholder="e.g. Kakori Kebab Royal" class="form-control" style="font-size: 12.5px;" />
                    </div>
                    
                    <div class="row g-2">
                      <div class="col-6">
                        <div class="form-group">
                          <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Price (₹)</label>
                          <input type="number" id="add-dish-price" required min="1" placeholder="180" class="form-control" style="font-size: 12.5px;" />
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="form-group">
                          <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Category</label>
                          <select id="add-dish-category" class="form-select" style="font-size: 12.5px;">
                            <option value="Kebabs">Kebabs</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Chaat">Chaat</option>
                            <option value="Mains">Mains</option>
                            <option value="Breads">Breads</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Beverages">Beverages</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <div class="form-check form-switch pt-1">
                        <input class="form-check-input" type="checkbox" role="switch" id="add-dish-isveg" checked>
                        <label class="form-check-label small fw-semibold text-dark" for="add-dish-isveg">Pure Vegetarian Dish</label>
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Recipe Description</label>
                      <textarea id="add-dish-desc" required rows="2" placeholder="Describe the Awadhi aromatics, spices, and ingredients..." class="form-control resize-none" style="font-size: 12px; line-height: 1.4;"></textarea>
                    </div>

                    <div class="form-group">
                      <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Dish Image URL</label>
                      <input type="url" id="add-dish-image" placeholder="Leave empty for default food banner" class="form-control" style="font-size: 12px;" />
                    </div>

                    <button type="submit" class="btn btn-saffron w-100 py-2.5 fw-bold text-xs rounded-3 mt-2">
                      <i class="bi bi-plus-circle me-1"></i> Publish on Lakhnawi Bites
                    </button>
                  </form>
                </div>
              </div>
              
              <!-- Right side: Catalog List -->
              <div class="col-lg-8">
                <div class="card border p-4 rounded-3 shadow-xs bg-white">
                  <h5 class="font-display fw-bold text-dark mb-1">Active Menu Catalog</h5>
                  <p class="text-muted small mb-4">View and update the price points of your existing offerings.</p>
                  
                  <div class="table-responsive">
                    <table class="table table-hover align-middle" style="font-size: 13px;">
                      <thead class="table-light">
                        <tr>
                          <th scope="col" style="width: 50px;">Dish</th>
                          <th scope="col">Name & Description</th>
                          <th scope="col" style="width: 110px;">Price (₹)</th>
                          <th scope="col" style="width: 100px;">Actions</th>
                        </tr>
                      </thead>
                      <tbody id="rest-menu-catalog-tbody">
                        <!-- Render catalog rows dynamically -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- VIEW: CUSTOMER REVIEWS -->
          <div id="rest-view-reviews-block" class="d-none">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 class="font-display fw-bold text-dark mb-1">Customer Reviews & Ratings</h5>
                <p class="text-muted small m-0">Live feedback, ratings, and culinary guestbook submissions for your kitchen.</p>
              </div>
            </div>
            
            <div class="d-flex flex-column gap-1" id="rest-reviews-list">
              <!-- Reviews list populated dynamically -->
            </div>
          </div>

        </div>
`;

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
