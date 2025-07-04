# Etapa 1: build de dependencias
FROM node:20-alpine AS deps

WORKDIR /app

# Solo copiamos los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Etapa 2: construcción final
FROM node:20-alpine

WORKDIR /app

# Copiamos los archivos necesarios
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Aseguramos variables por defecto si no se pasan desde fuera
ENV NODE_ENV=production

# Generamos Prisma Client (si es necesario)
RUN npx prisma generate

# Exponemos el puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "run", "start:dev"]
