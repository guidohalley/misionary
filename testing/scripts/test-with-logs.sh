#!/bin/bash

# Script para ejecutar tests con logging completo
# Uso: ./scripts/test-with-logs.sh [tipo] [opciones]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración de directorios
LOG_DIR="../logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="${LOG_DIR}/test_${TIMESTAMP}.log"
ERROR_LOG_FILE="${LOG_DIR}/test_errors_${TIMESTAMP}.log"
SUMMARY_FILE="${LOG_DIR}/test_summary_${TIMESTAMP}.txt"

# Crear directorio de logs si no existe
mkdir -p "$LOG_DIR"

# Función para escribir en log
log() {
    local message="$1"
    echo -e "${message}" | tee -a "$LOG_FILE"
}

# Función para escribir errores
log_error() {
    local message="$1"
    echo -e "${RED}${message}${NC}" | tee -a "$LOG_FILE" >> "$ERROR_LOG_FILE"
}

# Función para escribir éxito
log_success() {
    local message="$1"
    echo -e "${GREEN}${message}${NC}" | tee -a "$LOG_FILE"
}

# Función para escribir advertencia
log_warning() {
    local message="$1"
    echo -e "${YELLOW}${message}${NC}" | tee -a "$LOG_FILE"
}

# Función para escribir info
log_info() {
    local message="$1"
    echo -e "${BLUE}${message}${NC}" | tee -a "$LOG_FILE"
}

# Header del log
log_info "╔═══════════════════════════════════════════════════════════════╗"
log_info "║  🧪 MISIONARY_TEST_AGENT - Ejecución de Tests E2E            ║"
log_info "╚═══════════════════════════════════════════════════════════════╝"
log ""
log_info "📅 Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
log_info "👤 Usuario: $(whoami)"
log_info "🖥️  Host: $(hostname)"
log_info "📂 Directorio: $(pwd)"
log_info "📝 Log file: $LOG_FILE"
log ""

# Información del sistema
log_info "═══ Información del Sistema ═══"
log_info "Node version: $(node --version 2>&1 || echo 'No instalado')"
log_info "npm version: $(npm --version 2>&1 || echo 'No instalado')"
log_info "Sistema operativo: $(uname -s)"
log ""

# Verificar prerrequisitos
log_info "═══ Verificando Prerrequisitos ═══"

if [ ! -f "package.json" ]; then
    log_error "❌ Error: package.json no encontrado"
    log_error "   Ejecutar desde el directorio /testing"
    exit 1
fi
log_success "✅ package.json encontrado"

if ! command -v npx &> /dev/null; then
    log_error "❌ Error: npx no encontrado"
    log_error "   Instalar Node.js"
    exit 1
fi
log_success "✅ npx encontrado"

# Verificar servidor de desarrollo
log_info "Verificando servidor de desarrollo..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    log_success "✅ Servidor encontrado en http://localhost:5173"
else
    log_warning "⚠️  Servidor no encontrado en http://localhost:5173"
    log_warning "   Asegúrate de ejecutar 'npm run dev' en el directorio frontend"
fi
log ""

# Determinar tipo de test
TEST_TYPE="${1:-all}"
shift 2>/dev/null || true
TEST_OPTIONS="$@"

log_info "═══ Configuración de Tests ═══"
log_info "Tipo de test: $TEST_TYPE"
log_info "Opciones: $TEST_OPTIONS"
log ""

# Construir comando de test
TEST_CMD="npx playwright test"

case $TEST_TYPE in
    "all")
        TEST_CMD="$TEST_CMD"
        ;;
    "auth")
        TEST_CMD="$TEST_CMD auth"
        ;;
    "presupuestos")
        TEST_CMD="$TEST_CMD presupuestos"
        ;;
    "clientes")
        TEST_CMD="$TEST_CMD clientes"
        ;;
    "productos")
        TEST_CMD="$TEST_CMD productos"
        ;;
    "servicios")
        TEST_CMD="$TEST_CMD servicios"
        ;;
    "finanzas")
        TEST_CMD="$TEST_CMD finanzas"
        ;;
    "ui")
        TEST_CMD="$TEST_CMD ui"
        ;;
    "critical")
        TEST_CMD="$TEST_CMD --grep='auth|login|logout|presupuestos'"
        ;;
    *)
        log_error "❌ Tipo de test desconocido: $TEST_TYPE"
        exit 1
        ;;
esac

# Agregar opciones
TEST_CMD="$TEST_CMD $TEST_OPTIONS"

# Agregar reporteros
TEST_CMD="$TEST_CMD --reporter=html,json,junit"

log_info "Comando a ejecutar: $TEST_CMD"
log ""

# Ejecutar tests
log_info "═══ Ejecutando Tests ═══"
log ""

START_TIME=$(date +%s)

# Ejecutar y capturar salida
if $TEST_CMD 2>&1 | tee -a "$LOG_FILE"; then
    TEST_RESULT=0
    log ""
    log_success "═══ Tests Completados Exitosamente ═══"
else
    TEST_RESULT=$?
    log ""
    log_error "═══ Tests Fallaron ═══"
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Generar resumen
log ""
log_info "═══ Resumen de Ejecución ═══"
log_info "Duración: ${DURATION} segundos"
log_info "Resultado: $([ $TEST_RESULT -eq 0 ] && echo 'ÉXITO' || echo 'FALLO')"
log ""

# Crear archivo de resumen
{
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║  RESUMEN DE TESTS - MISIONARY_TEST_AGENT                     ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "Tipo de test: $TEST_TYPE"
    echo "Opciones: $TEST_OPTIONS"
    echo "Duración: ${DURATION} segundos"
    echo "Resultado: $([ $TEST_RESULT -eq 0 ] && echo 'ÉXITO ✅' || echo 'FALLO ❌')"
    echo ""
    echo "Archivos generados:"
    echo "  - Log completo: $LOG_FILE"
    [ -f "$ERROR_LOG_FILE" ] && echo "  - Log de errores: $ERROR_LOG_FILE"
    echo "  - Resumen: $SUMMARY_FILE"
    echo "  - Reporte HTML: reports/html-report/index.html"
    echo "  - Reporte JSON: reports/results.json"
    echo "  - Reporte JUnit: reports/results.xml"
    echo ""
    echo "Para ver el reporte HTML:"
    echo "  npm run test:report"
    echo ""
} > "$SUMMARY_FILE"

# Mostrar resumen
cat "$SUMMARY_FILE"

# Información sobre logs
log_info "═══ Archivos Generados ═══"
log_info "📝 Log completo: $LOG_FILE"
[ -f "$ERROR_LOG_FILE" ] && log_warning "⚠️  Log de errores: $ERROR_LOG_FILE"
log_info "📊 Resumen: $SUMMARY_FILE"
log_info "📈 Reporte HTML: reports/html-report/index.html"
log_info "📄 Reporte JSON: reports/results.json"
log_info "📋 Reporte JUnit: reports/results.xml"
log ""

# Estadísticas de archivos de log
log_info "═══ Estadísticas de Logs ═══"
if [ -f "$LOG_FILE" ]; then
    LOG_SIZE=$(du -h "$LOG_FILE" | cut -f1)
    LOG_LINES=$(wc -l < "$LOG_FILE")
    log_info "Tamaño del log: $LOG_SIZE"
    log_info "Líneas del log: $LOG_LINES"
fi
log ""

# Limpiar logs antiguos (mantener últimos 30)
log_info "═══ Limpieza de Logs Antiguos ═══"
cd "$LOG_DIR"
LOG_COUNT=$(ls -1 test_*.log 2>/dev/null | wc -l)
if [ "$LOG_COUNT" -gt 30 ]; then
    log_warning "Se encontraron $LOG_COUNT archivos de log"
    log_info "Manteniendo los últimos 30..."
    ls -t test_*.log | tail -n +31 | xargs rm -f
    ls -t test_errors_*.log 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null || true
    ls -t test_summary_*.txt 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null || true
    log_success "✅ Logs antiguos eliminados"
else
    log_info "Total de logs: $LOG_COUNT (no es necesario limpiar)"
fi
cd - > /dev/null
log ""

# Instrucciones finales
log_info "═══ Siguientes Pasos ═══"
log_info "Ver reporte HTML:"
log_info "  npm run test:report"
log ""
log_info "Ver logs:"
log_info "  cat $LOG_FILE"
log_info "  tail -f $LOG_FILE"
log ""
log_info "Buscar en logs:"
log_info "  grep 'ERROR' $LOG_FILE"
log_info "  grep 'PASS' $LOG_FILE"
log_info "  grep 'FAIL' $LOG_FILE"
log ""

# Footer
log_info "╔═══════════════════════════════════════════════════════════════╗"
log_info "║  Ejecución finalizada - $(date '+%H:%M:%S')                          ║"
log_info "╚═══════════════════════════════════════════════════════════════╝"

exit $TEST_RESULT

