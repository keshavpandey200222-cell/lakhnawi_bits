import { state } from "./state.js";





export async function fetchAllDbState() {
  try {
    const [res, custs, ords, revs] = await Promise.all([
      fetch("/api/restaurants"),
      fetch("/api/customers"),
      fetch("/api/orders"),
      fetch("/api/reviews")
    ]);
    
    if (res.ok) {
      state.restaurants = await res.json();
    }
    if (custs.ok) {
      state.customerProfiles = await custs.json();
    }
    if (ords.ok) {
      const dbOrders = await ords.json();
      if (dbOrders.length > 0) {
        state.orderHistory = dbOrders;
      }
    }
    if (revs.ok) {
      state.reviews = await revs.json();
    }
  } catch (err) {
    console.error("Failed to sync Cloud SQL database state. Using local storage fallback.", err);
  }
}

export async function createReviewOnServer(newReview) {
  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error("Failed to submit review on server", err);
  }
  return null;
}

export async function createRestaurantOnServer(newRest) {
  try {
    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newRest.name,
        description: newRest.description,
        locality: newRest.locality,
        address: newRest.address,
        banner: newRest.banner,
        logo: newRest.logo,
        deliveryFee: newRest.deliveryFee,
        categories: newRest.categories,
        password: newRest.password
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error("Failed to register restaurant on server", err);
  }
  return null;
}

export async function createMenuItemOnServer(restaurantId, menuItem) {
  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuItem)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync new menu item to database", err);
  }
  return false;
}

export async function updateMenuItemPriceOnServer(restaurantId, itemId, newPrice) {
  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/menu/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: newPrice })
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync menu item price change to database", err);
  }
  return false;
}

export async function deleteMenuItemOnServer(restaurantId, itemId) {
  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/menu/${itemId}`, {
      method: "DELETE"
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync menu item deletion to database", err);
  }
  return false;
}

export async function createCustomerOnServer(newCust) {
  try {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCust)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync new customer to database", err);
  }
  return false;
}

export async function updateCustomerProfileOnServer(customerId, updateData) {
  try {
    const res = await fetch(`/api/customers/${customerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync customer profile update", err);
  }
  return false;
}

export async function updateRestaurantPasswordOnServer(restaurantId, password) {
  try {
    const res = await fetch(`/api/restaurants/${restaurantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync restaurant password update", err);
  }
  return false;
}

export async function createOrderOnServer(newOrder) {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder)
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync new order to Cloud SQL database", err);
  }
  return false;
}

export async function updateOrderStatusOnServer(orderId, status, trackingStep) {
  try {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, trackingStep })
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync order status update", err);
  }
  return false;
}
