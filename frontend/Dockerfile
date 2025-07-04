FROM node:18-alpine as builder

# Argumentos de construcción
ARG VITE_API_URL

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Imagen de producción con Nginx
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto
EXPOSE 80

# Configurar el comando de inicio
CMD ["nginx", "-g", "daemon off;"]
