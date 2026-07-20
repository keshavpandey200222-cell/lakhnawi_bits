import { state } from "../state.js";

export const portalLandingView = `
        <!-- ================= PORTAL LANDING VIEW ================= -->
        <div id="portal-landing-view" class="container py-4 py-lg-5 d-block">
          
          <!-- Elegant Portal Hero Header -->
          <div class="text-center mb-5 mt-2">
            <span class="badge bg-saffron text-white fw-bold text-uppercase px-3 py-1.5 mb-3 d-inline-flex align-items-center gap-1.5" style="background-color: #ea580c; font-size: 10px; letter-spacing: 0.5px;">
              <i class="bi bi-award-fill"></i> Lucknow's Elite Culinary Network
            </span>
            <h1 class="display-5 font-display fw-black text-dark mb-2">
              Lakhnawi <span class="text-saffron" style="color: #ea580c;">Bites</span> Gateway
            </h1>
            <p class="text-muted mx-auto" style="max-width: 650px; font-size: 13.5px; line-height: 1.6;">
              Indulge in Aminabad's century-old Galouti Kebabs and Hazratganj's royal Basket Chaats, or manage your digital kitchen queue in real-time. Choose your portal below to begin your Awadhi experience.
            </p>
          </div>

          <div class="row g-4 justify-content-center">
            
            <!-- PORTAL CARD 1: CONSUMER (FOODIE) -->
            <div class="col-lg-6 col-md-10">
              <div class="card h-100 border-0 rounded-4 shadow-sm overflow-hidden text-start hover-up" style="transition: all 0.25s ease-in-out; background: #ffffff;">
                <div class="position-relative" style="height: 180px;">
                  <div class="position-absolute w-100 h-100 bg-dark opacity-50" style="z-index: 1; top: 0; left: 0;"></div>
                  <img src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80" alt="Awadhi Foodie" class="w-100 h-100 object-cover position-absolute" style="object-fit: cover; top:0; left:0; z-index: 0;">
                  <div class="position-absolute bottom-0 start-0 p-4" style="z-index: 2;">
                    <span class="badge bg-warning text-dark fw-bold text-uppercase px-2.5 py-1 mb-2" style="font-size: 9px; letter-spacing: 0.5px;">Royal Connoisseur</span>
                    <h3 class="font-display fw-bold text-white m-0">Consumer Foodie Portal</h3>
                  </div>
                </div>
                
                <div class="card-body p-4 bg-white d-flex flex-column justify-content-between" style="min-height: 280px;">
                  <div>
                    <p class="text-muted small mb-4">
                      Browse Aminabad, Hazratganj, and Chowk's top culinary spots. Order freshly baked Shahi Sheermal, Dum Biryanis, and traditional Kesar Pista Falooda Kulfi with live GPS route tracking.
                    </p>
                    
                    <!-- Account Selection Dropdown -->
                    <div class="mb-4">
                      <label class="text-uppercase text-muted fw-bold d-block mb-1.5" style="font-size: 9px; letter-spacing: 0.5px;">Select Active Profile</label>
                      <select class="form-select font-sans py-2.5" id="landing-customer-select" style="font-size: 13px; font-weight: 500;">
                        <!-- Render customer profiles dynamically -->
                      </select>
                    </div>
                  </div>

                  <div class="d-flex flex-column gap-2 mt-auto">
                    <button class="btn btn-saffron py-2.5 fw-bold text-xs rounded-3 w-100 d-flex align-items-center justify-content-center gap-2" id="landing-enter-consumer-btn">
                      <span>Enter Foodie Portal</span>
                      <i class="bi bi-arrow-right-short fs-5"></i>
                    </button>
                    
                    <button class="btn btn-link text-decoration-none text-saffron py-1 text-center fw-bold text-xs mt-1 border-0 bg-transparent" id="landing-create-customer-btn">
                      <i class="bi bi-plus-circle-fill me-1"></i> Create New Customer Account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- PORTAL CARD 2: RESTAURANT OWNER -->
            <div class="col-lg-6 col-md-10">
              <div class="card h-100 border-0 rounded-4 shadow-sm overflow-hidden text-start hover-up" style="transition: all 0.25s ease-in-out; background: #ffffff;">
                <div class="position-relative" style="height: 180px;">
                  <div class="position-absolute w-100 h-100 bg-dark opacity-60" style="z-index: 1; top: 0; left: 0;"></div>
                  <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80" alt="Restaurant Kitchen" class="w-100 h-100 object-cover position-absolute" style="object-fit: cover; top:0; left:0; z-index: 0;">
                  <div class="position-absolute bottom-0 start-0 p-4" style="z-index: 2;">
                    <span class="badge bg-danger text-white fw-bold text-uppercase px-2.5 py-1 mb-2" style="font-size: 9px; letter-spacing: 0.5px;">Kitchen Manager</span>
                    <h3 class="font-display fw-bold text-white m-0">Restaurant Owner Portal</h3>
                  </div>
                </div>
                
                <div class="card-body p-4 bg-white d-flex flex-column justify-content-between" style="min-height: 280px;">
                  <div>
                    <p class="text-muted small mb-4">
                      Accept orders from foodies, update cooking & dispatch status in real-time, modify menu prices or create new local specialties, and examine delivery area coverage and sales.
                    </p>
                    
                    <!-- Restaurant Selection Dropdown -->
                    <div class="mb-4">
                      <label class="text-uppercase text-muted fw-bold d-block mb-1.5" style="font-size: 9px; letter-spacing: 0.5px;">Select Active Kitchen</label>
                      <select class="form-select font-sans py-2.5" id="landing-restaurant-select" style="font-size: 13px; font-weight: 500;">
                        <!-- Render restaurants dynamically -->
                      </select>
                    </div>
                  </div>

                  <div class="d-flex flex-column gap-2 mt-auto">
                    <button class="btn btn-dark bg-zinc-900 border-0 py-2.5 fw-bold text-xs rounded-3 w-100 d-flex align-items-center justify-content-center gap-2" id="landing-enter-restaurant-btn" style="background-color: #18181b;">
                      <span>Manage Selected Kitchen</span>
                      <i class="bi bi-sliders fs-6 text-saffron"></i>
                    </button>
                    
                    <button class="btn btn-link text-decoration-none text-dark py-1 text-center fw-bold text-xs mt-1 border-0 bg-transparent" id="landing-create-restaurant-btn">
                      <i class="bi bi-plus-circle-fill me-1 text-saffron" style="color: #ea580c !important;"></i> Register New Awadhi Restaurant
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
`;

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
