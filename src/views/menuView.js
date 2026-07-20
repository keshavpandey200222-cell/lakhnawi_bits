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
