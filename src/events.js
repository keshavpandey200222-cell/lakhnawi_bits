import { state, saveState, getCartRestaurant, getBillingDetails } from "./state.js";
import { navigateTo, renderHeader, renderRestaurants, renderCartDrawer, renderProfile, renderOrderTracking, renderRestaurantWorkspace } from "./render.js";
import { createCustomerOnServer, createRestaurantOnServer, createMenuItemOnServer, updateCustomerProfileOnServer, updateRestaurantPasswordOnServer, createOrderOnServer, createReviewOnServer, updateOrderStatusOnServer } from "./api.js";




const FORMSPREE_URL = "https://formspree.io/f/mqerppob";

function sendToFormspree(formType, data) {
  fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ _formType: formType, _submittedAt: new Date().toISOString(), ...data })
  }).catch(err => console.warn("Formspree submission failed (non-blocking):", err));
}


export function resetAuthModalViews() {
  const loginForm = document.getElementById("auth-login-form");
  const forgotForm = document.getElementById("auth-forgot-form");
  const resetForm = document.getElementById("auth-reset-form");

  if (loginForm) {
    loginForm.classList.remove("d-none");
    loginForm.classList.add("d-flex");
  }
  if (forgotForm) {
    forgotForm.classList.add("d-none");
    forgotForm.classList.remove("d-flex");
  }
  if (resetForm) {
    resetForm.classList.add("d-none");
    resetForm.classList.remove("d-flex");
  }

  const passwordInput = document.getElementById("auth-password-input");
  if (passwordInput) passwordInput.value = "";
  
  const errorMsgEl = document.getElementById("auth-error-msg");
  errorMsgEl?.classList.add("d-none");

  const forgotEmail = document.getElementById("auth-forgot-email");
  const forgotPhone = document.getElementById("auth-forgot-phone");
  const forgotError = document.getElementById("auth-forgot-error");
  if (forgotEmail) forgotEmail.value = "";
  if (forgotPhone) forgotPhone.value = "";
  forgotError?.classList.add("d-none");

  const resetPass = document.getElementById("auth-reset-password");
  if (resetPass) resetPass.value = "";
}


export function setPaymentMethod(method) {
  state.selectedPaymentMethod = method;

  const methods = ['card', 'upi', 'cod'];
  methods.forEach(m => {
    const btn = document.getElementById(`pay-select-${m}`);
    const form = document.getElementById(`pay-form-${m}`);
    if (btn) {
      if (m === method) {
        btn.classList.add('btn-danger', 'bg-danger-subtle', 'border-danger', 'text-danger', 'fw-bold');
        btn.classList.remove('btn-light', 'text-secondary');
      } else {
        btn.classList.remove('btn-danger', 'bg-danger-subtle', 'border-danger', 'text-danger', 'fw-bold');
        btn.classList.add('btn-light', 'text-secondary');
      }
    }
    if (form) {
      if (m === method) {
        form.classList.remove('d-none');
        form.classList.add('d-flex');
      } else {
        form.classList.add('d-none');
        form.classList.remove('d-flex');
      }
    }
  });

  const cardInputs = ['card-name-input', 'card-number-input', 'card-expiry-input', 'card-cvv-input'];
  cardInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.required = (method === 'card');
  });

  const upiInput = document.getElementById("upi-id-input");
  if (upiInput) upiInput.required = (method === 'upi');
}

function processPayment() {
  const overlay = document.getElementById("payment-processing-overlay");
  const forms = document.getElementById("checkout-modal-forms");
  const modalClose = document.getElementById("checkout-modal-close");
  const stepText = document.getElementById("payment-processing-step");

  if (!overlay || !forms || !modalClose || !stepText) return;

  forms.classList.add('d-none');
  overlay.classList.remove('d-none');
  overlay.classList.add('d-flex');
  modalClose.classList.add('disabled');
  modalClose.disabled = true;

  const steps = [
    "Establishing secure 256-bit SSL encrypted tunnel...",
    "Sending routing payload to merchant gateway...",
    "Authorizing tokenization with your Bank institution...",
    "Order securely finalized! Generating Awadhi tracking code..."
  ];

  let currentStep = 0;
  stepText.innerText = steps[0];

  const interval = setInterval(() => {
    currentStep++;
    if (currentStep < steps.length) {
      stepText.innerText = steps[currentStep];
    } else {
      clearInterval(interval);
      finalizeOrderPayment();
    }
  }, 1000);
}

function finalizeOrderPayment() {
  const activeRest = getCartRestaurant();
  if (!activeRest) return;

  const billing = getBillingDetails();
  const paymentTextMap = {
    card: "Credit/Debit Card",
    upi: `UPI (${document.getElementById("upi-id-input")?.value || 'keshav@upi'})`,
    cod: "Cash on Delivery"
  };

  const newOrder = {
    id: `LKO-${Math.floor(1000 + Math.random() * 9000)}`,
    restaurantId: activeRest.id,
    restaurantName: activeRest.name,
    customerId: state.currentCustomerId || "cust-keshav",
    items: [...state.cartItems],
    subtotal: billing.subtotal,
    deliveryFee: billing.deliveryFee,
    taxAndFees: billing.taxAndFees,
    discount: billing.discount,
    total: billing.total,
    status: "confirmed",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    paymentMethod: paymentTextMap[state.selectedPaymentMethod],
    eta: "25-35 min",
    trackingStep: 1
  };

  createOrderOnServer(newOrder);

  
  sendToFormspree("Order Placed", {
    orderId: newOrder.id,
    restaurant: newOrder.restaurantName,
    customerName: state.userProfile.name,
    customerEmail: state.userProfile.email,
    customerPhone: state.userProfile.phone,
    deliveryAddress: state.userProfile.address,
    items: newOrder.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(", "),
    subtotal: newOrder.subtotal,
    deliveryFee: newOrder.deliveryFee,
    tax: newOrder.taxAndFees,
    discount: newOrder.discount,
    total: newOrder.total,
    paymentMethod: newOrder.paymentMethod
  });

  state.orderHistory = [newOrder, ...state.orderHistory];
  state.activeOrderId = newOrder.id;

  state.cartItems = [];
  state.appliedCoupon = null;

  saveState();

  const modalEl = document.getElementById('checkout-modal');
  if (modalEl) {
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.hide();
  }

  const overlay = document.getElementById("payment-processing-overlay");
  const forms = document.getElementById("checkout-modal-forms");
  const modalClose = document.getElementById("checkout-modal-close");
  if (overlay) overlay.classList.add('d-none');
  if (forms) forms.classList.remove('d-none');
  if (modalClose) {
    modalClose.classList.remove('disabled');
    modalClose.disabled = false;
  }

  const inputs = ['card-name-input', 'card-number-input', 'card-expiry-input', 'card-cvv-input', 'upi-id-input'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  navigateTo('tracking');
}

export function performLogout() {
  state.currentCustomerId = "";
  state.currentRestaurantId = "";
  state.cartItems = [];
  saveState();
  
  navigateTo('portal-landing');
  
  const alertBox = document.createElement('div');
  alertBox.className = "position-fixed bottom-0 end-0 m-4 alert alert-dark text-white border-0 shadow-lg d-flex align-items-center gap-2 p-3";
  alertBox.style.zIndex = "2000";
  alertBox.style.borderRadius = "12px";
  alertBox.style.backgroundColor = "#18181b";
  alertBox.innerHTML = `
    <i class="bi bi-box-arrow-left text-danger"></i>
    <div class="small fw-bold">Successfully logged out from Lakhnawi Bites.</div>
  `;
  document.body.appendChild(alertBox);
  setTimeout(() => {
    alertBox.style.transition = "opacity 0.5s ease";
    alertBox.style.opacity = "0";
    setTimeout(() => alertBox.remove(), 500);
  }, 2500);
}




export function bindAllEvents() {
  
  
  const logoBtn = document.getElementById("nav-logo") || document.getElementById("nav-logo-btn");
  logoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    state.searchQuery = ""; // Reset search inline to avoid hoisting issues
    
    if (state.currentCustomerId) {
      navigateTo('home');
    } else if (state.currentRestaurantId) {
      navigateTo('restaurant');
    } else {
      navigateTo('portal-landing');
    }
  });

  
  const onSearchChanged = (val) => {
    state.searchQuery = val;
    
    if (state.activeView !== 'home') {
      navigateTo('home');
    }
    
    const navSearchInput = document.getElementById("nav-search-input");
    const heroSearchInput = document.getElementById("hero-search-input");
    if (navSearchInput && navSearchInput.value !== val) navSearchInput.value = val;
    if (heroSearchInput && heroSearchInput.value !== val) heroSearchInput.value = val;

    const navClearBtn = document.getElementById("nav-search-clear");
    const heroClearBtn = document.getElementById("hero-search-clear");
    if (navClearBtn) {
      if (val) {
        navClearBtn.classList.remove('d-none');
      } else {
        navClearBtn.classList.add('d-none');
      }
    }
    if (heroClearBtn) {
      if (val) {
        heroClearBtn.classList.remove('d-none');
      } else {
        heroClearBtn.classList.add('d-none');
      }
    }

    renderRestaurants();
  };

  const onLocalityChanged = (val) => {
    state.selectedLocality = val;
    
    const navLocSelect = document.getElementById("nav-locality-select");
    const heroLocSelect = document.getElementById("hero-locality-select");
    if (navLocSelect && navLocSelect.value !== val) navLocSelect.value = val;
    if (heroLocSelect && heroLocSelect.value !== val) heroLocSelect.value = val;

    renderRestaurants();
  };

  
  const navLocality = document.getElementById("nav-locality-select");
  navLocality?.addEventListener('change', () => {
    onLocalityChanged(navLocality.value);
  });

  const heroLocality = document.getElementById("hero-locality-select");
  heroLocality?.addEventListener('change', () => {
    onLocalityChanged(heroLocality.value);
  });

  
  const navSearch = document.getElementById("nav-search-input");
  navSearch?.addEventListener('input', () => {
    onSearchChanged(navSearch.value);
  });

  const heroSearch = document.getElementById("hero-search-input");
  heroSearch?.addEventListener('input', () => {
    onSearchChanged(heroSearch.value);
  });

  
  document.getElementById("nav-search-clear")?.addEventListener('click', () => {
    onSearchChanged("");
  });
  document.getElementById("hero-search-clear")?.addEventListener('click', () => {
    onSearchChanged("");
  });

  
  document.querySelectorAll(".quick-tag").forEach(tag => {
    tag.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const query = btn.getAttribute("data-query") || "";
      onSearchChanged(query);
      
      const grid = document.getElementById("restaurant-grid");
      grid?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  
  const openCart = () => {
    renderCartDrawer();
    const offcanvasEl = document.getElementById('cart-offcanvas');
    if (offcanvasEl) {
      const offcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.show();
    }
  };
  document.getElementById("nav-cart-btn-desktop")?.addEventListener('click', openCart);
  document.getElementById("nav-cart-btn-mobile")?.addEventListener('click', openCart);
  document.getElementById("nav-cart-btn")?.addEventListener('click', openCart);

  
  const openProfile = () => {
    navigateTo('profile');
  };
  document.getElementById("nav-profile-btn-desktop")?.addEventListener('click', openProfile);
  document.getElementById("nav-profile-btn-mobile")?.addEventListener('click', openProfile);
  document.getElementById("nav-profile-btn")?.addEventListener('click', openProfile);



  
  document.getElementById("hero-explore-btn")?.addEventListener('click', () => {
    onLocalityChanged("All Localities");
    onSearchChanged("");
    const grid = document.getElementById("restaurant-grid");
    grid?.scrollIntoView({ behavior: 'smooth' });
  });

  
  const menuSearchInput = document.getElementById("menu-search-input");
  menuSearchInput?.addEventListener('input', () => {
    state.menuSearchQuery = menuSearchInput.value;
    renderMenu();
  });

  
  document.getElementById("menu-back-btn")?.addEventListener('click', () => {
    navigateTo('home');
  });

  
  document.getElementById("cart-checkout-btn")?.addEventListener('click', () => {
    const offcanvasEl = document.getElementById('cart-offcanvas');
    if (offcanvasEl) {
      const offcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      offcanvas.hide();
    }

    const billing = getBillingDetails();
    
    const elSubtotal = document.getElementById("checkout-calc-subtotal");
    const elDiscountRow = document.getElementById("checkout-discount-row");
    const elDiscount = document.getElementById("checkout-calc-discount");
    const elDelivery = document.getElementById("checkout-calc-delivery");
    const elTax = document.getElementById("checkout-calc-tax");
    const elTotal = document.getElementById("checkout-calc-total");
    const elTotalBtnText = document.getElementById("checkout-pay-btn-text");

    if (elSubtotal) elSubtotal.innerText = `₹${billing.subtotal}`;
    if (elDiscountRow && elDiscount) {
      if (billing.discount > 0) {
        elDiscountRow.classList.remove('d-none');
        elDiscount.innerText = `-₹${billing.discount}`;
      } else {
        elDiscountRow.classList.add('d-none');
      }
    }
    if (elDelivery) elDelivery.innerText = `₹${billing.deliveryFee}`;
    if (elTax) elTax.innerText = `₹${billing.taxAndFees}`;
    if (elTotal) elTotal.innerText = `₹${billing.total}`;
    if (elTotalBtnText) elTotalBtnText.innerText = `Pay ₹${billing.total} & Confirm Order`;

    const nameEl = document.getElementById("checkout-user-name");
    const addressEl = document.getElementById("checkout-user-address");
    if (nameEl) nameEl.innerText = state.userProfile.name;
    if (addressEl) addressEl.innerText = state.userProfile.address;

    setPaymentMethod('card');

    const modalEl = document.getElementById('checkout-modal');
    if (modalEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });

  
  document.getElementById("pay-select-card")?.addEventListener('click', () => setPaymentMethod('card'));
  document.getElementById("pay-select-upi")?.addEventListener('click', () => setPaymentMethod('upi'));
  document.getElementById("pay-select-cod")?.addEventListener('click', () => setPaymentMethod('cod'));

  
  document.getElementById("card-number-input")?.addEventListener('input', (e) => {
    const input = e.target;
    let val = input.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    input.value = formatted;
  });

  
  document.getElementById("card-expiry-input")?.addEventListener('input', (e) => {
    const input = e.target;
    let val = input.value.replace(/\D/g, '');
    if (val.length >= 2) {
      input.value = val.slice(0, 2) + '/' + val.slice(2, 4);
    } else {
      input.value = val;
    }
  });

  
  document.getElementById("checkout-payment-form")?.addEventListener('submit', (e) => {
    e.preventDefault();
    processPayment();
  });

  
  document.getElementById("conflict-confirm-btn")?.addEventListener('click', () => {
    if (state.conflictItem) {
      state.cartItems = [{ menuItem: state.conflictItem.item, quantity: 1 }];
      state.selectedRestaurantId = state.conflictItem.restaurant.id;
      state.conflictItem = null;

      saveState();
      
      const conflictModalEl = document.getElementById("conflict-modal");
      if (conflictModalEl) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(conflictModalEl);
        modal.hide();
      }

      navigateTo('menu');
      renderCartDrawer();
    }
  });

  
  document.getElementById("nav-exit-portal-btn")?.addEventListener('click', () => {
    navigateTo('portal-landing');
  });



  
  document.getElementById("nav-logout-btn")?.addEventListener('click', performLogout);
  document.getElementById("profile-logout-btn")?.addEventListener('click', performLogout);
  document.getElementById("rest-owner-logout-btn")?.addEventListener('click', performLogout);

  
  document.getElementById("landing-create-customer-btn")?.addEventListener('click', () => {
    const modalEl = document.getElementById("register-customer-modal");
    if (modalEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });

  document.getElementById("landing-create-restaurant-btn")?.addEventListener('click', () => {
    const modalEl = document.getElementById("register-restaurant-modal");
    if (modalEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });

  
  const tabOrders = document.getElementById("rest-tab-orders");
  const tabMenu = document.getElementById("rest-tab-menu");
  const tabReviews = document.getElementById("rest-tab-reviews");
  const blockOrders = document.getElementById("rest-view-orders-block");
  const blockMenu = document.getElementById("rest-view-menu-block");
  const blockReviews = document.getElementById("rest-view-reviews-block");

  tabOrders?.addEventListener('click', () => {
    state.restaurantActiveTab = 'orders';
    tabOrders.classList.add('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabOrders.classList.remove('text-muted');
    
    tabMenu?.classList.remove('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabMenu?.classList.add('text-muted');
    tabReviews?.classList.remove('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabReviews?.classList.add('text-muted');

    if (blockOrders) {
      blockOrders.classList.remove('d-none');
      blockOrders.classList.add('d-block');
    }
    if (blockMenu) {
      blockMenu.classList.add('d-none');
      blockMenu.classList.remove('d-block');
    }
    if (blockReviews) {
      blockReviews.classList.add('d-none');
      blockReviews.classList.remove('d-block');
    }
    renderRestaurantWorkspace();
  });

  tabMenu?.addEventListener('click', () => {
    state.restaurantActiveTab = 'menu';
    tabMenu.classList.add('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabMenu.classList.remove('text-muted');
    
    tabOrders?.classList.remove('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabOrders?.classList.add('text-muted');
    tabReviews?.classList.remove('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabReviews?.classList.add('text-muted');

    if (blockMenu) {
      blockMenu.classList.remove('d-none');
      blockMenu.classList.add('d-block');
    }
    if (blockOrders) {
      blockOrders.classList.add('d-none');
      blockOrders.classList.remove('d-block');
    }
    if (blockReviews) {
      blockReviews.classList.add('d-none');
      blockReviews.classList.remove('d-block');
    }
    renderRestaurantWorkspace();
  });

  tabReviews?.addEventListener('click', () => {
    state.restaurantActiveTab = 'reviews';
    tabReviews.classList.add('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabReviews.classList.remove('text-muted');
    
    tabOrders?.classList.remove('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabOrders?.classList.add('text-muted');
    tabMenu?.classList.remove('active', 'text-dark', 'border-bottom', 'border-saffron');
    tabMenu?.classList.add('text-muted');

    if (blockReviews) {
      blockReviews.classList.remove('d-none');
      blockReviews.classList.add('d-block');
    }
    if (blockOrders) {
      blockOrders.classList.add('d-none');
      blockOrders.classList.remove('d-block');
    }
    if (blockMenu) {
      blockMenu.classList.add('d-none');
      blockMenu.classList.remove('d-block');
    }
    renderRestaurantWorkspace();
  });

  
  document.getElementById("rest-add-dish-form")?.addEventListener('submit', (e) => {
    e.preventDefault();
    const activeRest = state.restaurants.find(r => r.id === state.currentRestaurantId);
    if (!activeRest) return;

    const nameInput = document.getElementById("add-dish-name");
    const priceInput = document.getElementById("add-dish-price");
    const categorySelect = document.getElementById("add-dish-category");
    const isVegCheckbox = document.getElementById("add-dish-isveg");
    const descInput = document.getElementById("add-dish-desc");
    const imageInput = document.getElementById("add-dish-image");

    const name = nameInput.value;
    const price = parseInt(priceInput.value) || 150;
    const category = categorySelect.value;
    const isVeg = isVegCheckbox.checked;
    const description = descInput.value;
    const image = imageInput.value || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80";

    const newItem = {
      id: `dish-${Date.now()}`,
      name,
      description,
      price,
      isVeg,
      category,
      image,
      isPopular: false
    };

    activeRest.menu.push(newItem);
    createMenuItemOnServer(activeRest.id, newItem);

    
    sendToFormspree("New Menu Item Added", {
      restaurantId: activeRest.id,
      restaurantName: activeRest.name,
      dishName: newItem.name,
      price: newItem.price,
      category: newItem.category,
      isVeg: newItem.isVeg,
      description: newItem.description
    });

    if (!activeRest.categories.includes(category)) {
      activeRest.categories.push(category);
    }

    saveState();
    renderRestaurantWorkspace();

    nameInput.value = "";
    priceInput.value = "";
    descInput.value = "";
    imageInput.value = "";
    isVegCheckbox.checked = true;
  });

  
  document.getElementById("reg-customer-form")?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("reg-cust-name");
    const emailInput = document.getElementById("reg-cust-email");
    const phoneInput = document.getElementById("reg-cust-phone");
    const localitySelect = document.getElementById("reg-cust-locality");
    const addressInput = document.getElementById("reg-cust-address");
    const passwordInput = document.getElementById("reg-cust-password");

    const newCust = {
      id: `cust-${Date.now()}`,
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      locality: localitySelect.value,
      address: addressInput.value,
      password: passwordInput.value || "1234"
    };

    state.customerProfiles.push(newCust);
    state.currentCustomerId = newCust.id;

    createCustomerOnServer(newCust);

    
    sendToFormspree("Customer Registration", {
      name: newCust.name,
      email: newCust.email,
      phone: newCust.phone,
      locality: newCust.locality,
      address: newCust.address
    });

    state.userProfile = {
      name: newCust.name,
      email: newCust.email,
      phone: newCust.phone,
      address: newCust.address
    };

    saveState();

    const modalEl = document.getElementById('register-customer-modal');
    if (modalEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal?.hide();
    }

    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
    if (passwordInput) passwordInput.value = "";

    state.cartItems = [];
    saveState();

    navigateTo('home');
  });

  
  document.getElementById("reg-restaurant-form")?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("reg-rest-name");
    const descInput = document.getElementById("reg-rest-desc");
    const localitySelect = document.getElementById("reg-rest-locality");
    const feeInput = document.getElementById("reg-rest-fee");
    const addressInput = document.getElementById("reg-rest-address");
    const bannerInput = document.getElementById("reg-rest-banner");
    const passwordInput = document.getElementById("reg-rest-password");

    const newRest = {
      id: `rest-${Date.now()}`,
      name: nameInput.value,
      description: descInput.value,
      locality: localitySelect.value,
      address: addressInput.value,
      banner: bannerInput.value || "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewsCount: 1,
      deliveryTime: "30-40 mins",
      minOrder: 150,
      deliveryFee: parseInt(feeInput.value) || 40,
      categories: ["Kebabs", "Desserts"],
      logo: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=150&auto=format&fit=crop&q=80",
      password: passwordInput.value || "1234",
      menu: [
        {
          id: `m-kebab-${Date.now()}`,
          name: "Awadhi Dum Galouti Kebab",
          description: "Finely minced melt-in-the-mouth kebabs infused with 150 rare spices and dum cooked on slow fire.",
          price: 280,
          isVeg: false,
          category: "Kebabs",
          image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&auto=format&fit=crop&q=80",
          isPopular: true
        },
        {
          id: `m-dessert-${Date.now()}`,
          name: "Shahi Tukda Double Ka Meetha",
          description: "Crisp-fried bread slices soaked in fragrant saffron milk rabri, garnished with pistachios & gold leaf.",
          price: 150,
          isVeg: true,
          category: "Desserts",
          image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&auto=format&fit=crop&q=80",
          isPopular: false
        }
      ]
    };

    state.restaurants.push(newRest);

    
    sendToFormspree("Restaurant Registration", {
      name: newRest.name,
      description: newRest.description,
      locality: newRest.locality,
      address: newRest.address,
      deliveryFee: newRest.deliveryFee
    });
    state.currentRestaurantId = newRest.id;

    createRestaurantOnServer(newRest).then(data => {
      if (data && data.success && data.restaurant) {
        const registeredRest = data.restaurant;
        const oldId = newRest.id;
        newRest.id = registeredRest.id;
        if (state.currentRestaurantId === oldId) {
          state.currentRestaurantId = registeredRest.id;
        }

        for (const item of newRest.menu) {
          createMenuItemOnServer(registeredRest.id, item);
        }

        saveState();
      }
    });

    saveState();

    const modalEl = document.getElementById('register-restaurant-modal');
    if (modalEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal?.hide();
    }

    nameInput.value = "";
    descInput.value = "";
    feeInput.value = "";
    addressInput.value = "";
    bannerInput.value = "";
    if (passwordInput) passwordInput.value = "";

    navigateTo('restaurant');
  });

  
  document.getElementById("rest-refresh-orders")?.addEventListener('click', () => {
    renderRestaurantWorkspace();
  });

  
  document.getElementById("profile-edit-btn")?.addEventListener('click', () => {
    document.getElementById("profile-details-read")?.classList.add('d-none');
    
    const form = document.getElementById("profile-edit-form");
    if (form) {
      form.classList.remove('d-none');
      form.classList.add('d-flex');

      document.getElementById("profile-name-input").value = state.userProfile.name;
      document.getElementById("profile-email-input").value = state.userProfile.email;
      document.getElementById("profile-phone-input").value = state.userProfile.phone;
      document.getElementById("profile-address-input").value = state.userProfile.address;

      const activeCust = state.customerProfiles.find(p => p.id === state.currentCustomerId);
      const passInput = document.getElementById("profile-password-input");
      if (passInput) passInput.value = activeCust ? (activeCust.password || "1234") : "1234";
    }
  });

  document.getElementById("profile-edit-cancel")?.addEventListener('click', () => {
    document.getElementById("profile-edit-form")?.classList.add('d-none');
    document.getElementById("profile-edit-form")?.classList.remove('d-flex');
    document.getElementById("profile-details-read")?.classList.remove('d-none');
  });

  document.getElementById("profile-edit-form")?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    state.userProfile.name = document.getElementById("profile-name-input").value;
    state.userProfile.email = document.getElementById("profile-email-input").value;
    state.userProfile.phone = document.getElementById("profile-phone-input").value;
    state.userProfile.address = document.getElementById("profile-address-input").value;

    const activeCust = state.customerProfiles.find(p => p.id === state.currentCustomerId);
    if (activeCust) {
      activeCust.name = state.userProfile.name;
      activeCust.email = state.userProfile.email;
      activeCust.phone = state.userProfile.phone;
      activeCust.address = state.userProfile.address;
      activeCust.password = document.getElementById("profile-password-input").value;

      updateCustomerProfileOnServer(activeCust.id, {
        name: activeCust.name,
        email: activeCust.email,
        phone: activeCust.phone,
        address: activeCust.address,
        password: activeCust.password
      });
    }

    saveState();

    
    sendToFormspree("Profile Updated", {
      name: state.userProfile.name,
      email: state.userProfile.email,
      phone: state.userProfile.phone,
      address: state.userProfile.address
    });
    
    const alert = document.getElementById("profile-success-alert");
    if (alert) {
      alert.classList.remove('d-none');
      setTimeout(() => alert.classList.add('d-none'), 3000);
    }

    document.getElementById("profile-edit-form")?.classList.add('d-none');
    document.getElementById("profile-edit-form")?.classList.remove('d-flex');
    document.getElementById("profile-details-read")?.classList.remove('d-none');

    renderHeader();
    renderProfile();
  });

  
  
  

  
  document.querySelectorAll('.feedback-emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      
      document.querySelectorAll('.feedback-emoji-btn').forEach(b => {
        b.classList.remove('btn-saffron', 'text-white', 'border-0', 'shadow-sm');
        b.classList.add('btn-light', 'border');
        const label = b.querySelector('span:last-child');
        if (label) label.classList.add('text-muted');
      });
      
      btn.classList.add('btn-saffron', 'text-white', 'border-0', 'shadow-sm');
      btn.classList.remove('btn-light', 'border');
      const activeLabel = btn.querySelector('span:last-child');
      if (activeLabel) activeLabel.classList.remove('text-muted');
      
      const ratingInput = document.getElementById('feedback-rating-value');
      if (ratingInput) ratingInput.value = btn.getAttribute('data-rating');
    });
  });

  
  document.querySelectorAll('.feedback-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('btn-saffron');
      if (isActive) {
        btn.classList.remove('btn-saffron', 'text-white', 'border-0');
        btn.classList.add('btn-outline-secondary');
      } else {
        btn.classList.add('btn-saffron', 'text-white', 'border-0');
        btn.classList.remove('btn-outline-secondary');
      }
    });
  });

  
  document.getElementById('feedback-text-input')?.addEventListener('input', (e) => {
    const count = e.target.value.length;
    const counterEl = document.getElementById('feedback-char-count');
    if (counterEl) {
      counterEl.innerText = `${Math.min(count, 500)} / 500`;
      counterEl.style.color = count > 500 ? '#dc2626' : '';
    }
    if (count > 500) {
      e.target.value = e.target.value.substring(0, 500);
    }
  });

  
  document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const rating = document.getElementById('feedback-rating-value')?.value;
    const text = document.getElementById('feedback-text-input')?.value?.trim();

    
    if (!rating && !text) {
      const textInput = document.getElementById('feedback-text-input');
      if (textInput) {
        textInput.style.borderColor = '#dc2626';
        textInput.setAttribute('placeholder', 'Please share a rating or write your feedback...');
        setTimeout(() => {
          textInput.style.borderColor = '#e4e4e7';
          textInput.setAttribute('placeholder', "Tell us what you love, what could be better, or any feature you'd like to see...");
        }, 2500);
      }
      return;
    }

    
    const selectedTags = [];
    document.querySelectorAll('.feedback-tag-btn.btn-saffron').forEach(btn => {
      selectedTags.push(btn.getAttribute('data-tag'));
    });

    
    const feedback = {
      id: 'fb-' + Math.random().toString(36).substring(2, 9),
      customerId: state.currentCustomerId,
      rating: rating ? Number(rating) : null,
      tags: selectedTags,
      text: text || '',
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    
    const existing = JSON.parse(localStorage.getItem('lko_bites_feedback') || '[]');
    existing.push(feedback);
    localStorage.setItem('lko_bites_feedback', JSON.stringify(existing));

    
    sendToFormspree("App Feedback & Suggestion", {
      customerName: state.userProfile.name,
      customerEmail: state.userProfile.email,
      experienceRating: feedback.rating,
      improvementAreas: feedback.tags.join(", "),
      suggestion: feedback.text,
      date: feedback.date
    });

    
    const form = document.getElementById('feedback-form');
    const successAlert = document.getElementById('feedback-success-alert');
    if (form) form.classList.add('d-none');
    if (successAlert) successAlert.classList.remove('d-none');

    
    setTimeout(() => {
      if (successAlert) successAlert.classList.add('d-none');
      if (form) form.classList.remove('d-none');

      
      document.querySelectorAll('.feedback-emoji-btn').forEach(b => {
        b.classList.remove('btn-saffron', 'text-white', 'border-0', 'shadow-sm');
        b.classList.add('btn-light', 'border');
        const label = b.querySelector('span:last-child');
        if (label) label.classList.add('text-muted');
      });

      
      document.querySelectorAll('.feedback-tag-btn').forEach(b => {
        b.classList.remove('btn-saffron', 'text-white', 'border-0');
        b.classList.add('btn-outline-secondary');
      });

      
      const ratingInput = document.getElementById('feedback-rating-value');
      if (ratingInput) ratingInput.value = '';
      const textInput = document.getElementById('feedback-text-input');
      if (textInput) textInput.value = '';
      const counter = document.getElementById('feedback-char-count');
      if (counter) counter.innerText = '0 / 500';
    }, 4000);
  });

  
  document.getElementById("rest-owner-password-btn")?.addEventListener('click', () => {
    const errorEl = document.getElementById("rest-pass-error-msg");
    const successEl = document.getElementById("rest-pass-success-msg");
    errorEl?.classList.add("d-none");
    successEl?.classList.add("d-none");

    const currInput = document.getElementById("rest-curr-password");
    const newInput = document.getElementById("rest-new-password");
    if (currInput) currInput.value = "";
    if (newInput) newInput.value = "";

    const modalEl = document.getElementById("rest-password-modal");
    if (modalEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  });

  document.getElementById("rest-password-change-form")?.addEventListener('submit', (e) => {
    e.preventDefault();
    const currInput = document.getElementById("rest-curr-password");
    const newInput = document.getElementById("rest-new-password");
    const errorEl = document.getElementById("rest-pass-error-msg");
    const successEl = document.getElementById("rest-pass-success-msg");

    const activeRest = state.restaurants.find(r => r.id === state.currentRestaurantId);
    if (activeRest) {
      if (currInput.value === activeRest.password) {
        activeRest.password = newInput.value;

        updateRestaurantPasswordOnServer(activeRest.id, activeRest.password);

        saveState();
        errorEl?.classList.add("d-none");
        successEl?.classList.remove("d-none");
        
        setTimeout(() => {
          const modalEl = document.getElementById("rest-password-modal");
          if (modalEl) {
            const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
            modal?.hide();
          }
        }, 1500);
      } else {
        errorEl?.classList.remove("d-none");
        successEl?.classList.add("d-none");
      }
    }
  });

  
  document.getElementById("tracking-fast-forward")?.addEventListener('click', () => {
    const orderIndex = state.orderHistory.findIndex(o => o.id === state.activeOrderId);
    if (orderIndex === -1) return;

    const currentOrder = state.orderHistory[orderIndex];
    const stepsDef = ['confirmed', 'preparing', 'dispatched', 'delivered'];
    const curIdx = stepsDef.indexOf(currentOrder.status);

    if (curIdx < stepsDef.length - 1) {
      const nextStatus = stepsDef[curIdx + 1];
      
      currentOrder.status = nextStatus;
      currentOrder.trackingStep = curIdx + 2;

      updateOrderStatusOnServer(currentOrder.id, currentOrder.status, currentOrder.trackingStep);

      saveState();
      renderOrderTracking();
      renderHeader();
    }
  });

  document.getElementById("tracking-close-btn")?.addEventListener('click', () => {
    navigateTo('home');
  });

  
  document.getElementById("landing-enter-consumer-btn")?.addEventListener('click', () => {
    const custSelect = document.getElementById("landing-customer-select");
    if (custSelect) {
      const selectedId = custSelect.value;
      const activeCust = state.customerProfiles.find(p => p.id === selectedId);
      if (activeCust) {
        state.pendingAuthType = 'customer';
        state.pendingAuthId = selectedId;
        
        resetAuthModalViews();

        const targetNameEl = document.getElementById("auth-target-name");
        if (targetNameEl) targetNameEl.innerText = activeCust.name;
        
        const authModalEl = document.getElementById("auth-modal");
        if (authModalEl) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(authModalEl);
          modal.show();
        }
      }
    }
  });

  
  document.getElementById("landing-enter-restaurant-btn")?.addEventListener('click', () => {
    const restSelect = document.getElementById("landing-restaurant-select");
    if (restSelect) {
      const selectedId = restSelect.value;
      const activeRest = state.restaurants.find(r => r.id === selectedId);
      if (activeRest) {
        state.pendingAuthType = 'restaurant';
        state.pendingAuthId = selectedId;
        
        resetAuthModalViews();

        const targetNameEl = document.getElementById("auth-target-name");
        if (targetNameEl) targetNameEl.innerText = activeRest.name;
        
        const authModalEl = document.getElementById("auth-modal");
        if (authModalEl) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(authModalEl);
          modal.show();
        }
      }
    }
  });

  
  document.getElementById("auth-forgot-link")?.addEventListener('click', (e) => {
    e.preventDefault();
    const loginForm = document.getElementById("auth-login-form");
    const forgotForm = document.getElementById("auth-forgot-form");
    
    if (loginForm) {
      loginForm.classList.add("d-none");
      loginForm.classList.remove("d-flex");
    }
    if (forgotForm) {
      forgotForm.classList.remove("d-none");
      forgotForm.classList.add("d-flex");
    }
  });

  document.getElementById("auth-forgot-back")?.addEventListener('click', (e) => {
    e.preventDefault();
    resetAuthModalViews();
  });

  
  document.getElementById("auth-forgot-form")?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("auth-forgot-email");
    const phoneInput = document.getElementById("auth-forgot-phone");
    const errorEl = document.getElementById("auth-forgot-error");

    const enteredEmail = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const enteredPhone = phoneInput ? phoneInput.value.trim() : "";

    let match = false;
    if (state.pendingAuthType === 'customer' && state.pendingAuthId) {
      const activeCust = state.customerProfiles.find(p => p.id === state.pendingAuthId);
      if (activeCust) {
        const profileEmail = (activeCust.email || "").trim().toLowerCase();
        const profilePhone = (activeCust.phone || "").trim();
        const normalize = (s) => s.replace(/\s+/g, '').replace(/^\+91/, '').replace(/^0/, '');
        if (profileEmail === enteredEmail && normalize(profilePhone) === normalize(enteredPhone)) {
          match = true;
        }
      }
    } else if (state.pendingAuthType === 'restaurant' && state.pendingAuthId) {
      const activeRest = state.restaurants.find(r => r.id === state.pendingAuthId);
      if (activeRest) {
        const restEmail = (activeRest.email || "").trim().toLowerCase();
        const restPhone = (activeRest.phone || "").trim();
        const normalize = (s) => s.replace(/\s+/g, '').replace(/^\+91/, '').replace(/^0/, '');
        if (restEmail === enteredEmail && normalize(restPhone) === normalize(enteredPhone)) {
          match = true;
        }
      }
    }

    if (match) {
      errorEl?.classList.add("d-none");
      const forgotForm = document.getElementById("auth-forgot-form");
      const resetForm = document.getElementById("auth-reset-form");
      if (forgotForm) {
        forgotForm.classList.add("d-none");
        forgotForm.classList.remove("d-flex");
      }
      if (resetForm) {
        resetForm.classList.remove("d-none");
        resetForm.classList.add("d-flex");
      }
    } else {
      errorEl?.classList.remove("d-none");
    }
  });

  
  document.getElementById("auth-reset-form")?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPasswordInput = document.getElementById("auth-reset-password");
    const newPassword = newPasswordInput ? newPasswordInput.value : "";

    if (state.pendingAuthType === 'customer' && state.pendingAuthId) {
      const activeCust = state.customerProfiles.find(p => p.id === state.pendingAuthId);
      if (activeCust) {
        activeCust.password = newPassword;

        updateCustomerProfileOnServer(activeCust.id, { password: activeCust.password });

        state.currentCustomerId = state.pendingAuthId;
        state.userProfile = {
          name: activeCust.name,
          email: activeCust.email,
          phone: activeCust.phone,
          address: activeCust.address
        };
        saveState();

        const authModalEl = document.getElementById("auth-modal");
        if (authModalEl) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(authModalEl);
          modal?.hide();
        }
        navigateTo('home');
      }
    } else if (state.pendingAuthType === 'restaurant' && state.pendingAuthId) {
      const activeRest = state.restaurants.find(r => r.id === state.pendingAuthId);
      if (activeRest) {
        activeRest.password = newPassword;

        updateRestaurantPasswordOnServer(activeRest.id, activeRest.password);

        state.currentRestaurantId = state.pendingAuthId;
        saveState();

        const authModalEl = document.getElementById("auth-modal");
        if (authModalEl) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(authModalEl);
          modal?.hide();
        }
        navigateTo('restaurant');
      }
    }
  });

  
  document.getElementById("auth-login-form")?.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById("auth-password-input");
    const errorMsgEl = document.getElementById("auth-error-msg");
    const enteredPassword = passwordInput ? passwordInput.value : "";

    if (state.pendingAuthType === 'customer' && state.pendingAuthId) {
      const activeCust = state.customerProfiles.find(p => p.id === state.pendingAuthId);
      if (activeCust && activeCust.password === enteredPassword) {
        state.currentCustomerId = state.pendingAuthId;
        state.userProfile = {
          name: activeCust.name,
          email: activeCust.email,
          phone: activeCust.phone,
          address: activeCust.address
        };
        saveState();
        
        const authModalEl = document.getElementById("auth-modal");
        if (authModalEl) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(authModalEl);
          modal?.hide();
        }
        navigateTo('home');
      } else {
        errorMsgEl?.classList.remove("d-none");
      }
    } else if (state.pendingAuthType === 'restaurant' && state.pendingAuthId) {
      const activeRest = state.restaurants.find(r => r.id === state.pendingAuthId);
      if (activeRest && activeRest.password === enteredPassword) {
        state.currentRestaurantId = state.pendingAuthId;
        saveState();
        
        const authModalEl = document.getElementById("auth-modal");
        if (authModalEl) {
          const modal = window.bootstrap.Modal.getOrCreateInstance(authModalEl);
          modal?.hide();
        }
        navigateTo('restaurant');
      } else {
        errorMsgEl?.classList.remove("d-none");
      }
    }
  });

  
  document.getElementById("auth-password-toggle")?.addEventListener('click', () => {
    const passwordInput = document.getElementById("auth-password-input");
    const toggleIcon = document.querySelector("#auth-password-toggle i");
    if (passwordInput && toggleIcon) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.className = "bi bi-eye-slash";
      } else {
        passwordInput.type = "password";
        toggleIcon.className = "bi bi-eye";
      }
    }
  });

  
  const starContainer = document.getElementById("star-rating-container");
  if (starContainer) {
    starContainer.querySelectorAll(".star-btn").forEach(star => {
      star.addEventListener('click', (e) => {
        const val = parseInt(e.currentTarget.getAttribute("data-val") || "0");
        const ratingInput = document.getElementById("review-rating-value");
        if (ratingInput) ratingInput.value = val;

        const stars = starContainer.querySelectorAll(".star-btn");
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute("data-val") || "0");
          if (sVal <= val) {
            s.className = "bi bi-star-fill star-btn text-warning";
          } else {
            s.className = "bi bi-star star-btn text-secondary";
          }
        });

        const feedback = document.getElementById("rating-text-feedback");
        if (feedback) {
          const texts = ["", "1 Star - Terribly Unsatisfying", "2 Stars - Below Expectations", "3 Stars - Good & Tasty", "4 Stars - Wonderful Royal Feast", "5 Stars - Exquisite Awadhi Perfection!"];
          feedback.innerText = texts[val] || "Choose 1 to 5 stars";
        }
      });
    });
  }

  
  document.getElementById("rate-review-form")?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const restaurantId = document.getElementById("review-restaurant-id")?.value || "";
    const ratingVal = document.getElementById("review-rating-value")?.value || "";
    const reviewText = document.getElementById("review-text-input")?.value || "";

    const errorMsg = document.getElementById("review-error-msg");
    const successMsg = document.getElementById("review-success-msg");

    if (!ratingVal) {
      if (errorMsg) {
        errorMsg.innerText = "Please select a star rating first!";
        errorMsg.classList.remove("d-none");
      }
      return;
    }

    if (!reviewText.trim()) {
      if (errorMsg) {
        errorMsg.innerText = "Please write a short review text!";
        errorMsg.classList.remove("d-none");
      }
      return;
    }

    if (errorMsg) errorMsg.classList.add("d-none");

    const activeCust = state.customerProfiles.find(p => p.id === state.currentCustomerId) || { name: state.userProfile.name || "Verified Nawab" };
    
    const newReview = {
      restaurantId,
      customerId: state.currentCustomerId || "cust-keshav",
      customerName: activeCust.name,
      rating: parseInt(ratingVal),
      reviewText: reviewText,
    };

    
    const response = await createReviewOnServer(newReview);

    
    const reviewRestaurant = state.restaurants.find(r => r.id === restaurantId);
    sendToFormspree("Restaurant Review", {
      customerName: newReview.customerName,
      restaurantName: reviewRestaurant?.name || restaurantId,
      rating: newReview.rating,
      reviewText: newReview.reviewText
    });
    if (response && response.success) {
      
      state.reviews.push(response.review);
      
      
      const rest = state.restaurants.find(r => r.id === restaurantId);
      if (rest) {
        rest.rating = response.avgRating;
        rest.reviewsCount = response.reviewsCount;
      }

      saveState();

      if (successMsg) successMsg.classList.remove("d-none");

      
      setTimeout(() => {
        const modalEl = document.getElementById("rate-review-modal");
        if (modalEl) {
          const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
          modalInstance.hide();
        }
        
        
        navigateTo(state.activeView);
      }, 1500);
    } else {
      if (errorMsg) {
        errorMsg.innerText = "An error occurred while posting your review. Please try again.";
        errorMsg.classList.remove("d-none");
      }
    }
  });
}
