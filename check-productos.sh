#!/bin/bash

echo "🔍 Verificando estructura de archivos para CRUD Productos..."
echo ""

# Verificar estructura de backend
echo "📦 Backend:"
echo "✅ Controlador: $(test -f /home/guido/workspace/misionary/backend/src/controllers/producto.controller.ts && echo 'OK' || echo 'MISSING')"
echo "✅ Servicio: $(test -f /home/guido/workspace/misionary/backend/src/services/producto.service.ts && echo 'OK' || echo 'MISSING')"
echo "✅ Rutas: $(test -f /home/guido/workspace/misionary/backend/src/routes/producto.routes.ts && echo 'OK' || echo 'MISSING')"
echo ""

# Verificar estructura de frontend
echo "🎨 Frontend - Módulos:"
echo "✅ Tipos: $(test -f /home/guido/workspace/misionary/frontend/src/modules/producto/types.ts && echo 'OK' || echo 'MISSING')"
echo "✅ Servicio: $(test -f /home/guido/workspace/misionary/frontend/src/modules/producto/service.ts && echo 'OK' || echo 'MISSING')"
echo "✅ Hook: $(test -f /home/guido/workspace/misionary/frontend/src/modules/producto/hooks/useProducto.ts && echo 'OK' || echo 'MISSING')"
echo ""

echo "🎨 Frontend - Vistas:"
echo "✅ Schemas: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/schemas.ts && echo 'OK' || echo 'MISSING')"
echo "✅ Tipos: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/types.ts && echo 'OK' || echo 'MISSING')"
echo "✅ Lista: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/ProductoList/ProductoList.tsx && echo 'OK' || echo 'MISSING')"
echo "✅ Formulario: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/ProductoForm/ProductoForm.tsx && echo 'OK' || echo 'MISSING')"
echo "✅ Nuevo: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/ProductoNew/ProductoNew.tsx && echo 'OK' || echo 'MISSING')"
echo "✅ Editar: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/ProductoEdit/ProductoEdit.tsx && echo 'OK' || echo 'MISSING')"
echo "✅ Vista Principal: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/ProductosView.tsx && echo 'OK' || echo 'MISSING')"
echo "✅ Index: $(test -f /home/guido/workspace/misionary/frontend/src/views/productos/index.tsx && echo 'OK' || echo 'MISSING')"
echo ""

echo "⚙️ Configuración:"
echo "✅ Rutas: $(grep -q 'productos' /home/guido/workspace/misionary/frontend/src/configs/routes.config.tsx && echo 'OK' || echo 'MISSING')"
echo "✅ Navegación: $(grep -q 'productos' /home/guido/workspace/misionary/frontend/src/configs/navigation.config/index.ts && echo 'OK' || echo 'MISSING')"
echo ""

echo "🎉 Verificación completa. Si todo muestra 'OK', el CRUD de productos está listo para usar."
