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
