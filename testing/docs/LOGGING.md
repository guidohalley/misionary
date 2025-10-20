# 📝 Sistema de Logging - MISIONARY_TEST_AGENT

## Descripción

El sistema de logging de Misionary Test Agent guarda automáticamente todos los logs de ejecución de tests, incluyendo:

- **Logs completos** de cada ejecución
- **Logs de errores** específicos
- **Resúmenes** ejecutivos de resultados
- **Reportes** en múltiples formatos (HTML, JSON, JUnit)

## Estructura de Logs

```
testing/
└── logs/
    ├── test_YYYYMMDD_HHMMSS.log           # Log completo
    ├── test_errors_YYYYMMDD_HHMMSS.log    # Solo errores
    └── test_summary_YYYYMMDD_HHMMSS.txt   # Resumen ejecutivo
```

## Comandos de Logging

### Ejecutar tests con logging

```bash
# Ejecutar tests y guardar logs automáticamente
npm run test:with-logs all

# Tests específicos con logs
./scripts/test-with-logs.sh auth
./scripts/test-with-logs.sh presupuestos
./scripts/test-with-logs.sh clientes

# Con opciones adicionales
./scripts/test-with-logs.sh auth --headed
./scripts/test-with-logs.sh presupuestos --debug
```

### Ver logs

```bash
# Ver el último log en tiempo real
npm run logs:view

# Ver el último log completo
npm run logs:latest

# Ver solo errores del último test
npm run logs:errors

# Ver resumen del último test
npm run logs:summary

# Listar todos los logs
npm run logs:list
```

### Gestión de logs

```bash
# Limpiar todos los logs
npm run logs:clean

# Ver logs específicos
cat logs/test_20240120_143022.log
tail -f logs/test_20240120_143022.log
```

## Formato de Logs

### Log Completo

Cada log incluye:

```
╔═══════════════════════════════════════════════════════════════╗
║  🧪 MISIONARY_TEST_AGENT - Ejecución de Tests E2E            ║
╚═══════════════════════════════════════════════════════════════╝

📅 Fecha: 2024-01-20 14:30:22
👤 Usuario: guido
🖥️  Host: misionary-dev
📂 Directorio: /home/guido/workspace/misionary/testing
📝 Log file: ../logs/test_20240120_143022.log

═══ Información del Sistema ═══
Node version: v18.17.0
npm version: 9.6.7
Sistema operativo: Linux

═══ Verificando Prerrequisitos ═══
✅ package.json encontrado
✅ npx encontrado
✅ Servidor encontrado en http://localhost:5173

═══ Configuración de Tests ═══
Tipo de test: auth
Opciones: --headed

═══ Ejecutando Tests ═══

[... salida de playwright ...]

═══ Resumen de Ejecución ═══
Duración: 45 segundos
Resultado: ÉXITO

═══ Archivos Generados ═══
📝 Log completo: ../logs/test_20240120_143022.log
📊 Resumen: ../logs/test_summary_20240120_143022.txt
📈 Reporte HTML: reports/html-report/index.html
📄 Reporte JSON: reports/results.json
📋 Reporte JUnit: reports/results.xml

═══ Estadísticas de Logs ═══
Tamaño del log: 156K
Líneas del log: 2340

═══ Limpieza de Logs Antiguos ═══
Total de logs: 15 (no es necesario limpiar)

╔═══════════════════════════════════════════════════════════════╗
║  Ejecución finalizada - 14:31:07                             ║
╚═══════════════════════════════════════════════════════════════╝
```

### Log de Errores

Contiene solo los errores encontrados durante la ejecución:

```
❌ Error: Test fallido en auth.spec.ts:45
❌ Error: Selector '[data-testid="login-button"]' no encontrado
❌ Error: Timeout esperando navegación
```

### Resumen Ejecutivo

Resumen breve y legible:

```
╔═══════════════════════════════════════════════════════════════╗
║  RESUMEN DE TESTS - MISIONARY_TEST_AGENT                     ║
╚═══════════════════════════════════════════════════════════════╝

Fecha: 2024-01-20 14:31:07
Tipo de test: auth
Opciones: --headed
Duración: 45 segundos
Resultado: ÉXITO ✅

Archivos generados:
  - Log completo: ../logs/test_20240120_143022.log
  - Resumen: ../logs/test_summary_20240120_143022.txt
  - Reporte HTML: reports/html-report/index.html
  - Reporte JSON: reports/results.json
  - Reporte JUnit: reports/results.xml

Para ver el reporte HTML:
  npm run test:report
```

## Búsqueda en Logs

### Buscar errores

```bash
grep 'ERROR' logs/test_*.log
grep -i 'error' logs/test_20240120_143022.log
```

### Buscar tests específicos

```bash
grep 'auth.spec.ts' logs/test_*.log
grep 'PASS' logs/test_20240120_143022.log
grep 'FAIL' logs/test_20240120_143022.log
```

### Buscar por fecha

```bash
ls -l logs/test_20240120*.log
cat logs/test_20240120_*.log | grep 'ERROR'
```

### Buscar en todos los logs

```bash
find logs -name "test_*.log" -exec grep -l "auth.spec.ts" {} \;
```

## Limpieza Automática

El sistema mantiene automáticamente los **últimos 30 archivos de log** y elimina los más antiguos para evitar acumulación excesiva.

Puedes modificar este comportamiento editando `scripts/test-with-logs.sh`:

```bash
# Cambiar de 30 a 50 logs
if [ "$LOG_COUNT" -gt 50 ]; then
    ls -t test_*.log | tail -n +51 | xargs rm -f
    ...
fi
```

## Integración con CI/CD

En entornos de CI/CD, los logs se suben automáticamente como artefactos:

```yaml
- name: Subir logs
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-logs
    path: testing/logs/
    retention-days: 30
```

## Análisis de Logs

### Estadísticas básicas

```bash
# Contar tests pasados
grep -c "PASS" logs/test_20240120_143022.log

# Contar tests fallidos
grep -c "FAIL" logs/test_20240120_143022.log

# Ver duración total
grep "Duración:" logs/test_summary_*.txt
```

### Logs más recientes

```bash
# Últimos 5 logs
ls -t logs/test_*.log | head -n 5

# Ver el más reciente
tail -100 $(ls -t logs/test_*.log | head -n 1)
```

## Mejores Prácticas

1. **Revisar logs después de cada ejecución**
   ```bash
   npm run test:with-logs auth
   npm run logs:summary
   ```

2. **Guardar logs importantes**
   ```bash
   cp logs/test_20240120_143022.log logs/archived/test_release_v1.0.log
   ```

3. **Limpiar logs regularmente**
   ```bash
   npm run logs:clean  # Cuando sea necesario
   ```

4. **Analizar tendencias**
   ```bash
   grep "Duración:" logs/test_summary_*.txt | tail -10
   ```

5. **Compartir logs de errores**
   ```bash
   cat logs/test_errors_20240120_143022.log | mail -s "Test Failures" team@misionary.com
   ```

## Troubleshooting

### No se generan logs

Verificar que el directorio existe:
```bash
mkdir -p logs
```

### Logs muy grandes

Comprimir logs antiguos:
```bash
gzip logs/test_20240120_*.log
```

### Permisos

Asegurar permisos correctos:
```bash
chmod 755 scripts/test-with-logs.sh
chmod 755 logs/
```

## Ejemplo de Uso Completo

```bash
# 1. Ejecutar tests con logging
npm run test:with-logs auth

# 2. Ver resumen
npm run logs:summary

# 3. Si hay errores, ver detalles
npm run logs:errors

# 4. Ver log completo
npm run logs:latest

# 5. Ver reporte HTML
npm run test:report

# 6. Limpiar logs antiguos (opcional)
npm run logs:clean
```

## Información Adicional

- Los logs se guardan en formato UTF-8
- Los colores se preservan en archivos de log
- Los timestamps usan formato ISO 8601
- Los logs son seguros para compartir (no contienen credenciales)
- Se recomienda revisar logs después de cada ejecución de CI/CD
