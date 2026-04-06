FROM node:22-alpine AS builder

WORKDIR /app

ARG DATABASE_URL=postgresql://postgres:password@postgres:5432/postgres?schema=finance_app
ENV DATABASE_URL=${DATABASE_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Reuse generated Prisma artifacts and compiled output from builder.
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/routes ./routes

EXPOSE 4000

CMD ["node", "dist/server.js"]
