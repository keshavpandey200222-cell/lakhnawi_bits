import { state, saveState } from "../state.js";
import { navigateTo } from "../render.js";
import { 
  createCustomerOnServer, 
  createRestaurantOnServer, 
  updateCustomerProfileOnServer, 
  updateRestaurantPasswordOnServer,
  createMenuItemOnServer
} from "../api.js";

// Helper to submit Formspree in controllers without importing it from events directly
function sendToFormspree(formType, data) {
  const FORMSPREE_URL = "https://formspree.io/f/mqerppob";
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
}

export function performLogout() {
  state.currentCustomerId = "";
  state.currentRestaurantId = "";
  state.cartItems = [];
  saveState();
  
  navigateTo('portal-landing');
  
  const alertBox = document.createElement('div');
  alertBox.className = "position-fixed bottom-4 left-4 bg-zinc-900 text-white rounded-3 shadow-lg border border-zinc-800 p-3.5 z-50 d-flex align-items-center gap-2 small transition-all";
  alertBox.innerHTML = `
    <i class="bi bi-check-circle-fill text-success fs-5"></i>
    <div>
      <span class="fw-bold d-block text-white">Signed Out</span>
      <span class="text-muted text-xs">Logged out from Lakhnawi Bites.</span>
    </div>
  `;
  document.body.appendChild(alertBox);
  setTimeout(() => {
    alertBox.classList.add('opacity-0');
    setTimeout(() => alertBox.remove(), 400);
  }, 3500);
}

export function handleForgotLink(e) {
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
}

export function handleForgotForm(e) {
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
}

export function handleResetForm(e) {
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
}

export function handleLoginForm(e) {
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
}

export function togglePasswordVisibility() {
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
}

export function handleCustomerRegister(e) {
  e.preventDefault();
  const nameInput = document.getElementById("reg-cust-name");
  const emailInput = document.getElementById("reg-cust-email");
  const phoneInput = document.getElementById("reg-cust-phone");
  const localitySelect = document.getElementById("reg-cust-locality");
  const addressInput = document.getElementById("reg-cust-address");
  const passwordInput = document.getElementById("reg-cust-password");

  if (!nameInput || !emailInput || !phoneInput || !localitySelect || !addressInput) return;

  const newCust = {
    id: "cust-" + Math.random().toString(36).substring(2, 9),
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
    modal.hide();
  }

  // Success alert
  const alertBox = document.createElement('div');
  alertBox.className = "position-fixed bottom-4 left-4 bg-zinc-900 text-white rounded-3 shadow-lg border border-zinc-800 p-3.5 z-50 d-flex align-items-center gap-2 small transition-all";
  alertBox.innerHTML = `
    <i class="bi bi-check-circle-fill text-success fs-5"></i>
    <div>
      <span class="fw-bold d-block text-white">Registered Successfully</span>
      <span class="text-muted text-xs">Welcome to Lakhnawi Bites, ${newCust.name}!</span>
    </div>
  `;
  document.body.appendChild(alertBox);
  setTimeout(() => {
    alertBox.classList.add('opacity-0');
    setTimeout(() => alertBox.remove(), 400);
  }, 3500);

  navigateTo('home');
}

export function handleRestaurantRegister(e) {
  e.preventDefault();
  const nameInput = document.getElementById("reg-rest-name");
  const descInput = document.getElementById("reg-rest-desc");
  const phoneInput = document.getElementById("reg-rest-phone");
  const emailInput = document.getElementById("reg-rest-email");
  const localitySelect = document.getElementById("reg-rest-locality");
  const addressInput = document.getElementById("reg-rest-address");
  const passwordInput = document.getElementById("reg-rest-password");
  const logoInput = document.getElementById("reg-rest-logo");
  const bannerInput = document.getElementById("reg-rest-banner");
  
  const checkedCategories = [];
  document.querySelectorAll("input[name='reg-rest-categories']:checked").forEach(checkbox => {
    checkedCategories.push(checkbox.value);
  });

  if (!nameInput || !phoneInput || !emailInput || !localitySelect || !addressInput) return;

  const newRest = {
    id: "rest-temp",
    name: nameInput.value,
    description: descInput?.value || "",
    rating: 4.0,
    reviewsCount: 0,
    deliveryTime: "30-40 min",
    deliveryFee: 40,
    minOrder: 150,
    address: addressInput.value,
    locality: localitySelect.value,
    logo: logoInput?.value || "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=150&auto=format&fit=crop&q=80",
    banner: bannerInput?.value || "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=80",
    categories: checkedCategories,
    password: passwordInput?.value || "1234",
    email: emailInput.value,
    phone: phoneInput.value,
    menu: []
  };

  createRestaurantOnServer(newRest).then(data => {
    if (data && data.restaurant) {
      const registeredRest = data.restaurant;
      registeredRest.menu = [];
      newRest.id = registeredRest.id;
      state.restaurants.push(registeredRest);
      state.currentRestaurantId = registeredRest.id;

      // add default menu items locally & server side
      const defaultMenu = [
        { name: "Signature Galouti Kebab", description: "Melt-in-mouth smoked lamb patties", price: 280, category: "Kebabs", isVeg: false, isPopular: true, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=80" },
        { name: "Special Basket Chaat", description: "Crispy potato basket filled with yogurt, chutneys & pomegranate", price: 160, category: "Street Food", isVeg: true, isPopular: true, image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300&auto=format&fit=crop&q=80" }
      ];

      defaultMenu.forEach(item => {
        const itemId = "menu-" + Math.random().toString(36).substring(2, 9);
        const menuItem = { id: itemId, ...item };
        registeredRest.menu.push(menuItem);
        createMenuItemOnServer(registeredRest.id, menuItem);
      });

      sendToFormspree("Restaurant Registration", {
        id: registeredRest.id,
        name: registeredRest.name,
        email: registeredRest.email,
        phone: registeredRest.phone,
        locality: registeredRest.locality,
        address: registeredRest.address
      });

      saveState();

      const modalEl = document.getElementById('register-restaurant-modal');
      if (modalEl) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();
      }

      // Success alert
      const alertBox = document.createElement('div');
      alertBox.className = "position-fixed bottom-4 left-4 bg-zinc-900 text-white rounded-3 shadow-lg border border-zinc-800 p-3.5 z-50 d-flex align-items-center gap-2 small transition-all";
      alertBox.innerHTML = `
        <i class="bi bi-check-circle-fill text-success fs-5"></i>
        <div>
          <span class="fw-bold d-block text-white">Registered Kitchen</span>
          <span class="text-muted text-xs">Kitchen registered: ${registeredRest.name}!</span>
        </div>
      `;
      document.body.appendChild(alertBox);
      setTimeout(() => {
        alertBox.classList.add('opacity-0');
        setTimeout(() => alertBox.remove(), 400);
      }, 3500);

      navigateTo('restaurant');
    }
  });
}
