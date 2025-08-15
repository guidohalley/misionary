######## Backend - Build & Run (Production)
# Stage 1: Builder (incluye devDependencies para compilar TypeScript)
FROM node:20-alpine AS builder
WORKDIR /app

ARG CACHEBUST=0
COPY package.json package-lock.json ./
# Forzar invalidación de cache de dependencias cuando cambie CACHEBUST
RUN echo "CACHEBUST=${CACHEBUST}" > /tmp/CACHEBUST && npm ci

COPY . .
# Generar Prisma Client con el schema ya copiado y luego compilar TypeScript
RUN npx prisma generate && npm run build

# Stage 2: Runner (solo dependencias de producción)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ARG CACHEBUST=0
COPY package.json package-lock.json ./
# Forzar invalidación de cache de dependencias de runtime cuando cambie CACHEBUST
RUN echo "CACHEBUST=${CACHEBUST}" > /tmp/CACHEBUST && npm ci --omit=dev

# Copiamos solo lo necesario para correr
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Prisma Client y migraciones al inicio
EXPOSE 3001
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && if [ \"$SEED_ON_START\" = \"true\" ]; then echo 'Running seed (compiled JS)...'; node dist/prisma/seed.js; fi && if [ -f dist/index.js ]; then node dist/index.js; elif [ -f dist/src/index.js ]; then node dist/src/index.js; else echo 'Build output not found. Contents of dist:'; ls -la dist || true; exit 1; fi"]
