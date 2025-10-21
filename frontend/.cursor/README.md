# 📚 DOCUMENTACIÓN DE AGENTES IA - MISIONARY FRONTEND

## Bienvenido

Este directorio contiene la documentación completa y los prompts especializados para agentes IA que trabajen en el **frontend del sistema Misionary ERP/CRM**.

---

## 📁 Contenido de este Directorio

### 1. `frontend.md` - Contexto Técnico Completo
**Propósito:** Documento de referencia con toda la arquitectura, stack tecnológico, flujos y patrones del frontend.

**Incluye:**
- Stack tecnológico (React 19, Vite, TailwindCSS v4, Redux, etc.)
- Arquitectura completa del proyecto
- Sistema de autenticación y rutas protegidas
- Configuración de routing y navegación
- Estado global con Redux
- Servicios y API (Axios, interceptors)
- Formularios y validación
- Estilos y Tailwind CSS
- Internacionalización (i18n)
- Roles y permisos
- Reglas de negocio
- Patrones de diseño y mejores prácticas
- Ejemplos de implementación completos

**Cuándo leerlo:**
- Al comenzar a trabajar en cualquier feature del frontend
- Para entender la estructura general del proyecto
- Como referencia de patrones y convenciones
- Antes de proponer cambios arquitectónicos

---

### 2. `ui-access-agent.md` - Agente Especializado en Control de Permisos UI
**Propósito:** Prompt completo para un subagente especializado en **control de visibilidad y permisos visuales** basado en roles.

**Incluye:**
- Definición del rol del agente
- Contexto técnico del sistema de permisos
- Responsabilidades del agente
- Ejemplos de implementación de:
  - Hooks de permisos (`usePermission`, `useRoleGuard`)
  - Componentes declarativos (`<Permission>`, `<RestrictedButton>`)
  - Filtrado de menús por rol
  - Protección de rutas y acciones
- Migración de roles legacy a nuevos roles
- Patrones y antipatrones
- Checklist de implementación
- Casos de uso reales

**Cuándo usarlo:**
- Al implementar control de acceso visual en componentes
- Para crear o modificar el sistema de permisos
- Al proteger rutas o acciones según roles
- Para auditar permisos existentes
- Al migrar del sistema de roles legacy

---

### 3. `MATRIZ_PERMISOS_RUTAS.md` - Tabla Completa de Permisos ⭐
**Propósito:** Tabla visual detallada de qué roles tienen acceso a cada ruta del sistema.

**Incluye:**
- Tabla completa de 33 rutas con permisos por rol
- Leyenda de símbolos (✅ ❌ ✅* ✅**)
- Resumen detallado por rol (ADMIN, CONTADOR, PROVEEDOR)
- Reglas de negocio especiales (presupuestos por estado, filtrado)
- Guía de implementación técnica
- Ejemplos de código

**Cuándo usarlo:**
- Para verificar qué rol tiene acceso a qué ruta
- Al diseñar nuevas features y determinar permisos
- Como referencia al implementar protección de rutas
- Para documentar decisiones de permisos

---

### 4. `RESUMEN_PERMISOS.md` - Resumen Ejecutivo ⭐
**Propósito:** Vista general del sistema de permisos con estadísticas y comparativas.

**Incluye:**
- Vista rápida por rol con todos los módulos
- Tabla comparativa de acceso por módulo
- Decisiones clave de diseño
- Resumen de navegación por rol (ítems de menú)
- Archivos generados y su propósito
- Próximos pasos de implementación
- Estadísticas de acceso (rutas totales por rol)

**Cuándo usarlo:**
- Para entender el sistema de permisos completo
- Al presentar el sistema a stakeholders
- Como referencia rápida de decisiones de diseño
- Para planificar nuevas features

---

### 5. `GUIA_IMPLEMENTACION.md` - Guía Paso a Paso ⭐
**Propósito:** Checklist detallado para implementar el sistema de permisos desde cero.

**Incluye:**
- 10 pasos de implementación con código completo
- Actualización de tipos de autenticación
- Creación del hook `usePermission`
- Componente `ProtectedRouteWithRoles`
- Filtrado de navegación lateral
- Página `/access-denied`
- Migración de roles legacy
- Checklist de pruebas por rol
- Script de validación final

**Cuándo usarlo:**
- Al implementar el sistema de permisos por primera vez
- Como guía de referencia durante la implementación
- Para verificar que no se omitieron pasos
- Al capacitar a nuevos desarrolladores

---

### 6. `VISTA_RAPIDA_PERMISOS.md` - Referencia Rápida
**Propósito:** Resumen ultra-condensado para consulta rápida en 30 segundos.

**Incluye:**
- Resumen visual en 30 segundos
- Tabla ultra-resumida (6 módulos × 3 roles)
- 3 reglas de oro del sistema
- Archivos clave con ubicaciones
- Ejemplos de uso rápido (código)
- Checklist básico de implementación

**Cuándo usarlo:**
- Para consulta rápida de permisos
- Como recordatorio de reglas principales
- Al revisar código de permisos
- Para onboarding rápido de desarrolladores

---

## 🎯 Roles del Sistema

El sistema Misionary maneja tres roles principales:

| Rol | Descripción | Acceso Principal |
|-----|-------------|------------------|
| **ADMIN** | Administrador completo | Todos los módulos, todas las acciones |
| **CONTADOR** | Gestor contable/financiero | Presupuestos, Facturas, Clientes, Productos, Reportes |
| **PROVEEDOR** | Proveedor externo | Solo sus productos/servicios y presupuestos relacionados |

---

## 🚀 Inicio Rápido para Agentes

### Si eres un agente general de frontend:
1. Lee `frontend.md` primero para entender la arquitectura completa
2. Identifica el módulo en el que trabajarás
3. Revisa los ejemplos de implementación relevantes
4. Sigue los patrones establecidos

### Si eres el agente de control de permisos UI:
1. Lee `ui-access-agent.md` para entender tu rol específico
2. Consulta `frontend.md` sección "Roles y Permisos" para contexto
3. Analiza el código existente de permisos
4. Propone mejoras o implementa nuevas reglas según el prompt

### Si necesitas implementar una feature nueva:
1. Lee el contexto general en `frontend.md`
2. Verifica si la feature requiere control de permisos
3. Si requiere permisos, consulta `ui-access-agent.md` para implementación
4. Sigue los patrones de la sección "Ejemplo de Feature Completa" en `frontend.md`

---

## 🔑 Conceptos Clave

### Arquitectura del Frontend
```
Views (Smart Components)
    ↓
Hooks (useAuth, usePermission, useFetch)
    ↓
Services (ApiService, AuthService)
    ↓
Axios → Backend API
```

### Flujo de Autenticación
```
Login → AuthService → Backend → Token + User
    ↓
localStorage + AuthContext
    ↓
ProtectedRoute verifica auth
    ↓
App muestra contenido protegido
```

### Sistema de Permisos
```
Usuario tiene roles → ['ADMIN', 'CONTADOR']
    ↓
Hook usePermission verifica rol
    ↓
Componente muestra/oculta según permisos
    ↓
Backend valida permisos en API (seguridad real)
```

---

## 📋 Checklist para Nuevas Features

- [ ] ¿La feature requiere autenticación? → Usar `<ProtectedRoute>`
- [ ] ¿La feature tiene restricciones por rol? → Usar `usePermission` hook
- [ ] ¿Hay formularios? → Usar React Hook Form + Yup/Zod
- [ ] ¿Hay llamadas a API? → Crear servicio en `/services`
- [ ] ¿Se necesita estado global? → Crear slice en Redux
- [ ] ¿Hay estilos? → Usar Tailwind CSS con dark mode
- [ ] ¿Componente reutilizable? → Colocar en `/components/shared` o `/components/ui`
- [ ] ¿Vista completa? → Colocar en `/views/{modulo}`
- [ ] ¿Necesita traducción? → Agregar keys en `/locales/es.json` y `/locales/en.json`
- [ ] ¿Es lazy loadeable? → Agregar en `routes.config.tsx` con `lazy()`

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Linting
npm run lint             # Verifica errores
npm run lint:fix         # Corrige errores automáticamente

# Formateo
npm run prettier         # Verifica formato
npm run format           # Formatea y corrige

# Build
npm run build            # Compila para producción
npm run preview          # Preview del build
```

---

## 🔗 Relación con el Backend

El frontend se comunica con el backend en:
- **URL Local:** `http://localhost:3001/api`
- **URL Producción:** `https://api.misionary.com`

**Endpoints principales:**
- `/auth/login` - Autenticación
- `/auth/invite/*` - Sistema de invitaciones
- `/presupuestos` - CRUD de presupuestos
- `/personas` - CRUD de personas (clientes, proveedores, internos)
- `/productos` - CRUD de productos
- `/servicios` - CRUD de servicios
- `/finanzas/*` - Módulo financiero
- `/empresas` - CRUD de empresas
- `/impuestos` - CRUD de impuestos

Ver documentación completa del backend en `/backend/.cursor/backend.md`

---

## 📖 Convenciones de Código

### Nomenclatura
- **Componentes:** PascalCase (`PresupuestoCard.tsx`)
- **Hooks:** camelCase con prefijo `use` (`usePermission.ts`)
- **Servicios:** camelCase con sufijo `Service` (`authService.ts`)
- **Tipos:** PascalCase (`interface AuthState`)
- **Constantes:** UPPER_SNAKE_CASE (`const API_BASE_URL`)

### Estructura de Archivos
```
ComponentName/
├── ComponentName.tsx      # Componente principal
├── ComponentName.test.tsx # Tests
├── ComponentName.types.ts # Tipos específicos
└── index.ts               # Barrel export
```

### Imports
```typescript
// Orden de imports
import { useState } from 'react';              // 1. Librerías externas
import { useNavigate } from 'react-router-dom'; // 2. Routing
import { useAuth } from '@/contexts/AuthContext'; // 3. Contexts/Hooks internos
import { Button } from '@/components/ui';      // 4. Componentes internos
import { presupuestoService } from '@/services'; // 5. Servicios
import type { Presupuesto } from '@/@types';  // 6. Tipos
import './styles.css';                         // 7. Estilos (si los hay)
```

---

## 🎨 Estilos y Tema

### Dark Mode
Todos los componentes deben soportar dark mode usando clases de Tailwind:

```tsx
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

### Colores Principales
- **Primary:** Blue 600 (`bg-blue-600`)
- **Success:** Green 600 (`bg-green-600`)
- **Warning:** Yellow 600 (`bg-yellow-600`)
- **Danger:** Red 600 (`bg-red-600`)
- **Gray Scale:** Gray 50-900

### Responsive
- **Mobile First:** Diseñar primero para móvil
- **Breakpoints:** `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

---

## 🔒 Seguridad

### Principios Importantes

1. **La UI NO es seguridad:**
   - Ocultar un botón no impide que un usuario avanzado llame a la API
   - El backend SIEMPRE debe validar permisos

2. **Token en localStorage:**
   - El token JWT está accesible en el navegador
   - Nunca exponer lógica sensible en el cliente
   - La validación real ocurre en el backend

3. **Manejo de errores 401/403:**
   - 401 (Unauthorized): Token inválido o expirado → Redirigir a login
   - 403 (Forbidden): Sin permisos → Mostrar mensaje de error

4. **Validación de entrada:**
   - Validar TODOS los formularios con Yup o Zod
   - Sanitizar entradas antes de enviar al backend
   - No confiar en datos del usuario

---

## 📞 Contacto y Soporte

**Documentación del Backend:**
- Archivo: `/backend/.cursor/backend.md`
- Agente: MISIONARY_BACKEND_AGENT

**Repositorio:**
- Path: `/home/guido/workspace/misionary`

**Ambiente de Desarrollo:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Database: PostgreSQL en puerto 5459

---

## 🧩 Subagentes Especializados

### 1. MISIONARY_UI_ACCESS_AGENT
**Especialidad:** Control de visibilidad y permisos UI  
**Archivo:** `ui-access-agent.md`  
**Responsabilidades:**
- Implementar sistema de permisos visuales
- Crear hooks de autorización
- Proteger componentes según roles
- Filtrar menús y navegación
- Migrar roles legacy

### 2. MISIONARY_FRONTEND_STRATEGIST (Propuesto)
**Especialidad:** Arquitectura y decisiones técnicas del frontend  
**Responsabilidades:**
- Proponer mejoras arquitectónicas
- Evaluar nuevas tecnologías
- Optimizar rendimiento
- Diseñar patrones reutilizables

### 3. MISIONARY_UX_AGENT (Propuesto)
**Especialidad:** Experiencia de usuario y diseño  
**Responsabilidades:**
- Mejorar flujos de navegación
- Diseñar componentes intuitivos
- Garantizar accesibilidad
- Optimizar UX móvil

---

## 📝 Notas Importantes

### Migración de Roles Pendiente
El frontend usa roles legacy (`ADMIN`, `USER`, `MANAGER`) que deben migrarse a:
- `ADMIN`
- `CONTADOR`
- `PROVEEDOR`

**Ver:** Sección "Migración de Roles Legacy" en `ui-access-agent.md`

### Estado del Proyecto
- **Versión:** 2.3.0
- **Estado:** En desarrollo activo
- **Ambiente:** Desarrollo local + Railway (producción)

### Próximas Features
- Sistema de notificaciones en tiempo real
- Dashboard con métricas avanzadas
- Exportación de reportes (PDF/Excel)
- Calendario de eventos y tareas
- Chat interno

---

## ✅ Resumen

Estos documentos te proporcionan:
1. **Contexto completo** del frontend de Misionary
2. **Guías específicas** para control de permisos UI
3. **Patrones y mejores prácticas** establecidos
4. **Ejemplos de implementación** reales
5. **Checklist y referencias** rápidas

**Recuerda:**
- Siempre leer la documentación relevante antes de empezar
- Seguir los patrones existentes
- Priorizar seguridad (backend valida, frontend mejora UX)
- Mantener compatibilidad con dark mode
- Escribir código TypeScript bien tipado
- Documentar decisiones importantes

---

**Última actualización:** Octubre 2025  
**Mantenido por:** Equipo de desarrollo Misionary

