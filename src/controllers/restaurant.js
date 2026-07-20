import { state, saveState } from "../state.js";
import { renderRestaurantWorkspace } from "../render.js";
import { createMenuItemOnServer, updateRestaurantPasswordOnServer } from "../api.js";

// Helper to submit Formspree in controllers without importing it from events directly
function sendToFormspree(formType, data) {
  const FORMSPREE_URL = "https://formspree.io/f/mqerppob";
  fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ _formType: formType, _submittedAt: new Date().toISOString(), ...data })
  }).catch(err => console.warn("Formspree submission failed (non-blocking):", err));
}

export function handleRestTabClick(tabName) {
  state.restaurantActiveTab = tabName;

  const tabOrders = document.getElementById("rest-tab-orders");
  const tabMenu = document.getElementById("rest-tab-menu");
  const tabReviews = document.getElementById("rest-tab-reviews");
  const blockOrders = document.getElementById("rest-view-orders-block");
  const blockMenu = document.getElementById("rest-view-menu-block");
  const blockReviews = document.getElementById("rest-view-reviews-block");

  const tabs = [
    { name: 'orders', el: tabOrders, block: blockOrders },
    { name: 'menu', el: tabMenu, block: blockMenu },
    { name: 'reviews', el: tabReviews, block: blockReviews }
  ];

  tabs.forEach(t => {
    if (t.name === tabName) {
      t.el?.classList.add('active', 'text-dark', 'border-bottom', 'border-saffron');
      t.el?.classList.remove('text-muted');
      if (t.block) {
        t.block.classList.remove('d-none');
        t.block.classList.add('d-block');
      }
    } else {
      t.el?.classList.remove('active', 'text-dark', 'border-bottom', 'border-saffron');
      t.el?.classList.add('text-muted');
      if (t.block) {
        t.block.classList.add('d-none');
        t.block.classList.remove('d-block');
      }
    }
  });

  renderRestaurantWorkspace();
}

export function handleRestAddDish(e) {
  e.preventDefault();
  const activeRest = state.restaurants.find(r => r.id === state.currentRestaurantId);
  if (!activeRest) return;

  const nameInput = document.getElementById("add-dish-name");
  const priceInput = document.getElementById("add-dish-price");
  const categorySelect = document.getElementById("add-dish-category");
  const isVegCheckbox = document.getElementById("add-dish-isveg");
  const descInput = document.getElementById("add-dish-desc");
  const imageInput = document.getElementById("add-dish-image");

  if (!nameInput || !priceInput || !categorySelect || !isVegCheckbox || !descInput || !imageInput) return;

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

  const modalEl = document.getElementById("add-dish-modal");
  if (modalEl) {
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modal?.hide();
  }
}

export function handleRestPasswordBtnClick() {
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
}

export function handleRestPasswordChange(e) {
  e.preventDefault();
  const currInput = document.getElementById("rest-curr-password");
  const newInput = document.getElementById("rest-new-password");
  const errorEl = document.getElementById("rest-pass-error-msg");
  const successEl = document.getElementById("rest-pass-success-msg");

  if (!currInput || !newInput) return;

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
}
