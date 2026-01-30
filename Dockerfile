# ---------- BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/

RUN npm install

COPY . .

RUN npm run build -w apps/backend
RUN npm run build -w apps/frontend

# ---------- RUNTIME ----------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./backend
COPY --from=builder /app/apps/frontend/dist ./frontend
COPY --from=builder /app/apps/backend/package.json ./backend/package.json

RUN npm install --production --prefix ./backend

EXPOSE 3000

CMD ["node", "backend/main.js"]
