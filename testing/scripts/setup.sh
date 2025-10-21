#!/bin/bash

# Script de configuración para Misionary Testing E2E
# Este script configura el entorno de testing completo

set -e

echo "🧪 Configurando MISIONARY_TEST_AGENT..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecutar este script desde el directorio /testing"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Instalar navegadores de Playwright
echo "🌐 Instalando navegadores de Playwright..."
npx playwright install

# Instalar dependencias del sistema (Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🔧 Instalando dependencias del sistema..."
    sudo npx playwright install-deps
fi

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p reports/{html-report,test-results}
mkdir -p fixtures

# Generar archivos de configuración si no existen
if [ ! -f "fixtures/admin-state.json" ]; then
    echo "⚠️  Archivo admin-state.json no encontrado. Ejecuta 'npm run test:codegen:auth' para generarlo."
fi

if [ ! -f "fixtures/contador-state.json" ]; then
    echo "⚠️  Archivo contador-state.json no encontrado. Ejecuta 'npm run test:codegen:contador' para generarlo."
fi

if [ ! -f "fixtures/proveedor-state.json" ]; then
    echo "⚠️  Archivo proveedor-state.json no encontrado. Ejecuta 'npm run test:codegen:proveedor' para generarlo."
fi

if [ ! -f "fixtures/cliente-state.json" ]; then
    echo "⚠️  Archivo cliente-state.json no encontrado. Ejecuta 'npm run test:codegen:cliente' para generarlo."
fi

# Verificar que el servidor esté ejecutándose
echo "🔍 Verificando servidor de desarrollo..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Servidor de desarrollo ejecutándose en http://localhost:5173"
else
    echo "⚠️  Servidor de desarrollo no encontrado. Asegúrate de ejecutar 'npm run dev' en el directorio frontend"
fi

echo ""
echo "🎉 Configuración completada!"
echo ""
echo "Comandos disponibles:"
echo "  npm run test              - Ejecutar todos los tests"
echo "  npm run test:headed       - Ejecutar tests con interfaz"
echo "  npm run test:debug        - Ejecutar tests en modo debug"
echo "  npm run test:ui           - Ejecutar tests con UI de Playwright"
echo "  npm run test:auth         - Ejecutar tests de autenticación"
echo "  npm run test:presupuestos - Ejecutar tests de presupuestos"
echo "  npm run test:clientes     - Ejecutar tests de clientes"
echo "  npm run test:productos    - Ejecutar tests de productos"
echo "  npm run test:servicios    - Ejecutar tests de servicios"
echo "  npm run test:finanzas     - Ejecutar tests de finanzas"
echo "  npm run test:ui-tests     - Ejecutar tests de interfaz"
echo "  npm run test:mobile       - Ejecutar tests en móvil"
echo "  npm run test:tablet       - Ejecutar tests en tablet"
echo "  npm run test:desktop      - Ejecutar tests en escritorio"
echo "  npm run test:firefox      - Ejecutar tests en Firefox"
echo "  npm run test:webkit       - Ejecutar tests en WebKit"
echo "  npm run test:dark         - Ejecutar tests en modo oscuro"
echo "  npm run test:ci           - Ejecutar tests para CI/CD"
echo "  npm run test:report       - Ver reporte HTML"
echo ""
echo "Para generar estados de sesión:"
echo "  npm run test:codegen:auth      - Generar estado de admin"
echo "  npm run test:codegen:contador - Generar estado de contador"
echo "  npm run test:codegen:proveedor - Generar estado de proveedor"
echo "  npm run test:codegen:cliente  - Generar estado de cliente"
echo ""

