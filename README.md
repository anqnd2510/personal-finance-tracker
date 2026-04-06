# Personal Finance Tracker

Full-stack personal finance application with authentication, budgeting, analytics, AI assistant, and rule-based insights.

## Features
- JWT authentication and role-based authorization
- Single-session login policy (one active session per account by default)
- Transactions, categories, budgets, analytics, and insights
- AI chat endpoint integration
- Swagger API docs at /api-docs
- Dockerized backend, frontend, PostgreSQL, and Redis

## Tech Stack
- Frontend: React 19, Vite 6, Tailwind 4
- Backend: Node.js 22, Express 4, TypeScript 5
- Database: PostgreSQL + Prisma
- Cache/Session/Rate limit store: Redis (ioredis)
- API docs: swagger-jsdoc + swagger-ui-express

## Repository Structure
```
.
├── docker-compose.yml
├── personal-finance-tracker-back-end/
└── personal-finance-tracker-front-end/
```

## Quick Start (Docker)

### 1. Run all services
```bash
docker compose up -d --build
```

### 2. Access services
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Swagger: http://localhost:4000/api-docs
- PostgreSQL (host): localhost:5432
- Redis (host): localhost:6379

### 3. Check status/logs
```bash
docker compose ps
docker compose logs -f backend
```

## Database Migration and Seed

After first startup, apply migrations and seed data:

```bash
cd personal-finance-tracker-back-end
DATABASE_URL='postgresql://postgres:password@localhost:5432/postgres?schema=finance_app' npx prisma migrate deploy
DATABASE_URL='postgresql://postgres:password@localhost:5432/postgres?schema=finance_app' npm run prisma:seed
```

## Local Development (Without Docker)

### Backend
```bash
cd personal-finance-tracker-back-end
npm install
npm run dev
```

Use .env based on .env.example. Minimum required values:

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

## Authentication Notes

Routes are mounted under /api. Authentication endpoints are under /api/auths.

Examples:
- POST /api/auths/register
- POST /api/auths/login
- POST /api/auths/logout
- GET /api/auths/profile

### Single-session policy
- Default behavior: if account already has an active session, new login is blocked with 409 Conflict.
- You can force a new login by sending forceLogin=true in login payload.

Example login payload:
```json
{
  "email": "user@example.com",
  "password": "YourPassword123!",
  "forceLogin": true
}
```

## Rate Limiting
- Global API limiter, auth limiter, and AI limiter are enabled.
- When limit is exceeded, API returns HTTP 429.

## Docker Services

docker-compose.yml defines:
- postgres (16-alpine)
- redis (7-alpine)
- backend (Node/TypeScript build)
- frontend (Vite build served by Nginx)

## Common Commands

```bash
# Start/rebuild
docker compose up -d --build

# Stop
docker compose down

# Remove volumes (danger: deletes DB data)
docker compose down -v

# Backend only rebuild
docker compose up -d --build backend

# Check backend health quickly
curl -sS http://localhost:4000/
```

## Troubleshooting

### Swagger shows "No operations defined in spec"
- Ensure backend image includes route source files for swagger-jsdoc scanning.
- Rebuild backend image:

```bash
docker compose up -d --build backend
```

### PostgreSQL connection refused
- Make sure Postgres container is running and healthy:

```bash
docker compose ps
```

- Host machine should use localhost:5432.
- Backend container should use postgres:5432.

### Redis errors on startup
- Ensure Redis service is up:

```bash
docker compose ps
docker compose logs -f redis
```

## Security Notes
- Never commit real credentials or API keys.
- Rotate any secrets that were exposed in logs, screenshots, or chat.
