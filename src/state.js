import { LUCKNOW_RESTAURANTS, AVAILABLE_COUPONS } from "./data/restaurants.js";




export const state = {
  restaurants: [],
  customerProfiles: [],
  reviews: [],
  currentCustomerId: "",
  currentRestaurantId: "",
  cartItems: [],
  selectedRestaurantId: null,
  activeView: 'portal-landing',
  userProfile: {
    name: "Keshav Pandey",
    email: "keshavpandey200222@gmail.com",
    phone: "+91 91234 56789",
    address: "Room 304, S.R. Institute of Management & Technology, Bakshi Ka Talab, Lucknow, UP - 226201"
  },
  orderHistory: [],
  activeOrderId: null,
  searchQuery: "",
  selectedLocality: "All Localities",
  selectedCategory: "All",
  favorites: [],
  appliedCoupon: null,
  selectedPaymentMethod: 'card',

  
  conflictItem: null,

  
  pendingAuthType: null,
  pendingAuthId: null,

  
  mapInstance: null,
  mapMarkers: [],
  mapPolyline: null,
  mapRiderMarker: null,
  restaurantActiveTab: 'orders',
  menuActiveCategory: 'All',
  menuSearchQuery: ''
};




export function loadState() {
  const savedCart = localStorage.getItem("lko_bites_cart");
  const savedHistory = localStorage.getItem("lko_bites_history");
  const savedProfile = localStorage.getItem("lko_bites_profile");
  const savedFavorites = localStorage.getItem("lko_bites_favorites");
  const savedActiveOrder = localStorage.getItem("lko_bites_active_order");
  const savedSelRestaurantId = localStorage.getItem("lko_bites_selected_restaurant_id");

  const savedCustomerProfiles = localStorage.getItem("lko_bites_customer_profiles");
  const savedCurrentCustomerId = localStorage.getItem("lko_bites_current_customer_id");
  const savedCurrentRestaurantId = localStorage.getItem("lko_bites_current_restaurant_id");
  const savedRestaurants = localStorage.getItem("lko_bites_restaurants_list");

  if (savedCart) state.cartItems = JSON.parse(savedCart);
  if (savedProfile) state.userProfile = JSON.parse(savedProfile);
  if (savedFavorites) state.favorites = JSON.parse(savedFavorites);
  
  if (savedHistory) {
    if (state.orderHistory.length === 0) {
      state.orderHistory = JSON.parse(savedHistory);
    }
  }

  if (state.restaurants.length === 0) {
    if (savedRestaurants) {
      state.restaurants = JSON.parse(savedRestaurants);
    } else {
      state.restaurants = JSON.parse(JSON.stringify(LUCKNOW_RESTAURANTS));
      localStorage.setItem("lko_bites_restaurants_list", JSON.stringify(state.restaurants));
    }
  }

  if (state.customerProfiles.length === 0) {
    if (savedCustomerProfiles) {
      state.customerProfiles = JSON.parse(savedCustomerProfiles);
    } else {
      state.customerProfiles = [
        {
          id: "cust-keshav",
          name: "Keshav Pandey",
          email: "keshavpandey200222@gmail.com",
          phone: "+91 91234 56789",
          address: "Room 304, S.R. Institute of Management & Technology, Bakshi Ka Talab, Lucknow, UP - 226201",
          locality: "Aminabad",
          password: "1234"
        },
        {
          id: "cust-priya",
          name: "Priya Sharma",
          email: "priya.sharma@gmail.com",
          phone: "+91 98765 43210",
          address: "Flat 12B, Shahnajaf Road, near Sahara Ganj Mall, Hazratganj, Lucknow, UP - 226001",
          locality: "Hazratganj",
          password: "1234"
        }
      ];
      localStorage.setItem("lko_bites_customer_profiles", JSON.stringify(state.customerProfiles));
    }
  }

  state.currentCustomerId = savedCurrentCustomerId || "";
  state.currentRestaurantId = savedCurrentRestaurantId || "";

  
  const activeProfile = state.customerProfiles.find(p => p.id === state.currentCustomerId);
  if (activeProfile) {
    state.userProfile = {
      name: activeProfile.name,
      email: activeProfile.email,
      phone: activeProfile.phone,
      address: activeProfile.address
    };
  }

  if (savedActiveOrder) state.activeOrderId = savedActiveOrder;
  if (savedSelRestaurantId) state.selectedRestaurantId = savedSelRestaurantId;
  
  
  state.restaurants.forEach(r => {
    if (!r.password) r.password = "1234";
    if (!r.email) {
      const prefix = r.id.split('-')[0];
      r.email = `${prefix}@lkobites.com`;
    }
    if (!r.phone) {
      r.phone = "+91 99999 88888";
    }
  });
  state.customerProfiles.forEach(c => {
    if (!c.password) c.password = "1234";
  });

  
  state.activeView = 'portal-landing';
}

export function saveState() {
  localStorage.setItem("lko_bites_cart", JSON.stringify(state.cartItems));
  localStorage.setItem("lko_bites_profile", JSON.stringify(state.userProfile));
  localStorage.setItem("lko_bites_favorites", JSON.stringify(state.favorites));
  localStorage.setItem("lko_bites_history", JSON.stringify(state.orderHistory));
  localStorage.setItem("lko_bites_customer_profiles", JSON.stringify(state.customerProfiles));
  localStorage.setItem("lko_bites_restaurants_list", JSON.stringify(state.restaurants));
  localStorage.setItem("lko_bites_current_customer_id", state.currentCustomerId || "");
  localStorage.setItem("lko_bites_current_restaurant_id", state.currentRestaurantId || "");

  if (state.activeOrderId) {
    localStorage.setItem("lko_bites_active_order", state.activeOrderId);
  } else {
    localStorage.removeItem("lko_bites_active_order");
  }
  if (state.selectedRestaurantId) {
    localStorage.setItem("lko_bites_selected_restaurant_id", state.selectedRestaurantId);
  } else {
    localStorage.removeItem("lko_bites_selected_restaurant_id");
  }
  localStorage.setItem("lko_bites_active_view", state.activeView);
}




export function getCartRestaurantId() {
  if (state.cartItems.length === 0) return null;
  const firstItemId = state.cartItems[0].menuItem.id;
  const matchingRest = state.restaurants.find(r => 
    r.menu.some(m => m.id === firstItemId)
  );
  return matchingRest ? matchingRest.id : null;
}

export function getCartRestaurant() {
  const restId = getCartRestaurantId();
  if (!restId) return null;
  return state.restaurants.find(r => r.id === restId) || null;
}

export function getBillingDetails() {
  const subtotal = state.cartItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  const activeRest = getCartRestaurant();
  const deliveryFee = activeRest ? activeRest.deliveryFee : 40;
  
  
  const taxAndFees = Math.round((subtotal * 0.18) + (subtotal > 0 ? 15 : 0));
  
  
  let discount = 0;
  if (state.appliedCoupon && subtotal >= state.appliedCoupon.minOrder) {
    if (state.appliedCoupon.discount) {
      discount = state.appliedCoupon.discount;
    } else if (state.appliedCoupon.discountPercentage) {
      discount = Math.min(state.appliedCoupon.maxDiscount || 120, Math.round((subtotal * state.appliedCoupon.discountPercentage) / 100));
    }
  }

  const total = Math.max(0, subtotal - discount + deliveryFee + taxAndFees);

  return {
    subtotal,
    discount,
    deliveryFee,
    taxAndFees,
    total
  };
}
