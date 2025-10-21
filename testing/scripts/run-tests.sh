#!/bin/bash

# Script para ejecutar tests E2E de Misionary
# Uso: ./scripts/run-tests.sh [tipo] [opciones]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "🧪 MISIONARY_TEST_AGENT - Script de ejecución de tests"
    echo ""
    echo "Uso: $0 [tipo] [opciones]"
    echo ""
    echo "Tipos de tests:"
    echo "  all         - Ejecutar todos los tests (por defecto)"
    echo "  auth        - Tests de autenticación y roles"
    echo "  presupuestos - Tests de presupuestos"
    echo "  clientes    - Tests de clientes"
    echo "  productos   - Tests de productos"
    echo "  servicios   - Tests de servicios"
    echo "  finanzas    - Tests de finanzas"
    echo "  ui          - Tests de interfaz y responsive"
    echo "  critical    - Tests críticos (auth + presupuestos)"
    echo ""
    echo "Opciones:"
    echo "  --headed    - Ejecutar con interfaz de navegador"
    echo "  --debug     - Ejecutar en modo debug"
    echo "  --ui        - Ejecutar con UI de Playwright"
    echo "  --mobile    - Ejecutar en modo móvil"
    echo "  --tablet    - Ejecutar en modo tablet"
    echo "  --desktop   - Ejecutar en modo escritorio"
    echo "  --firefox   - Ejecutar en Firefox"
    echo "  --webkit    - Ejecutar en WebKit"
    echo "  --dark      - Ejecutar en modo oscuro"
    echo "  --ci        - Ejecutar para CI/CD"
    echo "  --report    - Mostrar reporte HTML"
    echo ""
    echo "Ejemplos:"
    echo "  $0                          # Ejecutar todos los tests"
    echo "  $0 auth --headed            # Tests de auth con interfaz"
    echo "  $0 presupuestos --debug    # Tests de presupuestos en debug"
    echo "  $0 critical --ci           # Tests críticos para CI"
    echo "  $0 all --mobile            # Todos los tests en móvil"
}

# Función para verificar prerrequisitos
check_prerequisites() {
    echo -e "${BLUE}🔍 Verificando prerrequisitos...${NC}"
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Error: Ejecutar desde el directorio /testing${NC}"
        exit 1
    fi
    
    # Verificar que Playwright esté instalado
    if ! command -v npx &> /dev/null; then
        echo -e "${RED}❌ Error: npx no encontrado. Instalar Node.js${NC}"
        exit 1
    fi
    
    # Verificar que el servidor esté ejecutándose
    if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Servidor no encontrado en http://localhost:5173${NC}"
        echo -e "${YELLOW}   Asegúrate de ejecutar 'npm run dev' en el directorio frontend${NC}"
        echo -e "${YELLOW}   Continuando de todas formas...${NC}"
    else
        echo -e "${GREEN}✅ Servidor encontrado en http://localhost:5173${NC}"
    fi
}

# Función para ejecutar tests
run_tests() {
    local test_type="$1"
    shift
    local options="$@"
    
    echo -e "${BLUE}🧪 Ejecutando tests: $test_type${NC}"
    echo -e "${BLUE}📋 Opciones: $options${NC}"
    echo ""
    
    case $test_type in
        "all")
            npx playwright test $options
            ;;
        "auth")
            npx playwright test auth $options
            ;;
        "presupuestos")
            npx playwright test presupuestos $options
            ;;
        "clientes")
            npx playwright test clientes $options
            ;;
        "productos")
            npx playwright test productos $options
            ;;
        "servicios")
            npx playwright test servicios $options
            ;;
        "finanzas")
            npx playwright test finanzas $options
            ;;
        "ui")
            npx playwright test ui $options
            ;;
        "critical")
            npx playwright test --grep="auth|login|logout|presupuestos" $options
            ;;
        *)
            echo -e "${RED}❌ Tipo de test desconocido: $test_type${NC}"
            show_help
            exit 1
            ;;
    esac
}

# Función para procesar opciones
process_options() {
    local options=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --headed)
                options="$options --headed"
                shift
                ;;
            --debug)
                options="$options --debug"
                shift
                ;;
            --ui)
                options="$options --ui"
                shift
                ;;
            --mobile)
                options="$options --project=chromium-mobile"
                shift
                ;;
            --tablet)
                options="$options --project=chromium-tablet"
                shift
                ;;
            --desktop)
                options="$options --project=chromium-desktop"
                shift
                ;;
            --firefox)
                options="$options --project=firefox"
                shift
                ;;
            --webkit)
                options="$options --project=webkit"
                shift
                ;;
            --dark)
                options="$options --project=chromium-dark"
                shift
                ;;
            --ci)
                options="$options --project=chromium --reporter=html,junit,json"
                shift
                ;;
            --report)
                npx playwright show-report
                exit 0
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Opción desconocida: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
    
    echo "$options"
}

# Función principal
main() {
    # Verificar prerrequisitos
    check_prerequisites
    
    # Procesar argumentos
    local test_type="all"
    local options=""
    
    if [ $# -eq 0 ]; then
        # Sin argumentos, ejecutar todos los tests
        test_type="all"
    else
        # Verificar si el primer argumento es un tipo de test
        case $1 in
            "all"|"auth"|"presupuestos"|"clientes"|"productos"|"servicios"|"finanzas"|"ui"|"critical")
                test_type="$1"
                shift
                ;;
            "--help"|"-h")
                show_help
                exit 0
                ;;
        esac
        
        # Procesar opciones restantes
        options=$(process_options "$@")
    fi
    
    # Ejecutar tests
    run_tests "$test_type" $options
    
    # Mostrar resultado
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 Tests ejecutados exitosamente!${NC}"
        echo -e "${BLUE}📊 Para ver el reporte: npm run test:report${NC}"
    else
        echo ""
        echo -e "${RED}❌ Algunos tests fallaron${NC}"
        echo -e "${BLUE}📊 Para ver el reporte: npm run test:report${NC}"
        exit 1
    fi
}

# Ejecutar función principal
main "$@"

