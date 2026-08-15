Each has its own `package.json`, `.env`, and is run independently — the frontend talks
to the backend purely over HTTP.

## Features

- **Hotel operations** — room inventory & status, reservations with availability
  checking, one-click check-in/check-out, front desk arrivals/departures, housekeeping
  task flow, maintenance tickets, guest profiles
- **Restaurant & POS** — menu management, table management, order lifecycle
  (Pending → Preparing → Ready → Served → Completed), a live kitchen display, point-of-sale
  receipts
- **Finance** — invoicing with pay-off tracking, payments, expenses, revenue reports
  (hotel vs. restaurant, by day/month, with profit estimate)
- **Operations** — inventory with low-stock/out-of-stock tracking, suppliers, purchase
  orders that auto-update stock on receipt, hotel services & bookings
- **People** — employee records, staff attendance (clock in/out), task assignment,
  role-based staff accounts
- **Engagement** — guest reviews, notifications, promotions/discount codes, a loyalty
  points & tiers program
- **Admin** — automatic audit logging of every create/update/delete/login, document
  storage
- **Live dashboard** — occupancy rate, today's arrivals/departures, open invoices,
  revenue, and more, all pulled from one aggregate endpoint

## Tech stack

**Backend:** Node.js, Express, MongoDB/Mongoose, JWT auth, helmet/cors/rate-limiting
**Frontend:** React, TanStack Start, TanStack Router, TanStack Query, TypeScript,
Tailwind CSS, shadcn/ui

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/aurelia_suites   # or your Atlas connection string
JWT_SECRET=some_long_random_string
CORS_ORIGINS=http://localhost:8080                    # match your frontend's dev port
SEED_ADMIN_EMAIL=you@example.com
SEED_ADMIN_PASSWORD=YourPassword123
```

```bash
npm run seed   # creates a branch, an admin user, and sample data for every module
npm run dev    # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
npm run dev
```

Open the printed local URL, log in with the admin credentials from your backend `.env`,
and every module should show live data from MongoDB.

## Authentication

Staff accounts aren't self-registered — an Admin/Manager creates them via
`POST /api/v1/auth/register`. The seed script's admin account is your starting login.
See `backend/README.md` for the full auth flow and role list.

## API reference

The backend has its own detailed README (`backend/README.md`) covering:
- every endpoint and which frontend page it feeds
- query features available on every list endpoint (search/filter/sort/paginate)
- the business logic behind reservations, orders, purchases, invoices, etc.

## Common issues

- **CORS errors** — `CORS_ORIGINS` in `backend/.env` must include the exact origin
  (protocol + host + port) your frontend is running on.
- **404 on API calls** — `VITE_API_URL` in `frontend/.env` must include the `/api/v1`
  suffix.
- **Env changes not taking effect** — both `npm run dev` processes only read `.env` at
  startup; restart them after any change.

## License

Private project — not licensed for external use.