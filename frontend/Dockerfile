FROM node:20-alpine AS builder

# Construcción con Vite
ARG VITE_API_URL
ARG CACHEBUST=20250815-192339

WORKDIR /app

COPY package.json package-lock.json ./
# Usar npm ci y forzar bust de cache si cambia CACHEBUST
RUN echo "CACHEBUST=${CACHEBUST}" > /tmp/CACHEBUST && npm ci

COPY . .

# Pasar variable al build de Vite (prefijo VITE_)
ENV VITE_API_URL=$VITE_API_URL
RUN echo "VITE_API_URL=$VITE_API_URL" && npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiar la configuración de nginx si existe
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos compilados (outDir=build en vite.config.ts)
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
