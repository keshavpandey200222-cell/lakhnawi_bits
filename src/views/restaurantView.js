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
