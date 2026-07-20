export const modalsView = `
      <!-- ================= ROYAL CART OFFCANVAS DRAWER ================= -->
      <div class="offcanvas offcanvas-end border-0 shadow-lg text-start" tabindex="-1" id="cart-offcanvas" aria-labelledby="cartOffcanvasLabel" style="width: 420px; z-index: 1060;">
        <div class="offcanvas-header bg-dark text-white p-4">
          <div class="d-flex align-items-center gap-2.5">
            <div class="rounded bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background-color: #ea580c;">
              <i class="bi bi-bag-check fs-5"></i>
            </div>
            <div>
              <h5 class="offcanvas-title font-display fw-black text-white m-0" id="cartOffcanvasLabel">Your Foodie Bag</h5>
              <span class="text-muted d-block" id="cart-restaurant-name" style="font-size: 10px;">Select active menu to fill...</span>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div class="offcanvas-body p-4 d-flex flex-column justify-content-between bg-white" style="height: 100%;">
          <!-- Items List Scroll Area -->
          <div class="cart-scroll-area overflow-y-auto mb-3 text-start" id="cart-scroll-content" style="flex-grow: 1; max-height: calc(100% - 190px);">
            <!-- Populated dynamically via state -->
          </div>

          <!-- Billing & Action Summary Box -->
          <div class="border-top pt-3 bg-white mt-auto" id="cart-billing-panel">
            <div class="d-flex justify-content-between align-items-center mb-1.5 text-muted small">
              <span>Nawabi Subtotal:</span>
              <strong class="text-dark" id="cart-calc-subtotal">₹0</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1.5 text-success small d-none" id="cart-discount-row">
              <span>Nawabi Discount:</span>
              <strong class="text-success" id="cart-calc-discount">-₹0</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1.5 text-muted small">
              <span>Awadhi Delivery Fee:</span>
              <strong class="text-dark" id="cart-calc-delivery">₹0</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1.5 text-muted small">
              <span>Taxes & Fees:</span>
              <strong class="text-dark" id="cart-calc-tax">₹0</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3 border-top pt-2">
              <strong class="text-dark font-display" style="font-size: 15px;">Estimated Total:</strong>
              <strong class="text-saffron font-display fs-4" id="cart-calc-total" style="color: #ea580c;">₹0</strong>
            </div>

            <button id="cart-checkout-btn" class="btn btn-saffron w-100 py-3 fw-bold text-xs rounded-3 d-flex align-items-center justify-content-center gap-2">
              <i class="bi bi-credit-card-2-front-fill"></i>
              <span>Proceed to Royal Checkout</span>
            </button>
          </div>
        </div>
      </div>


      <!-- ================= SECURE CHECKOUT MODAL ================= -->
      <div class="modal fade" id="checkout-modal" tabindex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true" style="z-index: 1065;">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg text-start position-relative">
            
            <!-- Secure processing overlay -->
            <div id="payment-processing-overlay" class="position-absolute d-none flex-column align-items-center justify-content-center bg-white p-5 text-center" style="top:0; left:0; right:0; bottom:0; z-index: 1090;">
              <div class="spinner-border text-saffron" role="status" style="width: 3.5rem; height: 3.5rem; color: #ea580c !important;">
                <span class="visually-hidden">Loading...</span>
              </div>
              <h4 class="font-display fw-bold text-dark mt-4 mb-2">Processing Your Royal Order</h4>
              <p id="payment-processing-step" class="text-muted small" style="max-width: 320px;">Establishing secure 256-bit SSL encrypted tunnel...</p>
            </div>

            <div class="modal-header bg-dark text-white p-4 border-0">
              <div class="d-flex align-items-center gap-2.5">
                <div class="rounded bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background-color: #ea580c;">
                  <i class="bi bi-shield-check text-white fs-5"></i>
                </div>
                <div>
                  <h5 class="modal-title font-display fw-bold text-white m-0" id="checkoutModalLabel">Royal Awadhi Gateway</h5>
                  <span class="text-muted d-block" style="font-size: 10px;">Review items, apply secret promo, and pay securely</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" id="checkout-modal-close"></button>
            </div>

            <!-- Forms Container Wrapper -->
            <div id="checkout-modal-forms" class="w-100">
              <form id="checkout-payment-form" class="modal-body p-0 d-flex flex-column flex-lg-row bg-white m-0 border-0">
                
                <!-- Left side: Delivery options & checkout forms (60% width on large) -->
                <div class="p-4 flex-grow-1 border-end border-light text-start" style="flex-basis: 55%;">
                  <h6 class="text-uppercase text-muted fw-bold mb-3 d-flex align-items-center gap-2 pb-1.5 border-bottom" style="font-size: 10px; letter-spacing: 0.5px;">
                    <i class="bi bi-geo-alt-fill text-danger"></i> Delivery Destination Address
                  </h6>

                  <!-- Profile summary block -->
                  <div class="p-3 bg-light rounded-3 mb-3 text-start">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <strong class="text-dark small" id="checkout-user-name">Keshav Pandey</strong>
                      <span class="badge bg-saffron text-white py-1" style="font-size: 9px; background-color: #ea580c;">Active Foodie</span>
                    </div>
                    <span class="text-muted d-block small" id="checkout-profile-contact">+91 91234 56789 | keshav@example.com</span>
                    <div class="text-muted small mt-2 bg-white rounded p-2.5 border border-zinc-200 lh-base" id="checkout-user-address">
                      Room 304, S.R. Institute of Management & Technology, Bakshi Ka Talab, Lucknow
                    </div>
                  </div>

                  <!-- Custom instructions text area -->
                  <div class="mb-4">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1.5" style="font-size: 9px; letter-spacing: 0.5px;">Delivery Instructions (Optional)</label>
                    <textarea rows="2" id="checkout-instructions" placeholder="e.g. Ring doorbell, leave at main gate, call upon arrival..." class="form-control resize-none" style="font-size: 12px; line-height: 1.4;"></textarea>
                  </div>

                  <h6 class="text-uppercase text-muted fw-bold mb-3 d-flex align-items-center gap-2 pb-1.5 border-bottom" style="font-size: 10px; letter-spacing: 0.5px;">
                    <i class="bi bi-credit-card-2-front-fill text-primary"></i> Payment Method Selection
                  </h6>

                  <!-- Interactive payment options grid -->
                  <div class="row g-2" id="checkout-payment-methods">
                    <div class="col-6">
                      <input type="radio" class="btn-check" name="paymentMethod" id="pay-select-upi" value="upi" checked autocomplete="off">
                      <label class="btn btn-outline-dark w-100 py-3 px-2 rounded-3 text-start d-flex align-items-center gap-2 text-decoration-none" for="pay-select-upi" style="cursor: pointer; font-size: 12.5px;">
                        <i class="bi bi-qr-code text-primary fs-5"></i>
                        <div>
                          <strong class="d-block text-dark font-display" style="font-size: 12px;">UPI / QR Code</strong>
                          <span class="text-muted" style="font-size: 9px;">GPay, PhonePe, Paytm</span>
                        </div>
                      </label>
                    </div>
                    <div class="col-6">
                      <input type="radio" class="btn-check" name="paymentMethod" id="pay-select-cod" value="cod" autocomplete="off">
                      <label class="btn btn-outline-dark w-100 py-3 px-2 rounded-3 text-start d-flex align-items-center gap-2 text-decoration-none" for="pay-select-cod" style="cursor: pointer; font-size: 12.5px;">
                        <i class="bi bi-wallet2 text-success fs-5"></i>
                        <div>
                          <strong class="d-block text-dark font-display" style="font-size: 12px;">Cash on Delivery</strong>
                          <span class="text-muted" style="font-size: 9px;">Pay in cash at door</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- Extra Form Inputs for dynamic payment selection support -->
                  <div class="mt-3 d-none" id="pay-form-upi">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1.5" style="font-size: 9px; letter-spacing: 0.5px;">UPI ID</label>
                    <input type="text" id="upi-id-input" placeholder="e.g. username@okhdfcbank" class="form-control" style="font-size: 12.5px;" />
                  </div>
                  <div class="mt-3 d-none" id="pay-form-cod">
                    <div class="p-2.5 bg-success-subtle text-success border border-success-subtle rounded small w-100">
                      <i class="bi bi-check-circle-fill me-1.5"></i>
                      Cash on Delivery selected. You can pay cash, card, or UPI directly to the delivery rider at your doorstep.
                    </div>
                  </div>
                </div>

                <!-- Right side: Bill breakdown & Coupon section (40% width) -->
                <div class="p-4 bg-light d-flex flex-column justify-content-between text-start" style="flex-basis: 45%; background-color: #fafafa;">
                  <div>
                    <h6 class="text-uppercase text-muted fw-bold mb-3 pb-1.5 border-bottom border-dark border-opacity-10" style="font-size: 10px; letter-spacing: 0.5px;">
                      Order Invoice Summary
                    </h6>
                    
                    <div class="checkout-scroll-area overflow-y-auto mb-3 pr-1" id="checkout-items-summary" style="max-height: 140px;">
                      <!-- Dynamic inline receipt list -->
                    </div>

                    <!-- Nawabi Royal Coupon Section -->
                    <div class="card p-2 border border-dashed rounded-3 mb-3 bg-white text-start">
                      <label class="text-uppercase text-muted fw-bold d-block mb-1.5" style="font-size: 8px; letter-spacing: 0.5px;">Nawabi Promo Code</label>
                      <div class="input-group">
                        <input type="text" id="coupon-input" class="form-control form-control-sm border-end-0 py-2 text-uppercase fw-bold" placeholder="Enter SHAHI20 or LUCKNOW" style="font-size: 11.5px; letter-spacing: 0.5px;" />
                        <button type="button" id="coupon-apply-btn" class="btn btn-sm btn-dark px-3 fw-bold border-start-0" style="font-size: 11px;">Apply</button>
                      </div>
                      <div id="coupon-feedback" class="small mt-1.5 fw-semibold d-none" style="font-size: 10.5px;">
                        <!-- Feedback text generated dynamically -->
                      </div>
                    </div>

                    <!-- Elaborate breakdown rows -->
                    <div class="d-flex flex-column gap-1.5 border-top border-dark border-opacity-10 pt-3 small text-muted text-start">
                      <div class="d-flex justify-content-between align-items-center">
                        <span>Subtotal:</span>
                        <strong class="text-dark" id="checkout-calc-subtotal">₹0</strong>
                      </div>
                      <div class="d-flex justify-content-between align-items-center">
                        <span>Royal Delivery Charge:</span>
                        <strong class="text-dark" id="checkout-calc-delivery">₹0</strong>
                      </div>
                      <div class="d-flex justify-content-between align-items-center">
                        <span>Taxes & Fees:</span>
                        <strong class="text-dark" id="checkout-calc-tax">₹0</strong>
                      </div>

                      <div class="d-flex justify-content-between align-items-center text-success fw-bold d-none" id="checkout-discount-row">
                        <span>Discount (Promo):</span>
                        <span id="checkout-calc-discount">-₹0</span>
                      </div>

                      <div class="d-flex justify-content-between align-items-center border-top pt-2.5 mt-2 text-dark font-display">
                        <strong style="font-size: 13.5px;">Total Payable Amount:</strong>
                        <strong class="text-saffron fs-5" id="checkout-calc-total" style="color: #ea580c;">₹0</strong>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-top border-dark border-opacity-10 text-start">
                    <button type="submit" id="checkout-place-order-btn" class="btn btn-saffron w-100 py-3 fw-bold text-xs rounded-3 d-flex align-items-center justify-content-center gap-2">
                      <i class="bi bi-shield-fill-check"></i>
                      <span id="checkout-pay-btn-text">Authorize & Place Order</span>
                    </button>
                    <span class="text-muted text-center d-block mt-2" style="font-size: 9px;">UPI secure gateways process payments in standard RBI guidelines</span>
                  </div>

                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
          </div>
        </div>
      </div>


      <!-- ================= CONFLICT WARNING MODAL ================= -->
      <div class="modal fade" id="conflict-modal" tabindex="-1" aria-labelledby="conflictModalLabel" aria-hidden="true" style="z-index: 1070;">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg p-4 text-start">
            <div class="rounded-3 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center text-danger mb-3" style="width: 48px; height: 48px;">
              <i class="bi bi-shield-slash fs-4"></i>
            </div>
            <h5 class="font-display fw-bold text-dark mb-1" id="conflictModalLabel">Replace shopping bag?</h5>
            <p class="text-muted small mb-4" style="line-height: 1.4;">
              You already have items in your shopping bag from another Lucknow restaurant. Ordering from this kitchen will discard your active selections.
            </p>
            <div class="row g-2">
              <div class="col-6">
                <button type="button" class="btn btn-sm btn-light border text-muted fw-bold w-100 py-2" data-bs-dismiss="modal">Keep Existing</button>
              </div>
              <div class="col-6">
                <button type="button" id="conflict-confirm-btn" class="btn btn-sm btn-saffron fw-bold w-100 py-2">Discard & Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- ================= CREATE CUSTOMER ACCOUNT MODAL ================= -->
      <div class="modal fade" id="register-customer-modal" tabindex="-1" aria-labelledby="regCustomerLabel" aria-hidden="true" style="z-index: 1080;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg text-start">
            <div class="modal-header bg-dark text-white p-4 border-0">
              <div class="d-flex align-items-center gap-2.5">
                <div class="rounded-circle bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background-color: #ea580c;">
                  <i class="bi bi-person-plus-fill text-white"></i>
                </div>
                <div>
                  <h5 class="modal-title font-display fw-bold text-white m-0" id="regCustomerLabel">Create Customer Profile</h5>
                  <span class="text-muted d-block" style="font-size: 10px;">Register a new foodie account in Lucknow</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form id="reg-customer-form" class="modal-body p-4 d-flex flex-column gap-3 bg-white">
              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Full Name</label>
                <input type="text" id="reg-cust-name" required placeholder="e.g. Priya Sharma" class="form-control" style="font-size: 13px;" />
              </div>

              <div class="row g-2">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Email Address</label>
                    <input type="email" id="reg-cust-email" required placeholder="priya@example.com" class="form-control" style="font-size: 13px;" />
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Phone Number</label>
                    <input type="tel" id="reg-cust-phone" required placeholder="+91 98765 43210" class="form-control" style="font-size: 13px;" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Locality / Delivery Area</label>
                <select id="reg-cust-locality" class="form-select" style="font-size: 13px;">
                  <option value="Aminabad">Aminabad</option>
                  <option value="Hazratganj">Hazratganj</option>
                  <option value="Chowk">Chowk</option>
                  <option value="Gomti Nagar">Gomti Nagar</option>
                </select>
              </div>

              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Complete Lucknow Address</label>
                <textarea rows="3" id="reg-cust-address" required placeholder="Flat No, Wing, Society Name, Landmarks, Lucknow, Uttar Pradesh" class="form-control resize-none" style="font-size: 12px; line-height: 1.4;"></textarea>
              </div>

              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Account Password / PIN</label>
                <input type="password" id="reg-cust-password" required placeholder="Create a secure login password" class="form-control" style="font-size: 13px;" />
              </div>

              <button type="submit" class="btn btn-saffron w-100 py-2.5 fw-bold text-xs rounded-3 mt-2">
                Register Foodie Account
              </button>
            </form>
          </div>
        </div>
      </div>


      <!-- ================= REGISTER NEW RESTAURANT MODAL ================= -->
      <div class="modal fade" id="register-restaurant-modal" tabindex="-1" aria-labelledby="regRestaurantLabel" aria-hidden="true" style="z-index: 1080;">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg text-start">
            <div class="modal-header bg-dark text-white p-4 border-0">
              <div class="d-flex align-items-center gap-2.5">
                <div class="rounded-circle bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background-color: #ea580c;">
                  <i class="bi bi-egg-fried text-white"></i>
                </div>
                <div>
                  <h5 class="modal-title font-display fw-bold text-white m-0" id="regRestaurantLabel">Register Awadhi Kitchen</h5>
                  <span class="text-muted d-block" style="font-size: 10px;">Add your restaurant to Lakhnawi Bites network</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form id="reg-restaurant-form" class="modal-body p-4 d-flex flex-column gap-3 bg-white">
              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Restaurant Name</label>
                <input type="text" id="reg-rest-name" required placeholder="e.g. Naushijaan, Wahid Biryani" class="form-control" style="font-size: 13px;" />
              </div>

              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Tagline / Short Description</label>
                <input type="text" id="reg-rest-desc" required placeholder="e.g. Master chefs serving authentic Seekh Kebabs and Roomali rotis." class="form-control" style="font-size: 13px;" />
              </div>

              <div class="row g-2">
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Locality</label>
                    <select id="reg-rest-locality" class="form-select" style="font-size: 13px;">
                      <option value="Aminabad">Aminabad</option>
                      <option value="Hazratganj">Hazratganj</option>
                      <option value="Chowk">Chowk</option>
                      <option value="Gomti Nagar">Gomti Nagar</option>
                    </select>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Delivery Fee (₹)</label>
                    <input type="number" id="reg-rest-fee" required min="0" placeholder="40" class="form-control" style="font-size: 13px;" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Detailed Kitchen Address</label>
                <textarea rows="2" id="reg-rest-address" required placeholder="Naaz Cinema Road, Aminabad, Lucknow, Uttar Pradesh" class="form-control resize-none" style="font-size: 12px; line-height: 1.4;"></textarea>
              </div>

              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Banner Image URL</label>
                <input type="url" id="reg-rest-banner" placeholder="e.g. https://images.unsplash.com/..." class="form-control" style="font-size: 12.5px;" />
                <span class="text-muted d-block mt-1" style="font-size: 9px;">Leave empty for beautiful pre-selected Awadhi banner.</span>
              </div>

              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Kitchen Access Password</label>
                <input type="password" id="reg-rest-password" required placeholder="Create a password for kitchen access" class="form-control" style="font-size: 13px;" />
              </div>

              <button type="submit" class="btn btn-saffron w-100 py-2.5 fw-bold text-xs rounded-3 mt-2">
                Register Kitchen Account
              </button>
            </form>
          </div>
        </div>
      </div>


      <!-- ================= SECURITY AUTHENTICATION MODAL ================= -->
      <div class="modal fade" id="auth-modal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true" style="z-index: 1090;">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 420px;">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg text-start">
            <div class="modal-header bg-dark text-white p-4 border-0">
              <div class="d-flex align-items-center gap-2.5">
                <div class="rounded-circle bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background-color: #ea580c;">
                  <i class="bi bi-shield-lock-fill text-white"></i>
                </div>
                <div>
                  <h5 class="modal-title font-display fw-bold text-white m-0" id="authModalLabel">Identity Verification</h5>
                  <span class="text-muted d-block" style="font-size: 10px;">Please enter account password to log in</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body p-4 bg-white d-flex flex-column gap-3 text-start">
              <div class="text-center py-2 bg-light rounded mb-1 px-3">
                <span class="text-muted d-block text-uppercase fw-bold" style="font-size: 9px; letter-spacing: 0.5px;">Authenticating Account</span>
                <span class="fw-bold text-dark font-display" id="auth-target-name" style="font-size: 15px;">-</span>
              </div>

              <!-- VIEW 1: Standard Password Login -->
              <form id="auth-login-form" class="d-flex flex-column gap-3">
                <div class="form-group">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="text-uppercase text-muted fw-bold m-0" style="font-size: 9px; letter-spacing: 0.5px;">Password / Security PIN</label>
                    <a href="#" id="auth-forgot-link" class="text-saffron text-decoration-none fw-semibold" style="font-size: 11px; color: #ea580c;">Forgot Password?</a>
                  </div>
                  <div class="input-group">
                    <input type="password" id="auth-password-input" required placeholder="Enter password (default: 1234)" class="form-control border-end-0" style="font-size: 13px;" />
                    <button type="button" class="btn btn-outline-secondary border-start-0" id="auth-password-toggle" style="border-color: #dee2e6;">
                      <i class="bi bi-eye"></i>
                    </button>
                  </div>
                  <div class="invalid-feedback d-none text-danger mt-1.5 fw-semibold" id="auth-error-msg" style="font-size: 11px;">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i> Incorrect password. Please try again!
                  </div>
                </div>

                <button type="submit" class="btn btn-saffron w-100 py-2.5 fw-bold text-xs rounded-3 mt-2 d-flex align-items-center justify-content-center gap-2">
                  <i class="bi bi-shield-check"></i>
                  <span>Verify & Enter Portal</span>
                </button>
              </form>

              <!-- VIEW 2: Identity Verification (Forgot Password) -->
              <form id="auth-forgot-form" class="d-none flex-column gap-3">
                <div class="p-2.5 bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded small mb-1">
                  <i class="bi bi-info-circle-fill me-1.5"></i>
                  To reset password, enter your registered email & phone number.
                </div>

                <div class="form-group">
                  <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Registered Email</label>
                  <input type="email" id="auth-forgot-email" required placeholder="example@gmail.com" class="form-control" style="font-size: 13px;" />
                </div>

                <div class="form-group">
                  <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Registered Phone Number</label>
                  <input type="tel" id="auth-forgot-phone" required placeholder="+91 91234 56789" class="form-control" style="font-size: 13px;" />
                </div>

                <div id="auth-forgot-error" class="text-danger mt-1.5 fw-semibold d-none" style="font-size: 11px;">
                  <i class="bi bi-exclamation-triangle-fill me-1"></i> Details do not match our records!
                </div>

                <div class="row g-2 pt-2">
                  <div class="col-5">
                    <button type="button" id="auth-forgot-back" class="btn btn-sm btn-light border text-muted w-100 py-2 fw-bold" style="font-size: 12px;">Cancel</button>
                  </div>
                  <div class="col-7">
                    <button type="submit" class="btn btn-sm btn-saffron w-100 py-2 fw-bold" style="font-size: 12px;">Verify Identity</button>
                  </div>
                </div>
              </form>

              <!-- VIEW 3: Choose New Password -->
              <form id="auth-reset-form" class="d-none flex-column gap-3">
                <div class="p-2.5 bg-success-subtle text-success border border-success-subtle rounded small mb-1">
                  <i class="bi bi-shield-check-fill me-1.5"></i>
                  Identity Verified! Set your new password below.
                </div>

                <div class="form-group">
                  <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">New Password / PIN</label>
                  <input type="password" id="auth-reset-password" required placeholder="Enter new secure password" class="form-control" style="font-size: 13px;" />
                </div>

                <button type="submit" class="btn btn-saffron w-100 py-2.5 fw-bold text-xs rounded-3 mt-2 d-flex align-items-center justify-content-center gap-2">
                  <i class="bi bi-check2-circle"></i>
                  <span>Save Password & Log In</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>


      <!-- ================= RESTAURANT PASSWORD MODAL ================= -->
      <div class="modal fade" id="rest-password-modal" tabindex="-1" aria-labelledby="restPasswordModalLabel" aria-hidden="true" style="z-index: 1090;">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 420px;">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg text-start">
            <div class="modal-header bg-dark text-white p-4 border-0">
              <div class="d-flex align-items-center gap-2.5">
                <div class="rounded-circle bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background-color: #ea580c;">
                  <i class="bi bi-key-fill text-white"></i>
                </div>
                <div>
                  <h5 class="modal-title font-display fw-bold text-white m-0" id="restPasswordModalLabel">Change Kitchen Password</h5>
                  <span class="text-muted d-block" style="font-size: 10px;">Update security credentials for your kitchen</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form id="rest-password-change-form" class="modal-body p-4 d-flex flex-column gap-3 bg-white text-start">
              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Current Password</label>
                <input type="password" id="rest-curr-password" required placeholder="Enter current password" class="form-control" style="font-size: 13px;" />
              </div>
              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">New Password</label>
                <input type="password" id="rest-new-password" required placeholder="Enter new password" class="form-control" style="font-size: 13px;" />
              </div>
              
              <div id="rest-pass-error-msg" class="text-danger small d-none fw-semibold">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> Current password does not match!
              </div>
              <div id="rest-pass-success-msg" class="text-success small d-none fw-semibold">
                <i class="bi bi-check-circle-fill me-1"></i> Kitchen password updated successfully!
              </div>

              <button type="submit" class="btn btn-saffron w-100 py-2.5 fw-bold text-xs rounded-3 mt-2 d-flex align-items-center justify-content-center gap-2">
                <i class="bi bi-save"></i>
                <span>Save New Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>


      <!-- ================= ORDER DETAILS MODAL ================= -->
      <div class="modal fade" id="order-details-modal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true" style="z-index: 1090;">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 520px;">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg text-start">
            <div class="modal-header bg-dark text-white p-4 border-0">
              <div class="d-flex align-items-center gap-2.5">
                <div class="rounded-circle bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background-color: #ea580c;">
                  <i class="bi bi-receipt-cutoff text-white fs-5"></i>
                </div>
                <div>
                  <h5 class="modal-title font-display fw-bold text-white m-0" id="orderDetailsModalLabel">Royal Order Invoice</h5>
                  <span class="text-muted d-block font-mono" id="detail-order-id" style="font-size: 11px;">Order #...</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <div class="modal-body p-4 bg-white">
              <!-- Header info: Restaurant & Status -->
              <div class="d-flex justify-content-between align-items-start bg-light rounded p-3 mb-4">
                <div>
                  <span class="text-uppercase text-muted fw-bold d-block" style="font-size: 8px; letter-spacing: 0.5px;">Eatery Kitchen</span>
                  <strong class="text-dark font-display fs-6" id="detail-restaurant-name">-</strong>
                  <span class="text-muted d-block small mt-0.5" id="detail-order-date">-</span>
                </div>
                <div class="text-end">
                  <span class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 8px; letter-spacing: 0.5px;">Status</span>
                  <span class="badge px-2.5 py-1.5 text-uppercase" id="detail-order-status" style="font-size: 10px;">-</span>
                </div>
              </div>

              <!-- Items section -->
              <div class="mb-4">
                <h6 class="text-uppercase text-muted fw-bold mb-2.5 pb-1 border-bottom" style="font-size: 10px; letter-spacing: 0.5px;">Culinary Line Items</h6>
                <div id="detail-items-container" class="d-flex flex-column gap-2">
                  <!-- Dynamic items list -->
                </div>
              </div>

              <!-- Bill details section -->
              <div class="bg-light rounded p-3 mb-4 text-start">
                <h6 class="text-uppercase text-muted fw-bold mb-2.5 pb-1 border-bottom" style="font-size: 9px; letter-spacing: 0.5px;">Royal Bill Breakdown</h6>
                
                <div class="d-flex justify-content-between align-items-center mb-1.5 small text-muted">
                  <span>Subtotal:</span>
                  <span class="fw-semibold text-dark" id="detail-subtotal">₹0</span>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mb-1.5 small text-muted">
                  <span>Royal Delivery Fee:</span>
                  <span class="fw-semibold text-dark" id="detail-delivery">₹0</span>
                </div>

                <!-- Detailed Tax Breakdown -->
                <div class="ps-2 border-start border-2 border-dashed border-light-subtle mb-1.5">
                  <div class="d-flex justify-content-between align-items-center mb-1 text-muted" style="font-size: 11px;">
                    <span>CGST (2.5%):</span>
                    <span id="detail-cgst">₹0</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mb-1 text-muted" style="font-size: 11px;">
                    <span>SGST (2.5%):</span>
                    <span id="detail-sgst">₹0</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center text-muted" style="font-size: 11px;">
                    <span>Restaurant Packaging Charge:</span>
                    <span id="detail-packaging">₹0</span>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-2.5 small text-muted d-none" id="detail-discount-row">
                  <span class="text-success fw-semibold">Discount Applied:</span>
                  <span class="text-success fw-bold" id="detail-discount">-₹0</span>
                </div>

                <div class="d-flex justify-content-between align-items-center pt-2.5 border-top border-dark border-opacity-10">
                  <strong class="text-dark font-display" style="font-size: 14px;">Total Amount Paid:</strong>
                  <strong class="text-saffron font-display fs-5" id="detail-total" style="color: #ea580c;">₹0</strong>
                </div>
              </div>

              <!-- Delivery and Payment Info -->
              <div class="border rounded p-3 mb-2 small text-muted">
                <div class="mb-2">
                  <strong class="text-dark d-block mb-1 font-display" style="font-size: 11px;"><i class="bi bi-geo-alt-fill text-danger me-1"></i> Delivery Address</strong>
                  <span id="detail-address">-</span>
                </div>
                <div>
                  <strong class="text-dark d-block mb-1 font-display" style="font-size: 11px;"><i class="bi bi-credit-card-2-front me-1 text-primary"></i> Payment Method</strong>
                  <span id="detail-payment-method" class="text-uppercase">-</span>
                </div>
              </div>
            </div>

            <div class="modal-footer bg-light border-0 p-3 d-flex justify-content-between align-items-center">
              <span class="text-muted" style="font-size: 10px;">Thank you for ordering with us!</span>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-sm btn-dark px-3 rounded-2" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= LEAVE RATE & REVIEW MODAL ================= -->
      <div class="modal fade" id="rate-review-modal" tabindex="-1" aria-labelledby="rateReviewModalLabel" aria-hidden="true" style="z-index: 1090;">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 450px;">
          <div class="modal-content overflow-hidden border-0 rounded-4 shadow-lg text-start">
            <div class="modal-header bg-dark text-white p-4 border-0">
              <div class="d-flex align-items-center gap-2.5">
                <div class="rounded-circle bg-saffron text-white d-flex align-items-center justify-content-center" style="width: 38px; height: 38px; background-color: #ea580c;">
                  <i class="bi bi-star-fill text-white"></i>
                </div>
                <div>
                  <h5 class="modal-title font-display fw-bold text-white m-0" id="rateReviewModalLabel">Write a Royal Review</h5>
                  <span class="text-muted d-block font-sans" style="font-size: 10px;" id="review-modal-subtitle">Share your experience with Lakhnawi Bites</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            
            <form id="rate-review-form" class="modal-body p-4 bg-white d-flex flex-column gap-4 text-start">
              <input type="hidden" id="review-restaurant-id" />
              <input type="hidden" id="review-order-id" />
              
              <!-- Star rating select group -->
              <div class="text-center">
                <span class="text-uppercase text-muted fw-bold d-block mb-2" style="font-size: 9px; letter-spacing: 0.5px;">Select Rating</span>
                <div class="d-flex align-items-center justify-content-center gap-2" id="star-rating-container" style="font-size: 28px;">
                  <i class="bi bi-star star-btn text-secondary" style="cursor: pointer;" data-val="1"></i>
                  <i class="bi bi-star star-btn text-secondary" style="cursor: pointer;" data-val="2"></i>
                  <i class="bi bi-star star-btn text-secondary" style="cursor: pointer;" data-val="3"></i>
                  <i class="bi bi-star star-btn text-secondary" style="cursor: pointer;" data-val="4"></i>
                  <i class="bi bi-star star-btn text-secondary" style="cursor: pointer;" data-val="5"></i>
                </div>
                <input type="hidden" id="review-rating-value" required value="" />
                <span class="text-muted small mt-2 d-block" id="rating-text-feedback">Choose 1 to 5 stars</span>
              </div>

              <!-- Textarea for written review -->
              <div class="form-group">
                <label class="text-uppercase text-muted fw-bold d-block mb-1.5" style="font-size: 9px; letter-spacing: 0.5px;">Your Written Review</label>
                <textarea rows="4" id="review-text-input" required placeholder="Tell us about the taste, quality, packaging, and delivery..." class="form-control" style="font-size: 12.5px; line-height: 1.4; border-radius: 8px;"></textarea>
              </div>

              <div id="review-error-msg" class="text-danger small d-none fw-semibold">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> Please pick a rating and write a brief review.
              </div>
              
              <div id="review-success-msg" class="text-success small d-none fw-semibold text-center p-2 bg-success-subtle rounded border border-success-subtle">
                <i class="bi bi-check-circle-fill me-1"></i> Review posted! Thank you for sharing your Nawabi taste!
              </div>

              <button type="submit" class="btn btn-saffron w-100 py-2.5 fw-bold text-xs rounded-3 mt-2 d-flex align-items-center justify-content-center gap-2">
                <i class="bi bi-pencil-square"></i>
                <span>Submit Foodie Review</span>
              </button>
            </form>
          </div>
        </div>
      </div>
`;
