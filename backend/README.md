# Aurelia Suites — Backend API

Full backend for the Aurelia Suites hospitality management frontend (hotel operations +
restaurant/POS). Node.js, Express, MongoDB/Mongoose, JWT auth.

Built to match the 30 frontend modules in `hospitality-frontend/src/routes/` — see the
**Module → API mapping** table below for exactly which endpoint feeds which page.

## Stack

- **Runtime:** Node.js (Express 4)
- **Database:** MongoDB via Mongoose
- **Auth:** JWT bearer tokens, role-based access control
- **Security:** helmet, cors, rate limiting, mongo-sanitize (NoSQL injection protection)

## Getting started

```bash
cd aurelia-backend
npm install
cp .env.example .env
# edit .env — at minimum set MONGO_URI and JWT_SECRET

# start MongoDB (local) or point MONGO_URI at Atlas

npm run seed   # creates the Main Branch + an Admin user
npm run dev    # starts on http://localhost:5000 with auto-reload
# or: npm start
```

The seed script prints the admin login (email from `SEED_ADMIN_EMAIL`, password from
`SEED_ADMIN_PASSWORD` in your `.env`, both default in `.env.example`). **Change that
password immediately after first login** via `PATCH /api/v1/auth/update-password`.

Health check: `GET /api/health`

## Authentication

Staff accounts are provisioned by an Admin/Manager — there's no public self-registration.

```
POST /api/v1/auth/login          { email, password }              -> { token, data: { user } }
POST /api/v1/auth/register       (Admin/Manager only, Bearer token required)
GET  /api/v1/auth/me             (Bearer token required)
PATCH /api/v1/auth/update-password  { currentPassword, newPassword }
```

Send the token on every subsequent request:

```
Authorization: Bearer <token>
```

**Roles:** `Admin`, `Manager`, `FrontDesk`, `Housekeeping`, `Maintenance`, `Kitchen`,
`Waiter`, `Cashier`, `Accountant`, `HR`, `Inventory`. Sensitive write actions (branch
management, promotions, employee records, user management) are restricted to specific
roles in the relevant route file — adjust `restrictTo(...)` calls to match your real
staffing policy.

## Common query features (every list endpoint)

All `GET /api/v1/<resource>` endpoints support:

```
?search=term              text search across that resource's searchable fields
?field=value               exact filter, e.g. ?status=Available
?field[gte]=5&field[lte]=9 range filters (gte/gt/lte/lt/ne)
?sort=field,-otherField     sort (- prefix = descending)
?fields=a,b,c                limit returned fields
?page=2&limit=25             pagination (default limit 25, max 200)
```

Responses look like:

```json
{
  "status": "success",
  "results": 25,
  "total": 132,
  "page": 1,
  "limit": 25,
  "pages": 6,
  "data": [ ... ]
}
```

## Module → API mapping

| Frontend page | Base endpoint | Notes |
|---|---|---|
| Branch Management | `/api/v1/branches` | |
| Room Management | `/api/v1/rooms` | |
| Reservations & Booking | `/api/v1/reservations` | `GET /availability`, `PATCH /:id/check-in`, `PATCH /:id/check-out`, `PATCH /:id/cancel` |
| Reception / Front Desk | `/api/v1/reservations` + `/api/v1/invoices` | Arrivals/departures = reservations filtered by date; balances = open invoices |
| Guest Management | `/api/v1/guests` | |
| Housekeeping | `/api/v1/housekeeping` | `PATCH /:id/status` syncs the room's status too |
| Maintenance | `/api/v1/maintenance` | `PATCH /:id/status`; creating a ticket with a room sets that room to `Maintenance` |
| Menu Management | `/api/v1/menu-items` | |
| Restaurant Orders | `/api/v1/orders` | `PATCH /:id/status` enforces a valid state machine |
| Table Management | `/api/v1/tables` | |
| Kitchen Display | `/api/v1/orders/kitchen` | Active tickets (Pending/Preparing/Ready), oldest first, optional `?station=` |
| Restaurant POS | `/api/v1/sales` | |
| Payment Management | `/api/v1/payments` | |
| Billing & Invoicing | `/api/v1/invoices` | `POST /:id/pay` records a payment and marks Paid when fully covered |
| Expense Management | `/api/v1/expenses` | |
| Revenue & Financial Reports | `/api/v1/reports/revenue` | `?groupBy=day\|month&from=&to=` |
| Inventory Management | `/api/v1/inventory` | `status` (InStock/LowStock/OutOfStock) is a computed virtual |
| Supplier Management | `/api/v1/suppliers` | |
| Purchase Management | `/api/v1/purchases` | `POST /:id/receive` increments inventory stock + supplier balance |
| Hotel Services | `/api/v1/services` | |
| Service Bookings | `/api/v1/service-bookings` | |
| Reviews & Feedback | `/api/v1/reviews` | |
| Notifications | `/api/v1/notifications` | |
| Employee Management | `/api/v1/employees` | |
| Staff Attendance | `/api/v1/attendance` | `POST /clock-in`, `POST /clock-out` (by employee ID) |
| Task Management | `/api/v1/tasks` | |
| Promotions & Discounts | `/api/v1/promotions` | `status` (Active/Scheduled/Expired/Disabled) is computed |
| Loyalty & Rewards | `/api/v1/loyalty` | `POST /:id/earn`, `POST /:id/redeem` |
| Users & Roles | `/api/v1/users` (Admin/Manager) | account creation is `POST /api/v1/auth/register` |
| Audit Logs | `/api/v1/audit-logs` | read-only; every create/update/delete/login/status-change is logged automatically |
| Document Management | `/api/v1/documents` | stores a `fileUrl` — wire up S3/Cloudinary/etc. upstream for actual file storage |

Every stat card on the dashboard-style pages (Total rooms / Available / Occupied,
Arrivals today, Open tickets, etc.) can be fetched in one call:

```
GET /api/v1/reports/dashboard
```

## Business logic worth knowing about

- **Reservations:** creating one checks the room isn't double-booked for the date range
  (`GET /reservations/availability` exposes the same check standalone). Check-in sets the
  room to `Occupied`; check-out sets it to `Cleaning` (not `Available`) — housekeeping
  clears it via `PATCH /housekeeping/:id/status` with `cleaningStatus: "Ready"`.
- **Orders** follow a fixed state machine: `Pending → Preparing → Ready → Served →
  Completed`, with `Cancelled` reachable from the first three. Invalid transitions are
  rejected with a 400.
- **Purchases:** `POST /purchases/:id/receive` is the only way stock actually increases —
  it walks the PO's line items, increments each matched `InventoryItem.quantity`, and
  adds the PO total to the supplier's `balanceOwed`.
- **Invoices:** `total` (subtotal + tax − discount) is a computed virtual, not a stored
  field, so it's always consistent with the line-item `charges`.
- **Audit logs** are written automatically by the generic CRUD handler and by every
  custom action (check-in, receive PO, clock-in, etc.) — you don't need to call anything
  extra from the frontend.

## Project structure

```
src/
  app.js              Express app: middleware, routing, error handling
  server.js            entry point: connects DB, starts the HTTP server
  config/db.js          MongoDB connection
  models/                one file per Mongoose schema (28 models)
  controllers/           handlerFactory.js = generic CRUD; custom controllers for
                          resources with real business logic (reservations, orders,
                          housekeeping, maintenance, invoices, purchases, attendance,
                          loyalty, reports)
  routes/                one router per resource, mounted in routes/index.js
  middleware/            auth.js (JWT + role guard), errorHandler.js
  utils/                 AppError, catchAsync, apiFeatures (search/filter/sort/paginate),
                          seed.js
```

## Connecting the existing frontend

The frontend (`hospitality-frontend/`) currently ships with empty `ModulePage` shells
("Connect your backend and this table will populate automatically"). To wire it up:

1. Set an API base URL env var in the frontend (e.g. `VITE_API_URL=http://localhost:5000/api/v1`).
2. Add a small fetch wrapper that attaches `Authorization: Bearer <token>` from wherever
   you store the login token (e.g. a TanStack Query client + React context).
3. Replace each route's static `columns`/`stats` props with data fetched from the
   matching endpoint in the table above (e.g. `rooms.tsx` → `GET /rooms` for the table,
   `GET /reports/dashboard` → `data.rooms` for the stat cards).

This backend is a separate service from the frontend by design (different deployment
lifecycle, easy to scale independently) — CORS is already configured via `CORS_ORIGINS`
in `.env`.
