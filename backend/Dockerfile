######## Backend - Build & Run (Production)
# Stage 1: Builder (incluye devDependencies para compilar TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Runner (solo dependencias de producción)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiamos solo lo necesario para correr
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Prisma Client y migraciones al inicio
EXPOSE 3001
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/index.js"]
