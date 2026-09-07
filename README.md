# Utsav Veda - Premium Indian Festive E-Commerce Platform

**Utsav Veda** is a modern, responsive, full-stack e-commerce web application dedicated to authentic, lawful, and age-appropriate Indian festive celebrations. It showcases handcrafted terracotta diyas, sacred brass puja accessories, organic floral rangoli powders, artisanal sweets gift boxes, and festive LED fairy lights.

---

## 🕊️ Safety & Legal Compliance Charter

* **Strict Safety Mandate**: The store strictly stocks and sells **only safe, lawful, non-explosive, and non-hazardous celebration merchandise**.
* **Zero Hazardous Goods**: Does **not** implement functionality for purchasing, selling, shipping, or sourcing fireworks, firecrackers, sparklers, explosives, toxic pyrotechnics, or restricted items.
* **Child & Pet Safe**: Designed to nurture tranquil, eco-friendly, and joy-filled celebrations for the entire family.

---

## ✨ Key Features & Architectural Capabilities

### 1. Festive Design System & Aesthetic
* **Color Palette**: Deep Royal Crimson (`#781219`), Shimmering Heritage Gold (`#D4AF37`), Warm Off-White / Sand (`#FAF7F2`), Rich Charcoal (`#221C16`).
* **Typography**: Paired serif headings (`Cinzel`, `Rozha One`) with high-readability modern body typeface (`Plus Jakarta Sans`).
* **Micro-interactions**: Hover zoom, smooth dialog transitions, quick-add animations, celebratory order confirmation ribbons.

### 2. Customer Shopping Experience
* **Interactive Homepage**:
  - Festive announcement ticker (Free shipping, artisan guarantees, festive promo codes `UTSAV15` & `DIWALI500`).
  - Hero banner with quick links to curated festive collections.
  - Category tiles with item counters and image backgrounds.
  - Featured handcrafted products with discount badges, artisan provenance, and ratings.
  - Customer review testimonials from verified festival shoppers.
* **Full-Featured Shop & Catalog**:
  - Live full-text search across titles, descriptions, and categories.
  - Category filtering (Diyas & Lamps, Puja Accessories, Decorative Lights, Festive Gifts, Rangoli Kits).
  - Price range slider, stock availability toggle, sorting (Featured, Price Low/High, Rating, Best Sellers).
  - Grid & List view switcher with responsive pagination.
* **Product Detail Page**:
  - High-resolution multi-angle image gallery with interactive thumbnail selector.
  - Real-time stock status badge and SKU tracker.
  - Variant selector (Pack sizes, brass finishes, light lengths).
  - Quantity controls, dynamic pricing, and instant "Buy Now" checkout shortcut.
  - Artisan provenance card & non-hazardous safety compliance certificate.
  - Tabbed interface (Description, Specifications, Verified Customer Reviews).
  - Customer review submission form with star rating selector.
* **Cart & Festive Checkout**:
  - Sliding / dedicated Cart view with live quantity adjuster.
  - Dynamic Free Shipping progress bar (Free delivery on orders over ₹999).
  - Coupon system (`UTSAV15` for 15% off, `DIWALI500` for ₹500 off on orders over ₹2,499).
  - Multi-step checkout: Shipping Address, Payment Method selection (UPI, Credit/Debit Card, Net Banking, Cash on Delivery), and Order Summary.
  - Order confirmation screen with unique order tracking number and delivery timeline.
* **Customer Account & Wishlist**:
  - Live order tracking statuses: *Pending* ➔ *Processing* ➔ *Shipped* ➔ *Delivered*.
  - Order receipt printable view.
  - Saved Wishlist with 1-click "Move to Cart".
  - Saved delivery addresses management.
  - Security settings & password updates.
* **Store Administration Console**:
  - Real-time KPI cards: Total Revenue, Total Orders, Active Catalog Items, 100% Lawful Safety Compliance.
  - Orders fulfillment manager: Update order statuses in real-time.
  - Product Inventory: Add new festive items, adjust prices, edit stock, delete discontinued products.
  - 1-click demo login helper for immediate evaluation.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Vite 6, Lucide React icons.
* **Backend**: Node.js, Express 4, in-memory relational-style database (`src/server/db.ts`) with seed data matching `DATABASE_SCHEMA.sql`.
* **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`).
* **SEO & Metadata**: Semantic HTML5, Schema.org JSON-LD `Store` microdata, `sitemap.xml`, and `robots.txt`.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server (Express + Vite on port 3000)
npm run dev

# 3. Build for production (compiles Vite client & bundles Express server with esbuild)
npm run build

# 4. Start production server
npm run start
```
