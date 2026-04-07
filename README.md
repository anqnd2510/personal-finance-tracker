# Personal Finance Tracker

Full-stack personal finance application with authentication, budgeting, analytics, AI chat, and rule-based transaction categorization.

## What It Does

- Authenticates users with JWT and a single-session policy.
- Tracks transactions, categories, budgets, analytics, and insights.
- Applies user-defined rules to auto-categorize transactions.
- Exposes Swagger docs for the backend API.
- Runs fully in Docker with PostgreSQL and Redis.

## Current Architecture

### High-Level Flow

```mermaid
flowchart LR
  Browser[Browser / React UI] --> Nginx[Nginx static frontend]
  Nginx --> API[Express API]
  API --> Prisma[Prisma ORM]
  Prisma --> Postgres[(PostgreSQL)]
  API --> Redis[(Redis)]
  API --> OpenAI[AI provider]
```

### Backend Layers

- Routes define HTTP endpoints and Swagger annotations.
- Controllers validate request state and shape HTTP responses.
- Services implement business rules such as login policy, rule resolution, and budget updates.
- Repositories handle Prisma database access.

### Key Backend Decisions

- Login uses one active Redis session per account by default.
- A second login returns `409 Conflict` unless `forceLogin=true` is sent.
- Transaction creation can auto-assign `categoryId` from a matching user rule.
- Rule matching is deterministic: highest priority wins, then stored rule order.
- Budget amounts are adjusted when transactions are created, updated, or deleted.
- Auth middleware fails closed if Redis session validation is unavailable.

### Frontend Structure

- React pages live in `src/pages`.
- Shared layout is handled by `DashboardLayout`, `Sidebar`, and `Header`.
- API calls live in `src/services`.
- SPA routing is served by Nginx with an `index.html` fallback.

## Tech Stack

- Frontend: React 19, Vite 6, Tailwind 4
- Backend: Node.js 22, Express 4, TypeScript 5
- ORM: Prisma 7
- Database: PostgreSQL
- Cache/session/rate limit store: Redis via ioredis
- Docs: swagger-jsdoc + swagger-ui-express
- Container runtime: Docker + Docker Compose

## Repository Layout

```text
.
├── docker-compose.yml
├── personal-finance-tracker-back-end/
└── personal-finance-tracker-front-end/
```

## Docker Quick Start

```bash
docker compose up -d --build
```

Access the app at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Swagger: http://localhost:4000/api-docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

Useful checks:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

## Local Development

### Backend

```bash
cd personal-finance-tracker-back-end
npm install
npm run dev
```

Minimum environment values:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres?schema=finance_app
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

### Frontend

```bash
cd personal-finance-tracker-front-end
npm install
npm run dev
```

Optional frontend env:

```env
VITE_API_URL=http://localhost:4000/api
```

## API Overview

All routes are mounted under `/api`.

### Authentication

- POST `/api/auths/register`
- POST `/api/auths/login`
- POST `/api/auths/logout`
- GET `/api/auths/profile`
- GET `/api/auths/verify`

### Accounts Admin

- GET `/api/auths/accounts`
- GET `/api/auths/accounts/:id`
- PUT `/api/auths/accounts/:id`
- PATCH `/api/auths/accounts/:id/deactivate`
- PATCH `/api/auths/accounts/:id/activate`
- DELETE `/api/auths/accounts/:id`

### Transactions

- POST `/api/transactions/create-transaction`
- GET `/api/transactions`
- GET `/api/transactions/:id`
- PUT `/api/transactions/update-transaction/:id`
- DELETE `/api/transactions/:id`

### Categories

- POST `/api/categories/create-category`
- GET `/api/categories`
- GET `/api/categories/:id`
- PUT `/api/categories/:id`
- DELETE `/api/categories/:id`

### Budgets

- POST `/api/budgets/create-budget`
- GET `/api/budgets`
- GET `/api/budgets/:id`
- PUT `/api/budgets/update-budget`
- DELETE `/api/budgets/delete-budget/:id`

### Rules

- POST `/api/rules/create-rule`
- GET `/api/rules`
- PUT `/api/rules/:id`
- DELETE `/api/rules/:id`

### Analytics and AI

- GET `/api/analytics/overview`
- GET `/api/analytics/category-analysis`
- POST `/api/ai/chat`
- GET `/api/insights`
- GET `/api/insights/rules`
- GET `/api/insights/rules/:ruleName`
- GET `/api/health`

## Authentication Notes

### Single-session policy

- The backend blocks a second login while an account already has an active session.
- That returns `409 Conflict`.
- To override the existing session, send `forceLogin=true` in the login payload.

Example:

```json
{
  "email": "user@example.com",
  "password": "YourPassword123!",
  "forceLogin": true
}
```

## Rule Engine Notes

- A rule belongs to one account.
- A rule maps description text to one category.
- Rules are matched by checking whether the transaction description contains the rule text.
- If multiple rules match, the highest priority is used.
- If no rule matches, the frontend should choose a category manually.

Example rule payload:

```json
{
  "name": "Shopee Auto",
  "descriptionContains": "shopee",
  "categoryId": "<category-id>",
  "priority": 200,
  "isActive": true
}
```

Example transaction payload that lets the rule engine decide the category:

```json
{
  "description": "shopee shirt dress",
  "amount": -200000,
  "type": "expense",
  "date": "2026-04-07"
}
```

## Docker Services

`docker-compose.yml` defines:

- `postgres` for PostgreSQL 16
- `redis` for sessions and rate limits
- `backend` for the Express API
- `frontend` for the React SPA served by Nginx

The frontend container prints its URL on startup and Nginx is configured to serve SPA routes like `/dashboard`, `/transactions`, `/rules`, and `/settings` correctly.

## Common Commands

```bash
# Start or rebuild everything
docker compose up -d --build

# Stop all services
docker compose down

# Remove volumes too, which deletes database data
docker compose down -v

# Rebuild only one service
docker compose up -d --build frontend
docker compose up -d --build backend
```

## Troubleshooting

### Login returns 409 Conflict

The account already has an active session. Log out first or send `forceLogin=true`.

### Frontend route refresh returns 404

The frontend is served by Nginx with SPA fallback. Rebuild the frontend container if you changed `nginx.conf`.

### Swagger shows no operations

Rebuild the backend container so route annotations are bundled into the image.

### PostgreSQL or Redis connection issues

Check container health first:

```bash
docker compose ps
```

## Security Notes

- Do not commit real credentials or API keys.
- Rotate any secrets that were exposed in logs, screenshots, or chat.
