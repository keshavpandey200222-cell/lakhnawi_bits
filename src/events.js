import { state, saveState, getCartRestaurant, getBillingDetails } from "./state.js";
import { navigateTo, renderHeader, renderRestaurants, renderCartDrawer, renderProfile, renderOrderTracking, renderRestaurantWorkspace } from "./render.js";
import { createCustomerOnServer, createRestaurantOnServer, createMenuItemOnServer, updateCustomerProfileOnServer, updateRestaurantPasswordOnServer, createOrderOnServer, createReviewOnServer, updateOrderStatusOnServer } from "./api.js";

import { 
  resetAuthModalViews, 
  performLogout, 
  handleForgotLink, 
  handleForgotForm, 
  handleResetForm, 
  handleLoginForm, 
  togglePasswordVisibility, 
  handleCustomerRegister, 
  handleRestaurantRegister 
} from "./controllers/auth.js";

import { 
  setPaymentMethod, 
  processPayment, 
  finalizeOrderPayment, 
  handleCartCheckout, 
  handleConflictConfirm 
} from "./controllers/cart.js";

import { 
  handleRestTabClick, 
  handleRestAddDish, 
  handleRestPasswordBtnClick, 
  handleRestPasswordChange 
} from "./controllers/restaurant.js";

const FORMSPREE_URL = "https://formspree.io/f/mqerppob";

function sendToFormspree(formType, data) {
  fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ _formType: formType, _submittedAt: new Date().toISOString(), ...data })
  }).catch(err => console.warn("Formspree submission failed (non-blocking):", err));
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

  
  document.getElementById("cart-checkout-btn")?.addEventListener('click', handleCartCheckout);
  
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

  
  document.getElementById("conflict-confirm-btn")?.addEventListener('click', handleConflictConfirm);

  
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

  
  document.getElementById("rest-tab-orders")?.addEventListener('click', () => handleRestTabClick('orders'));
  document.getElementById("rest-tab-menu")?.addEventListener('click', () => handleRestTabClick('menu'));
  document.getElementById("rest-tab-reviews")?.addEventListener('click', () => handleRestTabClick('reviews'));

  document.getElementById("rest-add-dish-form")?.addEventListener('submit', handleRestAddDish);

  
  document.getElementById("reg-customer-form")?.addEventListener('submit', handleCustomerRegister);
  document.getElementById("reg-restaurant-form")?.addEventListener('submit', handleRestaurantRegister);

  
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

  
  document.getElementById("rest-owner-password-btn")?.addEventListener('click', handleRestPasswordBtnClick);
  document.getElementById("rest-password-change-form")?.addEventListener('submit', handleRestPasswordChange);

  
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

  
  document.getElementById("auth-forgot-link")?.addEventListener('click', handleForgotLink);
  document.getElementById("auth-forgot-back")?.addEventListener('click', (e) => {
    e.preventDefault();
    resetAuthModalViews();
  });
  document.getElementById("auth-forgot-form")?.addEventListener('submit', handleForgotForm);
  document.getElementById("auth-reset-form")?.addEventListener('submit', handleResetForm);
  document.getElementById("auth-login-form")?.addEventListener('submit', handleLoginForm);
  document.getElementById("auth-password-toggle")?.addEventListener('click', togglePasswordVisibility);

  
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
