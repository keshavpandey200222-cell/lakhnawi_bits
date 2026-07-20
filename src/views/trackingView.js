import { state } from "../state.js";
import { navigateTo } from "../render.js";

const googleMapNodes = [
  { name: "Aminabad Old Market", position: { lat: 26.8415, lng: 80.9248 } },
  { name: "Hazratganj Crossing", position: { lat: 26.8510, lng: 80.9440 } },
  { name: "Gomti River Bridge", position: { lat: 26.8568, lng: 80.9632 } },
  { name: "Gomti Nagar (Your Residence)", position: { lat: 26.8600, lng: 81.0000 } }
];

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

export function renderOrderTracking() {
  const order = state.orderHistory.find(o => o.id === state.activeOrderId);
  if (!order) {
    navigateTo('home');
    return;
  }

  const deliveryAddressEl = document.getElementById("tracking-delivery-address");
  if (deliveryAddressEl) {
    deliveryAddressEl.innerText = order.restaurantId === "idris-chowk" 
      ? "Chowk Road crossing, Hazratganj Bypass, Lucknow, UP." 
      : "Aminabad Bypass, Gomti Nagar Crossing, Lucknow, UP.";
  }

  const ffBtn = document.getElementById("tracking-fast-forward");
  if (ffBtn) {
    if (order.status === "delivered") {
      ffBtn.disabled = true;
      ffBtn.classList.add('disabled', 'opacity-50');
    } else {
      ffBtn.disabled = false;
      ffBtn.classList.remove('disabled', 'opacity-50');
    }
  }

  const rateBtn = document.getElementById("tracking-rate-btn");
  if (rateBtn) {
    if (order.status === "delivered") {
      rateBtn.classList.remove('d-none');
      rateBtn.classList.add('d-flex');
      rateBtn.onclick = () => {
        const inputRestId = document.getElementById("review-restaurant-id");
        const inputOrderId = document.getElementById("review-order-id");
        const modalSubtitle = document.getElementById("review-modal-subtitle");
        
        if (inputRestId) inputRestId.value = order.restaurantId;
        if (inputOrderId) inputOrderId.value = order.id;
        if (modalSubtitle) modalSubtitle.innerText = `Share your experience with ${order.restaurantName}`;

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
      };
    } else {
      rateBtn.classList.add('d-none');
      rateBtn.classList.remove('d-flex');
    }
  }

  const etaVal = document.getElementById("tracking-eta-val");
  const statusBadge = document.getElementById("tracking-status-badge");
  
  if (etaVal) {
    if (order.status === "delivered") {
      etaVal.innerText = "Arrived!";
    } else if (order.status === "dispatched") {
      etaVal.innerText = "12 Mins";
    } else if (order.status === "preparing") {
      etaVal.innerText = "20 Mins";
    } else {
      etaVal.innerText = "30 Mins";
    }
  }

  if (statusBadge) {
    statusBadge.innerText = order.status;
    statusBadge.className = `badge border text-uppercase ${
      order.status === 'delivered' ? 'bg-success' : 'bg-dark'
    }`;
  }

  const stepsDef = ['confirmed', 'preparing', 'dispatched', 'delivered'];
  const activeIdx = stepsDef.indexOf(order.status);

  for (let i = 1; i <= 4; i++) {
    const idx = i - 1;
    const stepEl = document.getElementById(`tracking-step-${i}`);
    if (stepEl) {
      const node = stepEl.querySelector('.step-node');
      const title = stepEl.querySelector('.step-title');
      
      if (node && title) {
        if (idx < activeIdx) {
          node.className = "step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0 bg-danger border-danger text-white";
          title.className = "fw-bold mb-1 step-title text-dark";
        } else if (idx === activeIdx) {
          node.className = "step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0 bg-dark border-dark text-white shadow";
          title.className = "fw-bold mb-1 step-title text-danger";
        } else {
          node.className = "step-node rounded-3 d-flex align-items-center justify-content-center border shrink-0 bg-white text-muted border-secondary-subtle";
          title.className = "fw-bold mb-1 step-title text-muted";
        }
      }
    }
  }

  setTimeout(() => {
    initializeTrackingMap(order);
  }, 100);
}

function getRiderLatLng(status) {
  switch (status) {
    case "confirmed":
      return { lat: 26.8415, lng: 80.9248 };
    case "preparing":
      return { lat: 26.8462, lng: 80.9344 };
    case "dispatched":
      return { lat: 26.8568, lng: 80.9632 };
    case "delivered":
      return { lat: 26.8600, lng: 81.0000 };
    default:
      return { lat: 26.8415, lng: 80.9248 };
  }
}

function initializeTrackingMap(order) {
  const container = document.getElementById('map-container');
  if (!container) return;

  const riderLatLng = getRiderLatLng(order.status);
  const activeStepIdx = ['confirmed', 'preparing', 'dispatched', 'delivered'].indexOf(order.status);

  if (state.mapInstance) {
    state.mapMarkers.forEach(m => m.remove());
    state.mapMarkers = [];
    if (state.mapPolyline) state.mapPolyline.remove();
    if (state.mapRiderMarker) state.mapRiderMarker.remove();

    state.mapInstance.panTo([riderLatLng.lat, riderLatLng.lng]);
  } else {
    state.mapInstance = window.L.map(container, {
      center: [26.8510, 80.9550],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(state.mapInstance);
  }

  googleMapNodes.forEach((node, idx) => {
    const isCompletedOrActive = idx <= activeStepIdx;
    const markerColor = isCompletedOrActive ? "#ea580c" : "#71717a";
    const markerBorder = isCompletedOrActive ? "#ffffff" : "#e4e4e7";

    const customIcon = window.L.divIcon({
      html: `
        <div style="
          width: 16px; 
          height: 16px; 
          background-color: ${markerColor}; 
          border: 2px solid ${markerBorder}; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 4px; height: 4px; background-color: white; border-radius: 50%;"></div>
        </div>
      `,
      className: 'custom-leaflet-node-icon',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const marker = window.L.marker([node.position.lat, node.position.lng], { icon: customIcon })
      .addTo(state.mapInstance)
      .bindPopup(`
        <div class="p-1 font-sans text-xs">
          <strong class="text-zinc-950 block font-bold" style="font-size: 11.5px; color:#18181b;">${node.name}</strong>
          <span class="text-muted" style="font-size: 9.5px;">${idx === 0 ? "Starting Kitchen" : idx === googleMapNodes.length - 1 ? "Delivery Destination" : "Transit Waypoint"}</span>
        </div>
      `);
    
    state.mapMarkers.push(marker);
  });

  const latlngs = googleMapNodes.map(n => [n.position.lat, n.position.lng]);
  state.mapPolyline = window.L.polyline(latlngs, {
    color: "#ea580c",
    weight: 4,
    opacity: 0.8,
    dashArray: "6, 6"
  }).addTo(state.mapInstance);

  const riderIcon = window.L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: #ea580c;
        border: 2px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 10px rgba(234, 88, 12, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        animation: pulse-ring-leaflet 1.5s infinite;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      </div>
      <style>
        @keyframes pulse-ring-leaflet {
          0% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(234, 88, 12, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 88, 12, 0); }
        }
      </style>
    `,
    className: 'custom-leaflet-rider-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  state.mapRiderMarker = window.L.marker([riderLatLng.lat, riderLatLng.lng], { icon: riderIcon })
    .addTo(state.mapInstance)
    .bindPopup(`
      <div class="p-1 font-sans text-xs">
        <strong class="text-zinc-950 block font-bold" style="font-size: 11px; color:#18181b;">Ramesh Kumar (Your Rider)</strong>
        <span class="text-danger fw-bold" style="font-size: 9.5px;">On the way with your Awadhi meal!</span>
      </div>
    `);

  state.mapInstance.panTo([riderLatLng.lat, riderLatLng.lng]);
}
