# NexMart E-Commerce Platform — Functions, Features, and Error Cases (A to Z)

This document provides a comprehensive A to Z guide of all the features, system functions, microservices, and error-handling flows implemented in the **NexMart AI-Powered Smart Commerce Platform**.

---

## 🚀 System Architecture & Flow

NexMart is built as an enterprise-grade microservice application using **Spring Boot (Java 21)** for the backend services and **Next.js (TypeScript)** for the frontend interface.

```
┌────────────────────────────────────────────────────────┐
│                   NEXT.JS FRONTEND                     │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 API GATEWAY (Port: 8080)               │
│         - Routing, JWT Security Filter, Headers        │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┼───────────────────┐
┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
│Auth Service │     │Prod Service │     │Order Service│
│ (Port: 8081)│     │ (Port: 8082)│     │ (Port: 8083)│
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                   │
                    ┌──────▼──────┐     ┌──────▼──────┐
                    │AI Service   │     │Invent Serv. │
                    │ (Port: 8085)│     │ (Port: 8084)│
                    └─────────────┘     └─────────────┘
```

---

## 📖 Feature & Function Directory (A to Z)

### A — AI Search & Assistant
*   **Semantic Queries:** The `ai-service` processes product search requests. It goes beyond simple keywords to identify intent (e.g., searching for "run" returns sports running shoes, and searching for "laptop" returns high-performance gaming laptops).
*   **Fallback Recommendations:** If no match is found, the system defaults to popular high-confidence general items.

### B — Best Sellers
*   **Sales Tracking:** The `product-service` computes and serves top-selling products via `/api/v1/products/best-sellers`.
*   **Home Page Feed:** Prominently featured on the Next.js landing page to drive conversion.

### C — Checkout Processing
*   **Tax & Shipping Computations:** The `order-service` automatically calculates an 18% GST rate and adds shipping costs (₹99 for orders under ₹999; free shipping for orders above ₹999).
*   **Simulated Payments:** Supports Prepaid (credit/debit/UPI) with mock transaction token generation or Cash on Delivery (COD).

### D — Dynamic Pricing Engine
*   **Stock-Based Adjustments:** The AI service dynamically modifies base prices based on stock levels:
    *   **Low Stock (< 10 units):** Automatically increases the price by **8%** to leverage high demand.
    *   **Excess Stock (> 100 units):** Automatically reduces the price by **5%** to clear inventory.

### E — Eureka Service Discovery
*   **Registry (Port: 8761):** All microservices register with the Eureka server upon startup.
*   **Feign Clients:** Enables secure, load-balanced, dynamic service-to-service RPC calls (e.g., Order Service communicating with Inventory Service).

### F — Flash Sales
*   **Timed Deals:** Serves time-limited discounts via `/api/v1/products/flash-sales`.
*   **Performance Cache:** Coded with aggressive Redis caching to support high concurrent read traffic during hot-sale events.

### G — Gateway Filter Routing
*   **Unified Access Point (Port: 8080):** Serves as the single endpoint for the frontend.
*   **Header Injection:** Decodes JWTs and injects `X-User-Id` and `X-User-Role` headers, ensuring downstream microservices don't have to re-evaluate tokens.

### H — Hashing (Password Security)
*   **BCrypt Encryption:** Strong hashing (strength factor 10) secures user passwords before database storage in the `auth-service`.

### I — Inventory Reservation
*   **Atomic Stock Operations:** The `inventory-service` executes lock-based reservations before orders are finalized to prevent double-selling.
*   **Saga Orchestration:** Automatically reserves stock during checkout. It commits stock on successful payment, or rolls back/releases stock if the transaction fails.

### J — JWT Authorization
*   **Stateless Security:** Issues compact, cryptographically signed access tokens with a **15-minute Time-To-Live (TTL)**.

### K — Kafka Messaging
*   **Asynchronous Processing:** Prepares event-driven communication (Order events, inventory state changes) to support async email alerts and real-time analytical logs.

### L — Login & Authentication
*   **Refresh Token Rotation (RTR):** Protects against replay attacks. Every time a refresh token is exchanged, the old one is invalidated and a brand new pair (access + refresh) is issued.

### M — Metrics & Analytics
*   **Admin Dashboard Integration:** The `analytics-service` aggregates platform metrics (total revenue, active orders, customer counts) to populate charts for the store administrator.

### N — Notification Dispatcher
*   **Multichannel Delivery:** Simulates email/SMS/Push notifications upon order updates or successful authentication.

### O — Order Placement Flow
*   **Multi-Step Checkout Saga:** 
    1. Check validation & create order draft (Status: `PENDING`).
    2. Request atomic inventory reservation.
    3. Complete payment validation.
    4. Confirm stock extraction and mark order as `PAID` or `PLACED`.

### P — Product Management
*   **Catalog & Slugs:** Admin-accessible routes to add products. Uses search-engine-friendly URLs (slugs) to improve SEO.

### R — Redis Caching
*   **Performance Optimization:** 
    *   **Products:** Cached for 5 minutes (invalidated immediately on updates).
    *   **Categories:** Cached for 60 minutes.
    *   **Flash Sales:** Cached for 2 minutes.

### S — Seller Dashboard
*   **Dedicated Workspace:** Access-controlled portal (`/seller/dashboard`) allowing merchants to view inventory and update product listings.

### T — Transaction Fraud Assessment
*   **AI Risk Assessment:** Analyzes payment method and transaction amounts.
*   **Threshold Trigger:** Flags transactions exceeding **₹250,000** with a high-risk fraud score (0.88), automatically triggering two-factor authentication (2FA).

### U — User Role Authorization
*   **Role-Based Access Control (RBAC):** Restricts API endpoints and client-side routes based on roles: `customer`, `seller`, and `admin`.

### W — Wishlist
*   **Personalized Boards:** Allows users to save favorite items for later checkout. Fully protected by authentication middleware.

---

## ⚠️ Error Cases & Handling (A to Z)

| Service / Area | Error Scenario | Internal Exception | HTTP Status / UI Action | Recovery / Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Registering with a duplicate email address | `IllegalStateException` | `409 Conflict` | Prompt user to log in instead or use another email. |
| **Authentication** | Password verification failure | `IllegalArgumentException` | `400 Bad Request` | "Invalid email or password" warning displayed. |
| **Authentication** | Expired or missing Access Token | SignatureException / JWT Expiry | `401 Unauthorized` | Frontend requests token refresh via `/auth/refresh`. |
| **Authentication** | Re-using a previously exchanged Refresh Token | Token Replay Attack | `401 Unauthorized` | Revokes the entire refresh token family; forces re-login. |
| **Security** | Customer attempting to view admin panel `/admin` | Middleware Filter | Redirects to Home `/` | Page load blocked by Next.js edge middleware. |
| **Checkout** | Out of stock / insufficient quantity | `IllegalStateException` | `409 Conflict` / Order goes to `FAILED` | Saga rollbacks: partial stock reservations are released. |
| **Checkout** | Non-existent product ID in checkout request | `ResourceNotFoundException` | `404 Not Found` | Error alert: "Product not found". Checkout halted. |
| **Checkout** | Invalid or expired coupon code | Code validation fails | Applied discount = 0 | Coupon ignored; order processes with standard price. |
| **Validation** | Missing required fields in registration | `MethodArgumentNotValidException` | `422 Unprocessable Entity` | Field-specific error details returned. |
| **AI Assessment** | Transaction amount exceeds ₹250,000 | Fraud Check Flag | Risk Score: 0.88 / `FLAGGED` | Transaction blocked until 2-Factor Authentication succeeds. |
| **Database** | PostgreSQL/Redis database down | Database Connection Refused | `500 Internal Server Error` | Global Exception Handler hides stack trace; asks user to retry. |
| **Microservices** | Feign client service-to-service network timeout | `RetryableException` / Timeout | `500 Internal Server Error` | Eureka registry removes unhealthy nodes; request fails safely. |