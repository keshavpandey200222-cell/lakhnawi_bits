export const trackingView = `
        <!-- ================= ORDER TRACKING VIEW ================= -->
        <div id="tracking-view" class="container py-4 d-none">
          
          <!-- Simulation Info Alert Bar -->
          <div class="alert alert-warning border border-warning-subtle rounded-3 p-3 mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-start small">
            <span class="d-flex align-items-center gap-2 fw-semibold text-dark">
              <i class="bi bi-rocket-takeoff-fill text-danger fs-5"></i>
              <span>Lucknow Delivery Simulator Active: Track your fresh meal live!</span>
            </span>
            <button id="tracking-fast-forward" class="btn btn-sm btn-dark px-3 fw-bold d-inline-flex align-items-center gap-1.5" style="font-size: 11px;">
              <i class="bi bi-arrow-repeat"></i>
              <span>Fast Forward Status</span>
            </button>
          </div>

          <div class="row g-4 text-start">
            
            <!-- Left column: Map canvas container & rider bio -->
            <div class="col-lg-7 col-12 d-flex flex-column gap-4">
              <!-- Live Map Card -->
              <div class="card shadow-xs border p-3 rounded-3">
                <span class="text-uppercase text-muted fw-bold d-block mb-3" style="font-size: 9px; letter-spacing: 0.5px;">
                  Lakhnawi Bites Transit Map (Real-Time OSM)
                </span>

                <!-- Map Frame -->
                <div id="map-container" class="w-100 bg-secondary rounded-3 border overflow-hidden" style="height: 360px; z-index: 1;"></div>

                <!-- Destination Address details -->
                <div class="d-flex align-items-start gap-3 bg-light p-3 rounded-3 border mt-3 text-start">
                  <div class="rounded-circle bg-danger-subtle d-flex align-items-center justify-content-center text-danger shrink-0" style="width: 36px; height: 36px;">
                    <i class="bi bi-geo-alt-fill fs-5"></i>
                  </div>
                  <div class="small">
                    <strong class="text-dark d-block">Deliver to Residence Address</strong>
                    <p class="text-muted m-0 mt-0.5 lh-base" id="tracking-delivery-address">
                      Chowk Road crossing, Hazratganj Bypass, Lucknow, UP.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Rider profile card banner -->
              <div class="card shadow-xs border p-4 rounded-3 text-start">
                <span class="text-uppercase text-muted fw-bold d-block mb-3" style="font-size: 9px; letter-spacing: 0.5px;">
                  Your Delivery Partner
                </span>
                
                <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="rounded-3 text-white d-flex align-items-center justify-content-center fw-black text-uppercase shrink-0" style="width: 56px; height: 56px; fontSize: 18px; backgroundColor: #ea580c;">
                      RK
                    </div>
                    <div>
                      <strong class="d-block text-dark fs-6">Ramesh Kumar</strong>
                      <span class="text-muted small d-inline-flex align-items-center gap-1 mt-0.5">
                        <i class="bi bi-send text-danger"></i>
                        Lakhnawi Bites Elite Delivery Fleet
                      </span>
                    </div>
                  </div>

                  <a href="tel:+919876543210" class="btn btn-sm btn-light border fw-bold px-3 py-2 d-inline-flex align-items-center gap-1.5" style="font-size: 12px;">
                    <i class="bi bi-telephone-fill text-success"></i>
                    <span>Call Ramesh</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- Right column: ETA summary & dynamic timeline -->
            <div class="col-lg-5 col-12">
              <div class="card shadow-xs border p-4 rounded-3 text-start">
                
                <!-- Arrival ETA header board -->
                <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                  <div>
                    <span class="text-uppercase text-muted fw-bold d-block" style="font-size: 8px; letter-spacing: 0.5px;">Estimated Arrival</span>
                    <span class="fw-black text-danger fs-3 mt-1 d-inline-flex align-items-center gap-1">
                      <i class="bi bi-alarm-fill fs-4 text-warning"></i>
                      <span id="tracking-eta-val">25 Mins</span>
                    </span>
                  </div>
                  <span class="badge bg-dark border text-uppercase" id="tracking-status-badge" style="font-size: 10px;">
                    CONFIRMED
                  </span>
                </div>

                <!-- Custom Vertical Timeline -->
                <div class="position-relative d-flex flex-column gap-4" id="tracking-timeline-box">
                  
                  <!-- Vertical connector guide -->
                  <div class="position-absolute" style="top: 15px; bottom: 15px; left: 18px; width: 2px; background-color: #dee2e6; z-index: 0;"></div>

                  <!-- Step 1: Confirmed -->
                  <div class="d-flex gap-3 align-items-start position-relative timeline-step" id="tracking-step-1" style="z-index: 1;">
                    <div class="step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0" style="width: 36px; height: 36px; background-color: #fff; color: #71717a;">
                      <i class="bi bi-check-circle-fill fs-5"></i>
                    </div>
                    <div class="pt-1 text-start">
                      <h6 class="fw-bold mb-1 step-title text-dark" style="font-size: 13px;">Order Confirmed</h6>
                      <p class="text-muted m-0 small" style="font-size: 11px; line-height: 1.4;">Restaurant has accepted your order and is preparing the ticket.</p>
                    </div>
                  </div>

                  <!-- Step 2: Preparing -->
                  <div class="d-flex gap-3 align-items-start position-relative timeline-step" id="tracking-step-2" style="z-index: 1;">
                    <div class="step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0" style="width: 36px; height: 36px; background-color: #fff; color: #71717a;">
                      <i class="bi bi-egg-fried fs-5"></i>
                    </div>
                    <div class="pt-1 text-start">
                      <h6 class="fw-bold mb-1 step-title text-dark" style="font-size: 13px;">Cooking in Progress</h6>
                      <p class="text-muted m-0 small" style="font-size: 11px; line-height: 1.4;">Nawabi chefs are baking and cooking Lucknow specialities.</p>
                    </div>
                  </div>

                  <!-- Step 3: Dispatched -->
                  <div class="d-flex gap-3 align-items-start position-relative timeline-step" id="tracking-step-3" style="z-index: 1;">
                    <div class="step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0" style="width: 36px; height: 36px; background-color: #fff; color: #71717a;">
                      <i class="bi bi-truck fs-5"></i>
                    </div>
                    <div class="pt-1 text-start">
                      <h6 class="fw-bold mb-1 step-title text-dark" style="font-size: 13px;">Out for Delivery</h6>
                      <p class="text-muted m-0 small" style="font-size: 11px; line-height: 1.4;">Our delivery rider Ramesh is routing through Lucknow traffic.</p>
                    </div>
                  </div>

                  <!-- Step 4: Delivered -->
                  <div class="d-flex gap-3 align-items-start position-relative timeline-step" id="tracking-step-4" style="z-index: 1;">
                    <div class="step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0" style="width: 36px; height: 36px; background-color: #fff; color: #71717a;">
                      <i class="bi bi-bag-check-fill fs-5"></i>
                    </div>
                    <div class="pt-1 text-start">
                      <h6 class="fw-bold mb-1 step-title text-dark" style="font-size: 13px;">Delivered & Enjoyed</h6>
                      <p class="text-muted m-0 small" style="font-size: 11px; line-height: 1.4;">The rider has handed over your Lakhnawi Bites feast. Saushthav!</p>
                    </div>
                  </div>

                </div>

                <!-- Back to menu trigger -->
                <div class="border-top pt-4 mt-4 text-center">
                  <button id="tracking-rate-btn" class="btn btn-warning w-100 py-2.5 fw-bold text-dark d-none mb-3 d-flex align-items-center justify-content-center gap-2" style="font-size: 12px;">
                    <i class="bi bi-star-fill text-dark"></i>
                    <span>Rate & Review Restaurant</span>
                  </button>
                  <button id="tracking-close-btn" class="btn btn-sm btn-light border w-100 py-2.5 fw-bold" style="font-size: 12px;">
                    Go Back to Explore Menu
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
`;
