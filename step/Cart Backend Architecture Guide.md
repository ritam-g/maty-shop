# 🧺 Cart Backend Architecture Guide (Clean Understanding)

This document explains the **complete backend design of Cart functionality** in a simple way, focusing on:

* Features you need to build
* Schemas you need to design
* Backend layers (Controller, Service, DAO)
* Data flow diagrams

---

# 🧭 1. High-Level System Overview

```
User
  ↓
API Request (Add to Cart / Get Cart)
  ↓
Backend System
  ↓
Cart Logic (Check / Update / Create)
  ↓
Database
  ↓
Response to User
```

---

# 🛒 2. Features You Need to Implement

## ✔ Core Cart Features

1. Add product to cart
2. Increase quantity if item already exists
3. Decrease quantity / remove item
4. Fetch user cart
5. Clear cart (optional)
6. Validate stock before adding
7. Handle product variants (size, color, etc.)

---

## ✔ Business Rules (VERY IMPORTANT)

* One user = one cart
* Cart contains multiple items (array)
* Each item = product + variant + quantity
* Cannot exceed available stock
* If item exists → update quantity
* If not → add new item

---

# 🧱 3. Database Schemas You Need

## 🧺 Cart Schema

```
Cart
 ├── userId (ref User)
 ├── items [Array]
 │     ├── productId (ref Product)
 │     ├── variantId (ref Variant)
 │     ├── quantity
 │     ├── price snapshot
 ├── createdAt
 ├── updatedAt
```

---

## 📦 Product Schema (important for cart)

```
Product
 ├── title
 ├── description
 ├── variants [Array]
 │     ├── size
 │     ├── color
 │     ├── stock
 │     ├── price
```

---

## 👤 User Schema (only relevant field)

```
User
 ├── name
 ├── email
 ├── password
```

---

# 🧠 4. Backend Layer Responsibilities

## 🎮 Controller

* Receives request
* Sends response
* Calls service layer

👉 NO business logic

---

## 🧠 Service (Business Logic Layer)

This is the brain of cart system.

### Responsibilities:

* Check if cart exists
* Decide: create or update
* Validate stock availability
* Decide quantity changes
* Handle variant logic

---

## 🗄️ DAO (Database Layer)

Only responsible for DB operations:

* Find cart
* Create cart
* Update cart
* Fetch product
* Fetch stock

---

# 🔁 5. Add to Cart Flow Diagram

```
User Clicks "Add to Cart"
          ↓
Controller receives request
          ↓
Service checks:
   ├── Does cart exist?
   ├── Is item already in cart?
   ├── Is stock available?
          ↓
DAO calls:
   ├── findCartByUser
   ├── findProduct
   ├── updateCart OR createCart
          ↓
Database updated
          ↓
Response sent to frontend
```

---

# 🧺 6. Cart Decision Flow (IMPORTANT LOGIC)

```
IF cart does NOT exist
   → create new cart

ELSE
   → check if item exists in cart

      IF item exists
         → increase quantity

      ELSE
         → add new item
```

---

# ⚠️ 7. Key Design Decisions (WHY THIS DESIGN EXISTS)

## ✔ Why ONE cart per user?

* Avoid duplicate carts
* Easy checkout
* Single source of truth

## ✔ Why items array?

* Efficient storage
* Easy updates
* Natural shopping model

## ✔ Why check before update?

* Prevent duplicate items
* Maintain correct quantity
* Validate stock safety

---

# 🚀 8. Final Mental Model

```
Cart = Container
Items = Array inside Cart
DAO = Database access only
Service = Decision maker
Controller = Request handler
```

---

# 🧠 One-Line Summary

👉 Cart system is designed as a **single user container with dynamic item array, managed through business logic in service layer and persistent storage in database via DAO layer.**
