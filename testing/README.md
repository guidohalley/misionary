# 🧪 **MISIONARY_TEST_AGENT** - Testing E2E

## Descripción

Este directorio contiene la arquitectura completa de testing end-to-end (E2E) para el sistema **Misionary CRM/ERP**. Utiliza **Playwright** con **TypeScript** para garantizar la calidad y estabilidad del sistema.

## Estructura del Proyecto

```
testing/
├── config/
│   └── playwright.config.ts    # Configuración principal de Playwright
├── e2e/                        # Tests end-to-end
│   ├── auth.spec.ts           # Tests de autenticación y roles
│   ├── presupuestos.spec.ts   # Tests de gestión de presupuestos
│   ├── clientes.spec.ts       # Tests de gestión de clientes
│   ├── productos.spec.ts      # Tests de gestión de productos
│   ├── servicios.spec.ts      # Tests de gestión de servicios
│   ├── finanzas.spec.ts       # Tests de módulo financiero
│   └── ui.spec.ts             # Tests de interfaz y responsive
├── fixtures/                   # Datos de prueba y estados
│   ├── user-fixtures.ts       # Fixtures de usuarios por rol
│   ├── data-snapshots.json    # Snapshots de datos de prueba
│   ├── admin-state.json       # Estado de sesión de administrador
│   ├── contador-state.json    # Estado de sesión de contador
│   └── vendedor-state.json    # Estado de sesión de vendedor
├── utils/                      # Utilidades y helpers
│   ├── helpers.ts             # Funciones auxiliares
│   ├── selectors.ts           # Selectores CSS personalizados
│   └── test-data.ts           # Datos de prueba tipados
└── reports/                    # Reportes de testing
    ├── html-report/           # Reporte HTML interactivo
    ├── test-results/          # Resultados detallados
    └── results.json           # Resultados en formato JSON
```

## Configuración del Entorno

### Prerrequisitos

- Node.js 18+ 
- Navegadores: Chromium, Firefox, WebKit
- Sistema Misionary ejecutándose en `http://localhost:5173`

### Instalación

```bash
# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install

# Instalar dependencias del sistema (Linux)
sudo npx playwright install-deps
```

## Comandos de Testing

### Ejecutar todos los tests

```bash
# Ejecutar todos los tests
npx playwright test

# Ejecutar tests en modo headed (con interfaz)
npx playwright test --headed

# Ejecutar tests en modo debug
npx playwright test --debug
```

### Ejecutar tests con logging

```bash
# Ejecutar tests y guardar logs automáticamente
npm run test:with-logs all

# Tests específicos con logs
npm run test:with-logs auth
npm run test:with-logs presupuestos
npm run test:with-logs clientes

# Ver logs
npm run logs:latest      # Ver último log completo
npm run logs:summary     # Ver resumen del último test
npm run logs:errors      # Ver solo errores
npm run logs:list        # Listar todos los logs

# Limpiar logs antiguos
npm run logs:clean
```

### Ejecutar tests específicos

```bash
# Tests de autenticación
npx playwright test auth

# Tests de presupuestos
npx playwright test presupuestos

# Tests de un rol específico
npx playwright test --grep "rol ADMIN"

# Tests en un navegador específico
npx playwright test --project=chromium-desktop
```

### Generar reportes

```bash
# Ejecutar tests y generar reporte HTML
npx playwright test --reporter=html

# Ver reporte HTML
npx playwright show-report
```

## Roles y Permisos

El sistema Misionary maneja los siguientes roles:

- **ADMIN**: Acceso completo al sistema
- **CONTADOR**: Acceso a finanzas y reportes
- **PROVEEDOR**: Gestión de productos y servicios
- **CLIENTE**: Acceso limitado a su información

## Fixtures y Estados de Sesión

### Generar estados de sesión

```bash
# Generar estado de sesión para administrador
npx playwright codegen --save-storage=fixtures/admin-state.json

# Generar estado de sesión para contador
npx playwright codegen --save-storage=fixtures/contador-state.json

# Generar estado de sesión para vendedor
npx playwright codegen --save-storage=fixtures/vendedor-state.json
```

### Usar estados en tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Tests de Administrador', () => {
  test.use({ storageState: 'fixtures/admin-state.json' });
  
  test('Admin puede acceder a todas las secciones', async ({ page }) => {
    // Test implementation
  });
});
```

## Configuración de CI/CD

### GitHub Actions

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: testing/reports/html-report/
```

### Railway

```bash
# Comando para Railway
npx playwright test --project=chromium --reporter=html
```

## Mejores Prácticas

### 1. Selectores

- Usar `data-testid` para elementos críticos
- Preferir selectores semánticos (`role`, `aria-label`)
- Evitar selectores CSS frágiles

### 2. Datos de Prueba

- Usar fixtures para datos consistentes
- Limpiar datos después de cada test
- Usar datos realistas pero anónimos

### 3. Assertions

- Validar tanto funcionalidad como UI
- Verificar mensajes de error y éxito
- Comprobar estados de carga

### 4. Performance

- Usar `page.waitForLoadState()` cuando sea necesario
- Evitar `page.waitForTimeout()` innecesarios
- Optimizar para ejecución paralela

## Troubleshooting

### Problemas Comunes

1. **Tests fallan por timeout**
   - Verificar que el servidor esté ejecutándose
   - Aumentar timeout en configuración
   - Revisar selectores CSS

2. **Estado de sesión no funciona**
   - Regenerar estados de sesión
   - Verificar que las cookies no hayan expirado
   - Comprobar configuración de baseURL

3. **Tests inconsistentes**
   - Usar `test.describe.serial()` para tests dependientes
   - Limpiar estado entre tests
   - Verificar datos de prueba

### Debug

```bash
# Ejecutar test específico en modo debug
npx playwright test auth.spec.ts --debug

# Generar trace para análisis
npx playwright test --trace=on

# Ver trace en modo visual
npx playwright show-trace
```

## Contribución

Para agregar nuevos tests:

1. Crear archivo `.spec.ts` en `/e2e/`
2. Seguir convenciones de naming
3. Incluir tests para diferentes roles
4. Documentar casos de uso
5. Actualizar este README

## Contacto

Para dudas sobre testing o reportar bugs:
- Revisar logs en `/reports/`
- Consultar documentación de Playwright
- Verificar configuración del sistema

