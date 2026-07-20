import { pgTable, text, integer, doublePrecision, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const restaurants = pgTable("restaurants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rating: doublePrecision("rating").default(4.0),
  reviewsCount: integer("reviews_count").default(0),
  deliveryTime: text("delivery_time").default("30-45 min"),
  deliveryFee: integer("delivery_fee").default(40),
  minOrder: integer("min_order").default(150),
  address: text("address").notNull(),
  locality: text("locality").notNull(),
  logo: text("logo").notNull(),
  banner: text("banner").notNull(),
  categories: jsonb("categories").notNull(),
  password: text("password").default("1234"),
  email: text("email"),
  phone: text("phone"),
});

export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  category: text("category").notNull(),
  isVeg: boolean("is_veg").default(false),
  isPopular: boolean("is_popular").default(false),
  image: text("image").notNull(),
});

export const customerProfiles = pgTable("customer_profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  locality: text("locality").notNull(),
  password: text("password").default("1234"),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").references(() => restaurants.id).notNull(),
  restaurantName: text("restaurant_name").notNull(),
  customerId: text("customer_id").references(() => customerProfiles.id),
  items: jsonb("items").notNull(), 
  subtotal: integer("subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull(),
  taxAndFees: integer("tax_and_fees").notNull(),
  discount: integer("discount").default(0),
  total: integer("total").notNull(),
  status: text("status").notNull(), 
  date: text("date").notNull(),
  paymentMethod: text("payment_method").notNull(),
  eta: text("eta").notNull(),
  trackingStep: integer("tracking_step").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  restaurantId: text("restaurant_id").references(() => restaurants.id, { onDelete: "cascade" }).notNull(),
  customerId: text("customer_id").references(() => customerProfiles.id, { onDelete: "cascade" }).notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  reviewText: text("review_text").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
