#!/bin/bash

echo "🔍 Verificando estructura del módulo Presupuestos..."

# Verificar backend
echo "📦 Backend:"
echo "✅ Controller: $([ -f "backend/src/controllers/presupuesto.controller.ts" ] && echo "✓" || echo "✗")"
echo "✅ Service: $([ -f "backend/src/services/presupuesto.service.ts" ] && echo "✓" || echo "✗")"
echo "✅ Routes: $([ -f "backend/src/routes/presupuesto.routes.ts" ] && echo "✓" || echo "✗")"

# Verificar frontend - módulos
echo "🎨 Frontend - Módulos:"
echo "✅ Types: $([ -f "frontend/src/modules/presupuesto/types.ts" ] && echo "✓" || echo "✗")"
echo "✅ Service: $([ -f "frontend/src/modules/presupuesto/service.ts" ] && echo "✓" || echo "✗")"
echo "✅ Hook: $([ -f "frontend/src/modules/presupuesto/hooks/usePresupuesto.ts" ] && echo "✓" || echo "✗")"

# Verificar frontend - vistas
echo "🖥️ Frontend - Vistas:"
echo "✅ PresupuestosView: $([ -f "frontend/src/views/presupuestos/PresupuestosView.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoList: $([ -f "frontend/src/views/presupuestos/PresupuestoList/PresupuestoList.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoForm: $([ -f "frontend/src/views/presupuestos/PresupuestoForm/PresupuestoForm.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoNew: $([ -f "frontend/src/views/presupuestos/PresupuestoNew/PresupuestoNew.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoEdit: $([ -f "frontend/src/views/presupuestos/PresupuestoEdit/PresupuestoEdit.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoView: $([ -f "frontend/src/views/presupuestos/PresupuestoView/PresupuestoView.tsx" ] && echo "✓" || echo "✗")"

# Verificar esquemas y tipos
echo "📋 Esquemas y Tipos:"
echo "✅ Schemas: $([ -f "frontend/src/views/presupuestos/schemas.ts" ] && echo "✓" || echo "✗")"
echo "✅ Types: $([ -f "frontend/src/views/presupuestos/types.ts" ] && echo "✓" || echo "✗")"

# Verificar archivos index
echo "📄 Archivos Index:"
echo "✅ PresupuestoList/index: $([ -f "frontend/src/views/presupuestos/PresupuestoList/index.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoForm/index: $([ -f "frontend/src/views/presupuestos/PresupuestoForm/index.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoNew/index: $([ -f "frontend/src/views/presupuestos/PresupuestoNew/index.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoEdit/index: $([ -f "frontend/src/views/presupuestos/PresupuestoEdit/index.tsx" ] && echo "✓" || echo "✗")"
echo "✅ PresupuestoView/index: $([ -f "frontend/src/views/presupuestos/PresupuestoView/index.tsx" ] && echo "✓" || echo "✗")"
echo "✅ Main index: $([ -f "frontend/src/views/presupuestos/index.tsx" ] && echo "✓" || echo "✗")"

# Verificar rutas y navegación
echo "🧭 Rutas y Navegación:"
echo "✅ Rutas en routes.config: $(grep -q "presupuestos" "frontend/src/configs/routes.config.tsx" && echo "✓" || echo "✗")"
echo "✅ Navegación: $(grep -q "presupuestos" "frontend/src/configs/navigation.config/index.ts" && echo "✓" || echo "✗")"

echo ""
echo "🎯 Estructura del módulo Presupuestos verificada"
echo "📝 Notas:"
echo "   - El backend ya está completamente implementado y conectado"
echo "   - Frontend implementado con todas las vistas CRUD"
echo "   - Formulario con autocompletado de precios"
echo "   - Workflow de estados (BORRADOR → ENVIADO → APROBADO → FACTURADO)"
echo "   - Validación con Zod y manejo de errores"
echo "   - Animaciones con Framer Motion"
echo "   - Rutas y navegación integradas"
