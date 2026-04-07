FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENV FRONTEND_PUBLIC_URL=http://localhost:5173

CMD ["sh", "-c", "echo 'Frontend is available at: '$FRONTEND_PUBLIC_URL && nginx -g 'daemon off;'"]
