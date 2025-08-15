######## Backend - Build & Run (Production)
# Stage 1: Builder (incluye devDependencies para compilar TypeScript)
FROM node:20-slim AS builder

# Instalar herramientas de compilación y OpenSSL para Prisma
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG CACHEBUST=20250815-192339
COPY package.json package-lock.json ./
# Regenerar lockfile si está desincronizado, luego hacer npm ci
RUN echo "CACHEBUST=${CACHEBUST}" > /tmp/CACHEBUST && \
    (npm ci --cache=/tmp/empty-cache --prefer-offline=false || \
     (echo "npm ci falló, regenerando lockfile con force..." && \
      rm -f package-lock.json && \
      npm install --package-lock-only --force --no-audit --no-fund && \
      npm ci --force --cache=/tmp/empty-cache --prefer-offline=false))

COPY . .
# Generar Prisma Client con el schema ya copiado y luego compilar TypeScript
RUN npx prisma generate && npm run build

# Stage 2: Runner (solo dependencias de producción)
FROM node:20-slim AS runner

# Instalar OpenSSL para runtime de Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

ARG CACHEBUST=20250815-192339
COPY package.json package-lock.json ./
# Regenerar lockfile si está desincronizado, luego hacer npm ci de producción
RUN echo "CACHEBUST=${CACHEBUST}" > /tmp/CACHEBUST && \
    (npm ci --omit=dev --cache=/tmp/empty-cache --prefer-offline=false || \
     (echo "npm ci --omit=dev falló, regenerando lockfile con force..." && \
      rm -f package-lock.json && \
      npm install --package-lock-only --force --no-audit --no-fund && \
      npm ci --omit=dev --force --cache=/tmp/empty-cache --prefer-offline=false))

# Copiamos solo lo necesario para correr
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Prisma Client y migraciones al inicio
EXPOSE 3001
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && if [ \"$SEED_ON_START\" = \"true\" ]; then echo 'Running seed (compiled JS)...'; node dist/prisma/seed.js; fi && if [ -f dist/index.js ]; then node dist/index.js; elif [ -f dist/src/index.js ]; then node dist/src/index.js; else echo 'Build output not found. Contents of dist:'; ls -la dist || true; exit 1; fi"]
