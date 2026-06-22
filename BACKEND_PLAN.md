# Backend Build Plan — Aavya Foods

## Context

This is the backend for **Aavya Foods**, an Indian D2C e-commerce brand selling A2 Bilona Ghee. The frontend is a Next.js 16 / React 19 app using **TanStack Query** for server state and **Zustand** for cart state. No backend exists yet — all data is hardcoded. You are building the first backend for this product.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js with TypeScript |
| Framework | Fastify (preferred) or Express |
| Database | PostgreSQL via Prisma ORM |
| Auth | JWT (access + refresh tokens), email/OTP + phone/OTP login |
| File Storage | Cloudflare R2 or AWS S3 |
| Email | Resend or Nodemailer |
| SMS | MSG91 or Fast2SMS (for phone OTP) |
| Payments | Razorpay (UPI, cards, netbanking) |

---

## Data Models

```typescript
// Product
{
  id: string           // uuid
  name: string
  slug: string         // unique, never changes after creation
  weight: string       // e.g. "500ml", "1L"
  price: number        // INR paise (₹599 = 59900)
  mrp: number          // original list price for strike-through display
  imageSrc: string     // primary image URL
  images: string[]     // all product images
  badge?: string       // e.g. "Best Seller", "New"
  description?: string
  highlights: string[] // bullet point features
  detailParagraphs: string[]
  isActive: boolean
  createdAt: DateTime
}

// Testimonial
{
  id: string
  quote: string
  authorName: string
  authorLocation: string
  rating: number       // 1–5
  avatarInitials: string
  isActive: boolean
  sortOrder: number
}

// Post (Blog / Stories)
{
  id: number
  title: string
  excerpt: string
  caption: string
  category: 'Farm' | 'Process' | 'Seasonal' | 'Team'
  date: DateTime
  image: string        // cover image URL
  images: string[]     // gallery images
  featured: boolean
  author: string
  initials: string
  likesCount: number
  isPublished: boolean
}

// Comment
{
  id: number
  postId: number
  userId?: string      // null for guest comments
  author: string
  initials: string
  text: string
  createdAt: DateTime
}

// User
{
  id: string
  email?: string
  phone?: string
  name?: string
  role: 'admin' | 'user'
  createdAt: DateTime
}

// Order
{
  id: string
  userId?: string      // null for guest checkout
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  shippingAddress: Address
  createdAt: DateTime
}

// OrderItem
{
  id: string
  orderId: string
  productId: string
  quantity: number
  priceAtPurchase: number
}

// Address
{
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

// EmailSubscription
{
  id: string
  email: string
  subscribedAt: DateTime
  isActive: boolean
}

// PostLike (many-to-many)
{
  userId: string
  postId: number
  createdAt: DateTime
}

// PostSave (many-to-many)
{
  userId: string
  postId: number
  createdAt: DateTime
}
```

---

## API Endpoints

All endpoints under `/api/v1`. Prices in INR paise. Return `{ data, error, meta }` envelope.

### Products

```
GET    /products            → Product[]
GET    /products/:slug      → Product
POST   /products            → Product     [admin]
PUT    /products/:id        → Product     [admin]
DELETE /products/:id                      [admin]
```

### Testimonials

```
GET    /testimonials        → Testimonial[]
POST   /testimonials        → Testimonial  [admin]
PUT    /testimonials/:id    → Testimonial  [admin]
DELETE /testimonials/:id                   [admin]
```

### Posts

```
GET    /posts               → Post[]      (query: ?category=Farm&featured=true)
GET    /posts/:id           → Post
POST   /posts/:id/like      → { liked: boolean, likeCount: number }
DELETE /posts/:id/like      → { liked: boolean, likeCount: number }
POST   /posts/:id/save      → { saved: boolean }
DELETE /posts/:id/save      → { saved: boolean }
POST   /posts/:id/comments  → Comment
GET    /posts/:id/comments  → Comment[]
POST   /posts                              [admin]
PUT    /posts/:id                          [admin]
```

### Auth

```
POST   /auth/request-otp    → { message: string }   (body: { email } or { phone })
POST   /auth/verify-otp     → { accessToken, refreshToken, user }
POST   /auth/refresh        → { accessToken }
POST   /auth/logout
GET    /auth/me             → User        [auth]
```

### Cart → Orders

```
POST   /orders/initiate     → { razorpayOrderId, amount }
                              (body: { items: CartItem[], shippingAddress: Address })
POST   /orders/confirm      → Order
                              (body: { razorpayOrderId, razorpayPaymentId, razorpaySignature })
GET    /orders              → Order[]     [auth]
GET    /orders/:id          → Order       [auth]
```

### Subscriptions

```
POST   /subscribe           → { message: string }   (body: { email })
```

---

## Key Implementation Notes

1. **Prices** — Store and return prices in paise to avoid floating point errors. Frontend currently uses rupees — coordinate conversion at the API boundary or update the frontend to handle paise.

2. **Product slugs** — Frontend uses `/products/[slug]` with `generateStaticParams()`. The backend must guarantee stable, unique slugs. On product update, never change the slug.

3. **Post likes/saves without auth** — The frontend currently toggles likes client-side without a user session. Design the like/save endpoints to accept an anonymous device fingerprint token as a fallback when no auth token is present, so counts persist across page reloads even for logged-out users.

4. **Cart is client-only** — Cart lives in Zustand on the frontend. There is no server-side cart — orders are created in a single `POST /orders/initiate` call with the full cart payload. Do not build a cart API.

5. **Razorpay signature verification** — On `POST /orders/confirm`, always verify the Razorpay HMAC signature server-side before marking the order as confirmed. Never trust payment status from the client.

6. **CORS** — The Next.js frontend will call this API from a browser. Configure CORS to allow the frontend origin.

7. **Image URLs** — Product and post images are currently relative paths (`/images/...`) served by Next.js. For the backend, store absolute CDN URLs in the database and update the frontend to use `NEXT_PUBLIC_API_BASE_URL` for image resolution.

8. **React Query hooks** — `useProducts` and `useTestimonials` currently return hardcoded data after an artificial delay. Replace the mock return with a real `fetch` to `NEXT_PUBLIC_API_BASE_URL/api/v1/products` and `/testimonials`. The hooks already have proper loading/error state handling.

9. **Indian phone numbers** — If using phone-based OTP, validate `+91XXXXXXXXXX` format. Use MSG91, Twilio India, or Fast2SMS.

10. **Admin routes** — A simple `role: 'admin' | 'user'` field on the User model is sufficient. Check role in JWT middleware for all `[admin]` endpoints.

---

## Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RESEND_API_KEY=
R2_BUCKET_URL=
R2_ACCESS_KEY=
R2_SECRET_KEY=
MSG91_API_KEY=
FRONTEND_URL=
PORT=4000
```

---

## Deliverables

- [ ] Prisma schema with all models and migrations
- [ ] REST API with all endpoints above
- [ ] Razorpay payment flow (initiate + verify)
- [ ] OTP-based auth (email or phone)
- [ ] Admin middleware for protected routes
- [ ] Input validation on all endpoints (Zod recommended)
- [ ] README with local setup and API documentation
