import { state, saveState, getCartRestaurant, getBillingDetails } from "../state.js";
import { navigateTo, renderCartDrawer } from "../render.js";
import { createOrderOnServer } from "../api.js";

// Helper to submit Formspree in controllers without importing it from events directly
function sendToFormspree(formType, data) {
  const FORMSPREE_URL = "https://formspree.io/f/mqerppob";
  fetch(FORMSPREE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ _formType: formType, _submittedAt: new Date().toISOString(), ...data })
  }).catch(err => console.warn("Formspree submission failed (non-blocking):", err));
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

export function processPayment() {
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

export function finalizeOrderPayment() {
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

export function handleCartCheckout() {
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
}

export function handleConflictConfirm() {
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
}
