import { state } from "../state.js";
import { navigateTo } from "../render.js";

export const profileView = `
        <!-- ================= USER PROFILE VIEW ================= -->
        <div id="profile-view" class="container py-5 d-none">
          <div class="row g-4 text-start">
            
            <!-- Profile Info Sidebar Card -->
            <div class="col-lg-4 col-12">
              <div class="card shadow-xs border p-4 h-100">
                <div class="text-center pb-4 border-bottom">
                  <div class="rounded-circle text-white d-flex align-items-center justify-content-center mx-auto mb-3 position-relative" id="profile-avatar" style="width: 96px; height: 96px; font-size: 32px; font-weight: 900; background: linear-gradient(45deg, #ea580c 0%, #dc2626 100%);">
                    K
                    <div class="position-absolute rounded-circle bg-success border border-white" style="bottom: 4px; right: 4px; width: 20px; height: 20px;" title="Active Account"></div>
                  </div>
                  <h5 class="font-display fw-bold text-dark m-0" id="profile-display-name">Keshav Pandey</h5>
                  <p class="text-muted small mt-1 mb-0 d-inline-flex align-items-center gap-1.5 justify-content-center">
                    <i class="bi bi-geo-alt-fill text-danger"></i>
                    <span>Lucknow, Uttar Pradesh</span>
                  </p>
                </div>

                <!-- View profile details mode -->
                <div id="profile-details-read" class="mt-4 d-flex flex-column gap-3 text-start">
                  <div class="form-group">
                    <span class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Email Address</span>
                    <p class="small fw-semibold text-dark m-0 d-flex align-items-center gap-2" id="profile-read-email">
                      <i class="bi bi-envelope text-muted"></i>
                      keshavpandey200222@gmail.com
                    </p>
                  </div>
                  <div class="form-group">
                    <span class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Contact Phone</span>
                    <p class="small fw-semibold text-dark m-0 d-flex align-items-center gap-2" id="profile-read-phone">
                      <i class="bi bi-telephone text-muted"></i>
                      +91 91234 56789
                    </p>
                  </div>
                  <div class="form-group">
                    <span class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Delivery Address</span>
                    <div class="p-3 bg-light rounded-3 border border-zinc-200 small lh-base text-muted" id="profile-read-address">
                      <i class="bi bi-geo-alt text-danger me-1"></i>
                      Room 304, S.R. Institute of Management & Technology, Bakshi Ka Talab, Lucknow, UP - 226201
                    </div>
                  </div>

                  <button id="profile-edit-btn" class="btn btn-outline-saffron w-100 py-2 mt-3 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-pencil-square"></i>
                    <span>Edit Profile</span>
                  </button>
                </div>

                <!-- Edit profile details form mode -->
                <form id="profile-edit-form" class="mt-4 d-none flex-column gap-3 text-start">
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Full Name</label>
                    <input type="text" id="profile-name-input" required class="form-control form-control-sm py-2" style="font-size: 13px;" />
                  </div>
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Email</label>
                    <input type="email" id="profile-email-input" required class="form-control form-control-sm py-2" style="font-size: 13px;" />
                  </div>
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Phone Number</label>
                    <input type="tel" id="profile-phone-input" required class="form-control form-control-sm py-2" style="font-size: 13px;" />
                  </div>
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Delivery Address (Lucknow)</label>
                    <textarea rows="3" id="profile-address-input" required class="form-control form-control-sm py-2 resize-none" style="font-size: 12px; line-height: 1.4;"></textarea>
                  </div>
                  <div class="form-group">
                    <label class="text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 9px; letter-spacing: 0.5px;">Account Password / PIN</label>
                    <input type="password" id="profile-password-input" required class="form-control form-control-sm py-2" style="font-size: 13px;" />
                  </div>

                  <div class="row g-2 pt-2">
                    <div class="col-6">
                      <button type="button" id="profile-edit-cancel" class="btn btn-sm btn-light border text-muted w-100 py-2 fw-bold">Cancel</button>
                    </div>
                    <div class="col-6">
                      <button type="submit" class="btn btn-sm btn-saffron w-100 py-2 fw-bold">Save</button>
                    </div>
                  </div>
                </form>

                <div class="alert alert-success mt-3 p-2 d-none rounded text-center small fw-bold" id="profile-success-alert">
                  <i class="bi bi-check-circle-fill me-1"></i> Profile updated successfully!
                </div>

                <div class="border-top mt-4 pt-4 d-flex flex-column gap-2">
                  <button id="profile-logout-btn" class="btn btn-outline-danger w-100 py-2.5 d-flex align-items-center justify-content-center gap-2" style="font-weight: 600; font-size: 13px; border-radius: 8px;">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Logout from Account</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Orders History column -->
            <div class="col-lg-8 col-12">
              <div class="card shadow-xs border p-4 h-100">
                <div class="d-flex align-items-center justify-content-between pb-3 border-bottom">
                  <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-receipt text-danger fs-5"></i>
                    <h5 class="font-display fw-bold text-dark m-0">My Orders History</h5>
                  </div>
                  <span class="badge bg-danger rounded-pill px-3 py-1.5" id="profile-orders-count" style="font-size: 11px;">2 total orders</span>
                </div>

                <!-- Container of order cards -->
                <div class="d-flex flex-column gap-4 mt-4" id="profile-orders-list">
                  <!-- Rendered dynamically -->
                </div>
              </div>
            </div>

            <!-- Suggestions & Experience Feedback Section -->
            <div class="col-12">
              <div class="card shadow-xs border p-4">
                <div class="d-flex align-items-center gap-2 pb-3 border-bottom mb-4">
                  <i class="bi bi-chat-heart text-danger fs-5"></i>
                  <h5 class="font-display fw-bold text-dark m-0">Share Your Experience</h5>
                </div>

                <form id="feedback-form" class="d-flex flex-column gap-4">
                  <!-- Experience Rating -->
                  <div>
                    <label class="text-uppercase text-muted fw-bold d-block mb-2" style="font-size: 9px; letter-spacing: 0.5px;">How's your experience with Lakhnawi Bites?</label>
                    <div class="d-flex gap-2 flex-wrap" id="feedback-emoji-container">
                      <button type="button" class="btn btn-light border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 feedback-emoji-btn" data-rating="1" style="font-size: 13px; transition: all 0.2s ease;">
                        <span class="fw-semibold text-muted">Poor</span>
                      </button>
                      <button type="button" class="btn btn-light border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 feedback-emoji-btn" data-rating="2" style="font-size: 13px; transition: all 0.2s ease;">
                        <span class="fw-semibold text-muted">Fair</span>
                      </button>
                      <button type="button" class="btn btn-light border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 feedback-emoji-btn" data-rating="3" style="font-size: 13px; transition: all 0.2s ease;">
                        <span class="fw-semibold text-muted">Good</span>
                      </button>
                      <button type="button" class="btn btn-light border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 feedback-emoji-btn" data-rating="4" style="font-size: 13px; transition: all 0.2s ease;">
                        <span class="fw-semibold text-muted">Great</span>
                      </button>
                      <button type="button" class="btn btn-light border rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2 feedback-emoji-btn" data-rating="5" style="font-size: 13px; transition: all 0.2s ease;">
                        <span class="fw-semibold text-muted">Amazing</span>
                      </button>
                    </div>
                    <input type="hidden" id="feedback-rating-value" value="" />
                  </div>

                  <!-- Category Tags -->
                  <div>
                    <label class="text-uppercase text-muted fw-bold d-block mb-2" style="font-size: 9px; letter-spacing: 0.5px;">What can we improve? (Optional)</label>
                    <div class="d-flex gap-2 flex-wrap" id="feedback-tags-container">
                      <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 feedback-tag-btn" data-tag="delivery" style="font-size: 12px; transition: all 0.2s ease;">Delivery Speed</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 feedback-tag-btn" data-tag="food-quality" style="font-size: 12px; transition: all 0.2s ease;">Food Quality</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 feedback-tag-btn" data-tag="packaging" style="font-size: 12px; transition: all 0.2s ease;">Packaging</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 feedback-tag-btn" data-tag="app-experience" style="font-size: 12px; transition: all 0.2s ease;">App Experience</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 feedback-tag-btn" data-tag="pricing" style="font-size: 12px; transition: all 0.2s ease;">Pricing</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 feedback-tag-btn" data-tag="variety" style="font-size: 12px; transition: all 0.2s ease;">Menu Variety</button>
                    </div>
                  </div>

                  <!-- Suggestion Text -->
                  <div>
                    <label class="text-uppercase text-muted fw-bold d-block mb-2" style="font-size: 9px; letter-spacing: 0.5px;">Your Suggestions or Feedback</label>
                    <textarea id="feedback-text-input" rows="4" class="form-control py-2.5 px-3" placeholder="Tell us what you love, what could be better, or any feature you'd like to see..." style="font-size: 13px; line-height: 1.6; border-radius: 10px; resize: none; border: 1.5px solid #e4e4e7; transition: all 0.25s ease;"></textarea>
                    <div class="d-flex justify-content-end mt-1">
                      <small class="text-muted" id="feedback-char-count" style="font-size: 10px;">0 / 500</small>
                    </div>
                  </div>

                  <!-- Submit -->
                  <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pt-2 border-top">
                    <p class="text-muted small m-0 d-flex align-items-center gap-1.5" style="font-size: 11px;">
                      <i class="bi bi-shield-check text-success"></i>
                      Your feedback is anonymous and helps us serve you better.
                    </p>
                    <button type="submit" id="feedback-submit-btn" class="btn btn-saffron px-4 py-2.5 d-inline-flex align-items-center gap-2 rounded-pill fw-bold" style="font-size: 13px;">
                      <i class="bi bi-send-fill"></i>
                      Submit Feedback
                    </button>
                  </div>
                </form>

                <!-- Success message -->
                <div class="alert alert-success mt-4 p-3 d-none rounded-3 text-center d-flex align-items-center justify-content-center gap-2" id="feedback-success-alert" style="font-size: 13px;">
                  <i class="bi bi-check-circle-fill fs-5"></i>
                  <span class="fw-bold">Thank you for your feedback! Your suggestions help us improve Lakhnawi Bites.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
`;

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
