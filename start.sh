#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Iniciando el sistema Misionary...${NC}"

# Verificar si Docker está en ejecución
if ! docker info >/dev/null 2>&1; then
    echo -e "${YELLOW}Docker no está en ejecución. Iniciando Docker...${NC}"
    sudo service docker start
    sleep 5
fi

# Detener contenedores existentes
echo -e "${YELLOW}Deteniendo contenedores existentes...${NC}"
docker-compose down

# Limpiar volúmenes si se especifica --clean
if [ "$1" == "--clean" ]; then
    echo -e "${YELLOW}Limpiando volúmenes...${NC}"
    docker-compose down -v
    docker volume prune -f
fi

# Construir las imágenes
echo -e "${YELLOW}Construyendo las imágenes...${NC}"
docker-compose build

# Iniciar los servicios
echo -e "${YELLOW}Iniciando los servicios...${NC}"
docker-compose up -d

# Esperar a que los servicios estén listos
echo -e "${YELLOW}Esperando a que los servicios estén listos...${NC}"
sleep 10

# Mostrar los logs
echo -e "${GREEN}¡Sistema iniciado! Mostrando logs...${NC}"
docker-compose logs -f
