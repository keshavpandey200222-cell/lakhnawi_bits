import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.js";
import { restaurants, menuItems, customerProfiles, orders, reviews } from "./src/db/schema.js";
import { eq } from "drizzle-orm";
import { LUCKNOW_RESTAURANTS } from "./src/data/restaurants.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  
  
  
  try {
    const existingRestaurants = await db.select().from(restaurants).limit(1);
    if (existingRestaurants.length === 0) {
      console.log("Seeding initial Lucknow restaurants and menu items...");
      for (const r of LUCKNOW_RESTAURANTS) {
        await db.insert(restaurants).values({
          id: r.id,
          name: r.name,
          description: r.description,
          rating: r.rating || 4.0,
          reviewsCount: r.reviewsCount || 0,
          deliveryTime: r.deliveryTime || "30-45 min",
          deliveryFee: r.deliveryFee || 40,
          minOrder: r.minOrder || 150,
          address: r.address,
          locality: r.locality,
          logo: r.logo,
          banner: r.banner,
          categories: r.categories,
          password: "1234",
          email: `${r.id}@lucknowbites.com`,
          phone: "+91 91234 56789",
        });

        for (const m of r.menu) {
          await db.insert(menuItems).values({
            id: m.id,
            restaurantId: r.id,
            name: m.name,
            description: m.description,
            price: m.price,
            category: m.category,
            isVeg: m.isVeg,
            isPopular: m.isPopular || false,
            image: m.image,
          });
        }
      }
      console.log("Seeding restaurants completed!");
    }

    const existingCustomers = await db.select().from(customerProfiles).limit(1);
    if (existingCustomers.length === 0) {
      console.log("Seeding default customer profiles...");
      await db.insert(customerProfiles).values([
        {
          id: "cust-keshav",
          name: "Keshav Pandey",
          email: "keshavpandey200222@gmail.com",
          phone: "+91 91234 56789",
          address: "Room 304, S.R. Institute of Management & Technology, Bakshi Ka Talab, Lucknow, UP - 226201",
          locality: "Aminabad",
          password: "1234",
        },
        {
          id: "cust-priya",
          name: "Priya Sharma",
          email: "priya@example.com",
          phone: "+91 98765 43210",
          address: "Flat 402, Royal Residency, Hazratganj, Lucknow, UP - 226001",
          locality: "Hazratganj",
          password: "1234",
        }
      ]);
      console.log("Seeding customer profiles completed!");
    }

    const existingReviews = await db.select().from(reviews).limit(1);
    if (existingReviews.length === 0) {
      console.log("Seeding default restaurant reviews...");
      await db.insert(reviews).values([
        {
          id: "rev-1",
          restaurantId: "royal-cafe-hazratganj",
          customerId: "cust-keshav",
          customerName: "Keshav Pandey",
          rating: 5,
          reviewText: "The basket chaat was absolutely amazing! Loaded with curd, sweet tamarind chutney, and fresh pomegranate. Highly recommended!",
        },
        {
          id: "rev-2",
          restaurantId: "tunday-aminabad",
          customerId: "cust-priya",
          customerName: "Priya Sharma",
          rating: 5,
          reviewText: "Tunday Galouti Kebabs are legendary for a reason! They melt in the mouth instantly. The packaging was pristine.",
        }
      ]);
      console.log("Seeding reviews completed!");
    }

    const existingOrders = await db.select().from(orders).limit(1);
    if (existingOrders.length === 0) {
      console.log("Seeding default orders...");
      await db.insert(orders).values([
        {
          id: "LKO-9831",
          restaurantId: "royal-cafe-hazratganj",
          restaurantName: "Royal Cafe",
          customerId: "cust-keshav",
          items: [
            {
              menuItem: {
                id: "rc-basket-chaat",
                name: "Famous Basket Chaat",
                description: "Iconic crispy fried potato lattice basket loaded with dahi, chutneys, and sev.",
                price: 195,
                category: "Chaat",
                isVeg: true,
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80"
              },
              quantity: 1
            },
            {
              menuItem: {
                id: "rc-rasmalai",
                name: "Kesar Rasmalai (2 Pcs)",
                description: "Soft spongy cottage cheese dumplings poached in sweetened milk.",
                price: 90,
                category: "Desserts",
                isVeg: true,
                image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80"
              },
              quantity: 1
            }
          ],
          subtotal: 285,
          deliveryFee: 45,
          taxAndFees: 30,
          discount: 50,
          total: 310,
          status: "delivered",
          date: "July 12, 2026",
          paymentMethod: "upi",
          eta: "0 mins",
          trackingStep: 4,
        },
        {
          id: "LKO-4421",
          restaurantId: "tunday-aminabad",
          restaurantName: "Tunday Kababi",
          customerId: "cust-keshav",
          items: [
            {
              menuItem: {
                id: "t-galouti-mutton",
                name: "Shahi Galouti Kebab (Mutton)",
                description: "Melt-in-mouth mutton kebab patties prepared with over 150 spices.",
                price: 190,
                category: "Kebabs",
                isVeg: false,
                image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&auto=format&fit=crop&q=80"
              },
              quantity: 2
            },
            {
              menuItem: {
                id: "t-mughlai-paratha",
                name: "Mughlai Paratha",
                description: "Crispy, flaky griddle pan flatbread.",
                price: 50,
                category: "Breads",
                isVeg: false,
                image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80"
              },
              quantity: 2
            }
          ],
          subtotal: 480,
          deliveryFee: 40,
          taxAndFees: 35,
          discount: 100,
          total: 455,
          status: "delivered",
          date: "July 08, 2026",
          paymentMethod: "card",
          eta: "0 mins",
          trackingStep: 4,
        }
      ]);
      console.log("Seeding default orders completed!");
    }
  } catch (err) {
    console.error("Database seeding/check failed. Continuing startup.", err);
  }

  
  
  

  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  
  app.get("/api/restaurants", async (req, res) => {
    try {
      const allRes = await db.select().from(restaurants);
      const allItems = await db.select().from(menuItems);

      const resWithMenu = allRes.map(r => ({
        ...r,
        menu: allItems.filter(i => i.restaurantId === r.id)
      }));

      res.json(resWithMenu);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.post("/api/restaurants", async (req, res) => {
    try {
      const r = req.body;
      const id = "rest-" + Math.random().toString(36).substring(2, 9);
      const newRes = {
        id,
        name: r.name,
        description: r.description,
        rating: 4.0,
        reviewsCount: 0,
        deliveryTime: "30-40 min",
        deliveryFee: Number(r.deliveryFee) || 40,
        minOrder: 150,
        address: r.address,
        locality: r.locality,
        logo: r.logo || "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=150&auto=format&fit=crop&q=80",
        banner: r.banner || "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=80",
        categories: r.categories || ["Mughlai"],
        password: r.password || "1234",
        email: r.email || `${id}@lucknowbites.com`,
        phone: r.phone || "+91 91234 56789",
      };
      
      await db.insert(restaurants).values(newRes);
      res.json({ success: true, restaurant: newRes });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.put("/api/restaurants/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      await db.update(restaurants).set(updates).where(eq(restaurants.id, id));
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.post("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const { id } = req.params;
      const item = req.body;
      const itemId = item.id || "menu-" + Math.random().toString(36).substring(2, 9);
      
      const newItem = {
        id: itemId,
        restaurantId: id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        category: item.category,
        isVeg: item.isVeg === true,
        isPopular: item.isPopular === true,
        image: item.image || "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80",
      };

      await db.insert(menuItems).values(newItem);
      res.json({ success: true, menuItem: newItem });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.put("/api/restaurants/:id/menu/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      const { price } = req.body;
      await db.update(menuItems).set({ price: Number(price) }).where(eq(menuItems.id, itemId));
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.get("/api/customers", async (req, res) => {
    try {
      const custs = await db.select().from(customerProfiles);
      res.json(custs);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.post("/api/customers", async (req, res) => {
    try {
      const c = req.body;
      const id = c.id || "cust-" + Math.random().toString(36).substring(2, 9);
      const newCust = {
        id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        locality: c.locality,
        password: c.password || "1234",
      };

      await db.insert(customerProfiles).values(newCust);
      res.json({ success: true, customer: newCust });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.put("/api/customers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      await db.update(customerProfiles).set(updates).where(eq(customerProfiles.id, id));
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.get("/api/orders", async (req, res) => {
    try {
      const ords = await db.select().from(orders);
      res.json(ords);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.post("/api/orders", async (req, res) => {
    try {
      const o = req.body;
      await db.insert(orders).values({
        id: o.id,
        restaurantId: o.restaurantId,
        restaurantName: o.restaurantName,
        customerId: o.customerId,
        items: o.items,
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.deliveryFee),
        taxAndFees: Number(o.taxAndFees),
        discount: Number(o.discount) || 0,
        total: Number(o.total),
        status: o.status,
        date: o.date,
        paymentMethod: o.paymentMethod,
        eta: o.eta,
        trackingStep: Number(o.trackingStep) || 1,
      });
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.put("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const payload = {};
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.trackingStep !== undefined) payload.trackingStep = Number(updates.trackingStep);
      if (updates.eta !== undefined) payload.eta = updates.eta;

      await db.update(orders).set(payload).where(eq(orders.id, id));
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.delete("/api/restaurants/:id/menu/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      await db.delete(menuItems).where(eq(menuItems.id, itemId));
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.get("/api/reviews", async (req, res) => {
    try {
      const allReviews = await db.select().from(reviews);
      res.json(allReviews);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  app.post("/api/reviews", async (req, res) => {
    try {
      const r = req.body;
      const id = "rev-" + Math.random().toString(36).substring(2, 9);
      
      let finalCustomerId = r.customerId || "cust-keshav";
      const customerExists = await db.select().from(customerProfiles).where(eq(customerProfiles.id, finalCustomerId)).limit(1);
      if (customerExists.length === 0) {
        // Create stub customer profile to satisfy foreign key constraint
        await db.insert(customerProfiles).values({
          id: finalCustomerId,
          name: r.customerName || "Verified Nawab",
          email: `${finalCustomerId}@lucknowbites.com`,
          phone: "+91 91234 56789",
          address: "Lucknow, Uttar Pradesh",
          locality: "Aminabad",
          password: "1234",
        }).catch(err => {
          console.error("Failed to insert stub customer, falling back to cust-keshav", err);
          finalCustomerId = "cust-keshav";
        });
      }

      let finalRestaurantId = r.restaurantId;
      const restaurantExists = await db.select().from(restaurants).where(eq(restaurants.id, finalRestaurantId)).limit(1);
      if (restaurantExists.length === 0) {
        const firstRest = await db.select().from(restaurants).limit(1);
        if (firstRest.length > 0) {
          finalRestaurantId = firstRest[0].id;
        } else {
          return res.status(400).json({ error: "No restaurants exist in the database." });
        }
      }

      const newReview = {
        id,
        restaurantId: finalRestaurantId,
        customerId: finalCustomerId,
        customerName: r.customerName || "Verified Nawab",
        rating: Number(r.rating) || 5,
        reviewText: r.reviewText || "Nice food!",
      };

      await db.insert(reviews).values(newReview);

      
      const allRestReviews = await db.select().from(reviews).where(eq(reviews.restaurantId, finalRestaurantId));
      const totalReviews = allRestReviews.length;
      const sumRatings = allRestReviews.reduce((sum, rev) => sum + rev.rating, 0);
      const avgRating = totalReviews > 0 ? Number((sumRatings / totalReviews).toFixed(1)) : 4.0;

      await db.update(restaurants).set({
        rating: avgRating,
        reviewsCount: totalReviews
      }).where(eq(restaurants.id, finalRestaurantId));

      res.json({ success: true, review: newReview, avgRating, reviewsCount: totalReviews });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  
  
  
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lakhnawi Bites Full-Stack server booted on http://localhost:${PORT}`);
  });
}

startServer();
