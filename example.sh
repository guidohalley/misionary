#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Sistema Misionary - Script de Ejemplo${NC}"
echo -e "${YELLOW}Este script muestra cómo usar el sistema${NC}\n"

# Crear una persona
echo -e "${GREEN}1. Crear una persona${NC}"
curl -X POST http://localhost:3001/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "tipo": "CLIENTE",
    "roles": ["USER"]
  }'
echo -e "\n"

# Crear un producto
echo -e "${GREEN}2. Crear un producto${NC}"
curl -X POST http://localhost:3001/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto de prueba",
    "descripcion": "Este es un producto de ejemplo",
    "precio": 100.50,
    "stock": 10
  }'
echo -e "\n"

# Crear un presupuesto
echo -e "${GREEN}3. Crear un presupuesto${NC}"
curl -X POST http://localhost:3001/api/presupuestos \
  -H "Content-Type: application/json" \
  -d '{
    "personaId": 1,
    "fecha": "2025-06-04",
    "items": [
      {
        "productoId": 1,
        "cantidad": 2,
        "precioUnitario": 100.50
      }
    ]
  }'
echo -e "\n"

# Listar personas
echo -e "${GREEN}4. Listar personas${NC}"
curl http://localhost:3001/api/personas
echo -e "\n"

# Listar productos
echo -e "${GREEN}5. Listar productos${NC}"
curl http://localhost:3001/api/productos
echo -e "\n"

# Listar presupuestos
echo -e "${GREEN}6. Listar presupuestos${NC}"
curl http://localhost:3001/api/presupuestos
echo -e "\n"

echo -e "${GREEN}Fin del script de ejemplo${NC}"
