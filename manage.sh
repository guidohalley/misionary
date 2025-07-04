#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Función para mostrar el menú
show_menu() {
    echo -e "\n${GREEN}=== Sistema Misionary - Administración de Contenedores ===${NC}"
    echo -e "1) Iniciar sistema"
    echo -e "2) Detener sistema"
    echo -e "3) Reiniciar sistema"
    echo -e "4) Ver logs"
    echo -e "5) Estado de contenedores"
    echo -e "6) Limpiar sistema (eliminar volúmenes)"
    echo -e "7) Ejecutar script de ejemplo"
    echo -e "8) Salir"
}

# Función para esperar confirmación
confirm() {
    read -p "¿Está seguro? [s/N] " response
    case "$response" in
        [sS]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Función para verificar Docker
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}Error: Docker no está en ejecución${NC}"
        exit 1
    fi
}

while true; do
    show_menu
    read -p "Seleccione una opción: " choice

    case $choice in
        1)
            echo -e "${YELLOW}Iniciando el sistema...${NC}"
            ./start.sh
            ;;
        2)
            echo -e "${YELLOW}Deteniendo el sistema...${NC}"
            docker-compose down
            ;;
        3)
            echo -e "${YELLOW}Reiniciando el sistema...${NC}"
            docker-compose restart
            ;;
        4)
            echo -e "${YELLOW}Mostrando logs...${NC}"
            echo -e "a) Todos los servicios"
            echo -e "b) Frontend"
            echo -e "c) Backend"
            echo -e "d) Base de datos"
            read -p "Seleccione un servicio: " service
            case $service in
                a)
                    docker-compose logs -f
                    ;;
                b)
                    docker-compose logs -f frontend
                    ;;
                c)
                    docker-compose logs -f backend
                    ;;
                d)
                    docker-compose logs -f postgres
                    ;;
                *)
                    echo -e "${RED}Opción inválida${NC}"
                    ;;
            esac
            ;;
        5)
            echo -e "${YELLOW}Estado de los contenedores:${NC}"
            docker-compose ps
            ;;
        6)
            if confirm; then
                echo -e "${RED}Limpiando el sistema...${NC}"
                docker-compose down -v
                docker volume prune -f
            fi
            ;;
        7)
            echo -e "${YELLOW}Ejecutando script de ejemplo...${NC}"
            ./example.sh
            ;;
        8)
            echo -e "${GREEN}¡Hasta luego!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Opción inválida${NC}"
            ;;
    esac

    echo -e "\nPresione Enter para continuar..."
    read
done
