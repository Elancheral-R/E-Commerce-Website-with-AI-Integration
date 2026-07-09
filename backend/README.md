# NexMart Backend — Microservices Architecture

> Enterprise-grade AI-Powered Smart Commerce Platform  
> **Stack**: Java 21 · Spring Boot 3.3 · Spring Cloud 2023 · PostgreSQL · Redis · Kafka · Docker

---

## Architecture Overview

```
                        ┌─────────────────────────────────────┐
                        │         API GATEWAY :8080            │
                        │   (JWT Validation + Load Balancing)  │
                        └─────────────────┬───────────────────┘
                                          │
              ┌───────────────────────────┼────────────────────────────┐
              │                           │                            │
    ┌─────────▼────────┐      ┌───────────▼──────────┐    ┌──────────▼──────────┐
    │  Auth Service    │      │  Product Service     │    │  Order Service      │
    │  :8081           │      │  :8082 + Redis Cache │    │  :8083 + Feign RPC  │
    └──────────────────┘      └──────────────────────┘    └─────────────────────┘
              │                           │                            │
    ┌─────────▼────────┐      ┌───────────▼──────────┐    ┌──────────▼──────────┐
    │ Inventory Service│      │   AI Service         │    │Notification Service │
    │  :8084           │      │   :8085              │    │  :8086              │
    └──────────────────┘      └──────────────────────┘    └─────────────────────┘
              │
    ┌─────────▼────────┐      ┌────────────────────────────────────────────────┐
    │Analytics Service │      │         Discovery (Eureka) :8761               │
    │  :8087           │      └────────────────────────────────────────────────┘
    └──────────────────┘
```

---

## Services

| Service | Port | Description |
|---------|------|-------------|
| `discovery-service` | 8761 | Netflix Eureka service registry |
| `gateway-service` | 8080 | Spring Cloud Gateway — JWT validation, routing |
| `auth-service` | 8081 | Registration, Login, JWT issuance, Refresh token rotation |
| `product-service` | 8082 | Product catalog, categories, reviews, Redis caching |
| `order-service` | 8083 | Checkout, coupon validation, order lifecycle |
| `inventory-service` | 8084 | Stock management, atomic reservations |
| `ai-service` | 8085 | AI assistant, dynamic pricing engine, fraud scoring |
| `notification-service` | 8086 | Email / SMS / Push notification dispatcher |
| `analytics-service` | 8087 | Admin dashboard metrics aggregation |

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java JDK | 21+ |
| Apache Maven | 3.9+ |
| Docker Desktop | Latest |
| Docker Compose | v2.x |

> Install Java 21: https://adoptium.net/  
> Install Maven: https://maven.apache.org/download.cgi

---

## Quick Start

### 1. Start Infrastructure (Docker)

```bash
cd backend
docker compose up -d
```

This starts:
- **PostgreSQL** on port `5432` with 4 databases auto-created:
  - `nexmart_auth`, `nexmart_product`, `nexmart_inventory`, `nexmart_order`
- **Redis** on port `6379`
- **Kafka + Zookeeper** on port `9092`

Wait ~30 seconds for containers to be healthy.

### 2. Build All Modules

```bash
cd backend
mvn clean install -DskipTests
```

### 3. Start Services (in order)

Open a separate terminal for each service:

```bash
# Terminal 1 — Eureka Discovery
cd backend/discovery-service && mvn spring-boot:run

# Terminal 2 — API Gateway (after Eureka is up)
cd backend/gateway-service && mvn spring-boot:run

# Terminal 3 — Auth Service
cd backend/auth-service && mvn spring-boot:run

# Terminal 4 — Product Service
cd backend/product-service && mvn spring-boot:run

# Terminal 5 — Inventory Service
cd backend/inventory-service && mvn spring-boot:run

# Terminal 6 — Order Service
cd backend/order-service && mvn spring-boot:run

# Terminal 7 — AI Service
cd backend/ai-service && mvn spring-boot:run

# Terminal 8 — Notification Service
cd backend/notification-service && mvn spring-boot:run

# Terminal 9 — Analytics Service
cd backend/analytics-service && mvn spring-boot:run
```

---

## API Reference

All requests go through the Gateway at `http://localhost:8080`.  
Protected routes require `Authorization: Bearer <access_token>` header.

### Auth Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Register new user |
| `POST` | `/api/v1/auth/login` | ❌ | Login and get JWT tokens |
| `POST` | `/api/v1/auth/refresh` | ❌ | Rotate refresh token |
| `POST` | `/api/v1/auth/logout` | ✅ | Revoke all refresh tokens |
| `GET`  | `/api/v1/auth/me` | ✅ | Get current user profile |

**Register request:**
```json
{
  "name": "John Doe",
  "email": "john@nexmart.com",
  "password": "SecurePass123",
  "phone": "+91-9876543210"
}
```

**Login request:**
```json
{
  "email": "john@nexmart.com",
  "password": "SecurePass123"
}
```

---

### Product Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/v1/products` | ❌ | List all products |
| `GET`  | `/api/v1/products?query=laptop` | ❌ | Search products |
| `GET`  | `/api/v1/products?categoryId=<uuid>` | ❌ | Filter by category |
| `GET`  | `/api/v1/products/:slug` | ❌ | Get product by slug |
| `GET`  | `/api/v1/products/categories` | ❌ | List all categories |
| `GET`  | `/api/v1/products/flash-sales` | ❌ | Flash sale products |
| `GET`  | `/api/v1/products/best-sellers` | ❌ | Best seller products |
| `GET`  | `/api/v1/products/:id/reviews` | ❌ | Get product reviews |
| `POST` | `/api/v1/products/:id/reviews` | ✅ | Post a review |
| `POST` | `/api/v1/products` | ✅ | Create product (admin) |

---

### Order Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/orders/checkout` | ✅ | Place a new order |
| `GET`  | `/api/v1/orders` | ✅ | Get user's orders |
| `GET`  | `/api/v1/orders/:orderId` | ✅ | Get order details |

**Checkout request:**
```json
{
  "shippingAddress": "12 Baker Street, Mumbai 400001",
  "paymentMethod": "upi",
  "couponCode": "NEXMART50",
  "items": [
    {
      "productId": "<uuid>",
      "quantity": 1,
      "price": 88999.00
    }
  ]
}
```

**Demo coupon codes:**
- `NEXMART50` — ₹250 off
- `FREESHIP` — ₹99 off (free shipping)

---

### Inventory Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/v1/inventory/product/:productId` | ❌ | Get stock count |
| `POST` | `/api/v1/inventory/reserve` | ❌ | Reserve inventory |
| `POST` | `/api/v1/inventory/confirm/:orderId` | ❌ | Confirm reservation |
| `POST` | `/api/v1/inventory/release/:orderId` | ❌ | Release reservation |

---

### AI Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/v1/ai/assistant?query=laptop` | ❌ | AI product search |
| `GET`  | `/api/v1/ai/pricing/dynamic` | ❌ | Dynamic pricing engine |
| `POST` | `/api/v1/ai/fraud/assess` | ❌ | Fraud risk scoring |

---

### Analytics Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/v1/analytics/admin/dashboard` | ✅ | Admin dashboard metrics |

---

## Project Structure

```
backend/
├── pom.xml                          # Parent POM (dependency management)
├── docker-compose.yml               # Infrastructure containers
├── init-multiple-databases.sh       # Postgres multi-database init script
│
├── common-dto/                      # Shared DTOs, exceptions, events
│   └── src/.../common/
│       ├── dto/                     # AuthRequest, AuthResponse, UserDTO
│       ├── event/                   # OrderEvent, PaymentEvent, InventoryEvent
│       └── exception/               # ResourceNotFoundException
│
├── discovery-service/               # Eureka Server :8761
├── gateway-service/                 # API Gateway :8080
│
├── auth-service/                    # :8081
│   └── entity/User, RefreshToken
│   └── service/AuthService, JwtService
│   └── controller/AuthController
│   └── config/SecurityConfig
│
├── product-service/                 # :8082
│   └── entity/Product, Category, Review
│   └── service/ProductService (Redis @Cacheable)
│   └── config/RedisConfig, ProductSeeder
│
├── order-service/                   # :8083
│   └── entity/Order, OrderItem, Coupon
│   └── client/InventoryClient (Feign)
│   └── service/OrderService
│
├── inventory-service/               # :8084
│   └── entity/Inventory, InventoryReservation
│   └── service/InventoryService (atomic locking)
│
├── ai-service/                      # :8085
│   └── service/AIService (search, pricing, fraud)
│
├── notification-service/            # :8086
│   └── service/NotificationService
│
└── analytics-service/               # :8087
    └── service/AnalyticsService
```

---

## Environment Variables

Update each service's `application.yml` for production:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://<SUPABASE_HOST>:5432/postgres
    username: postgres
    password: <SUPABASE_PASSWORD>

jwt:
  secret: <64-char-random-hex-string>
```

---

## Key Design Decisions

### Security
- **JWT Access Token**: 15 min TTL — short-lived, stateless
- **Refresh Token Rotation**: Every refresh issues a new refresh token and revokes the old one — prevents token replay attacks
- **BCrypt**: Password hashing with strength 10
- **Gateway Filter**: Validates JWT and injects `X-User-Id` + `X-User-Role` headers — downstream services trust gateway headers

### Caching (Redis)
- Products cached for **5 minutes** — invalidated on update
- Categories cached for **60 minutes** — rarely change
- Flash sales cached for **2 minutes** — needs near-real-time accuracy

### Service Communication
- **Synchronous**: Feign Client (Order → Inventory for atomic reservation)
- **Async (future)**: Kafka events for notification triggers, analytics ingestion

### Order Saga Flow
```
Checkout → Reserve Inventory → Payment → Confirm Reservation
                ↓ (fail)
           Release Inventory → Mark Order FAILED
```

---

## Monitoring

- Eureka Dashboard: http://localhost:8761
- Each service exposes `/actuator/health`
