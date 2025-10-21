# 📋 CONTEXTO TÉCNICO COMPLETO: MISIONARY ERP FRONTEND

## 1. INFORMACIÓN GENERAL DEL SISTEMA

**Nombre:** MISIONARY CRM/ERP - Frontend  
**Propósito:** Interfaz web moderna para la gestión integral de clientes, presupuestos, facturación, productos, servicios y finanzas.

**Ubicación del proyecto:** `/home/guido/workspace/misionary/frontend`

---

## 2. STACK TECNOLÓGICO

**Frontend:**
- **Framework:** React 19.0.0
- **Build Tool:** Vite 6.x (Fast HMR, ES Modules)
- **Lenguaje:** TypeScript 5.7
- **Estilos:** TailwindCSS v4 (con @tailwindcss/postcss)
- **Routing:** React Router DOM 6.26
- **Estado Global:** Redux Toolkit 2.5 + Redux Persist
- **Formularios:** 
  - React Hook Form 7.59
  - Formik 2.4 (legacy)
  - Validación: Yup 1.6 + Zod 3.25
- **HTTP Client:** Axios 1.7
- **Internacionalización:** i18next 24.2 + react-i18next 15.2
- **Animaciones:** Framer Motion 11.18
- **UI Components:** 
  - React Icons
  - React Select
  - React Quill (editor de texto)
  - React Syntax Highlighter
  - ApexCharts (gráficos)
  - FullCalendar (calendario)
  - @tanstack/react-table (tablas avanzadas)

**Desarrollo:**
- **Linter:** ESLint 8 + TypeScript ESLint
- **Formatter:** Prettier 3
- **Mock API:** MirageJS 0.1.48 (desarrollo)

**Deployment:**
- **Producción:** Railway / Custom Server
- **URL Producción:** `https://ad.misionary.com`
- **Puerto Desarrollo:** 5173
- **Backend API:** `http://localhost:3001/api` (local)

---

## 3. ARQUITECTURA DEL FRONTEND

**Patrón arquitectónico:** Feature-based Architecture + Smart/Dumb Components

```
frontend/
├── src/
│   ├── @types/              # Definiciones TypeScript personalizadas
│   │   ├── auth.ts          # Tipos de autenticación
│   │   └── ...
│   ├── assets/              # Recursos estáticos (imágenes, SVGs)
│   ├── components/          # Componentes reutilizables
│   │   ├── layouts/         # Layouts de aplicación (Modern, Classic, etc.)
│   │   ├── route/           # Componentes de routing protegido
│   │   │   ├── AppRoute.tsx
│   │   │   ├── AuthorityGuard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── PublicRoute.tsx
│   │   ├── shared/          # Componentes compartidos (Cards, Headers, etc.)
│   │   ├── template/        # Templates de página (Headers, Sidebars, etc.)
│   │   └── ui/              # Componentes UI básicos (Button, Input, Modal, etc.)
│   ├── configs/             # Configuraciones centralizadas
│   │   ├── app.config.ts    # Configuración general de la app
│   │   ├── navigation.config/ # Configuración del menú de navegación
│   │   ├── routes.config.tsx  # Definición de rutas
│   │   └── theme.config.ts    # Configuración del tema (dark mode, colores)
│   ├── constants/           # Constantes de la aplicación
│   │   └── route.constant.ts # Constantes de rutas
│   ├── contexts/            # React Contexts
│   │   └── AuthContext.tsx  # Contexto de autenticación global
│   ├── hooks/               # Custom hooks reutilizables
│   │   └── useAuthority.ts  # Hook de verificación de roles
│   ├── locales/             # Archivos de traducción (i18n)
│   │   ├── en.json
│   │   └── es.json
│   ├── mock/                # Mock API con MirageJS (desarrollo)
│   ├── modules/             # Módulos/Features de negocio
│   ├── services/            # Capa de servicios (API calls)
│   │   ├── ApiService.ts    # Servicio genérico de API
│   │   ├── BaseService.ts   # Configuración de Axios
│   │   ├── AuthService.ts   # Servicio de autenticación
│   │   ├── empresaService.ts
│   │   ├── finanzasService.ts
│   │   └── reciboService.ts
│   ├── store/               # Redux Store
│   │   ├── slices/          # Redux slices
│   │   │   ├── auth/        # Slice de autenticación
│   │   │   ├── locale/      # Slice de idioma
│   │   │   ├── theme/       # Slice de tema (dark/light)
│   │   │   └── base/        # Slice base
│   │   ├── rootReducer.ts   # Combinador de reducers
│   │   ├── storeSetup.ts    # Configuración del store
│   │   └── hook.ts          # Hooks tipados del store
│   ├── utils/               # Utilidades y helpers
│   │   └── hooks/           # Hooks de utilidad
│   │       └── useAuthority.ts
│   ├── views/               # Vistas/Páginas de la aplicación
│   │   ├── auth/            # Vistas de autenticación
│   │   │   ├── SignIn.tsx
│   │   │   ├── LoginView.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── AcceptInvite.tsx
│   │   │   └── CompleteProviderRegistration.tsx
│   │   ├── clientes/        # Gestión de clientes
│   │   ├── empresas/        # Gestión de empresas
│   │   ├── presupuestos/    # Gestión de presupuestos
│   │   │   ├── PresupuestosView.tsx
│   │   │   ├── PresupuestoNew.tsx
│   │   │   ├── PresupuestoEdit.tsx
│   │   │   └── PresupuestoView.tsx
│   │   ├── productos/       # Gestión de productos
│   │   ├── servicios/       # Gestión de servicios
│   │   ├── impuestos/       # Gestión de impuestos
│   │   ├── finanzas/        # Módulo de finanzas
│   │   │   ├── FinanzasList.tsx
│   │   │   └── FinanzasResumen.tsx
│   │   ├── gastos/          # Gastos operativos
│   │   ├── recibos/         # Recibos y pagos
│   │   ├── rentabilidad/    # Análisis de rentabilidad
│   │   ├── dashboard/       # Dashboard principal
│   │   │   └── PresupuestoAnalytics.tsx
│   │   └── personas/        # Gestión de personas (multirole)
│   │       ├── PersonasView.tsx
│   │       ├── PersonaTypeSelector.tsx
│   │       ├── ClienteNew.tsx
│   │       ├── ClienteConEmpresaNew.tsx
│   │       ├── ProveedorNew.tsx
│   │       ├── InternoNew.tsx
│   │       └── PersonaEdit.tsx
│   ├── App.tsx              # Componente raíz de la aplicación
│   ├── main.tsx             # Punto de entrada (render de React)
│   └── index.css            # Estilos globales (Tailwind)
├── public/                  # Archivos públicos estáticos
├── .env                     # Variables de entorno
├── vite.config.ts           # Configuración de Vite
├── tailwind.config.cjs      # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── package.json
```

---

## 4. FLUJO DE ARQUITECTURA

**User Flow:**

```
Usuario interactúa con UI
    ↓
Componente React (View)
    ↓
Hook personalizado / Context (useAuth, usePermission)
    ↓
Service (AuthService, ApiService)
    ↓
Axios → HTTP Request
    ↓
Backend API (Express + Prisma)
    ↓
PostgreSQL
    ↓
Response JSON
    ↓
Redux Store / Context State Update
    ↓
Re-render del componente
```

**Flujo de Autenticación:**

```
1. Usuario ingresa credenciales en /sign-in
2. Componente llama a AuthService.login()
3. AuthService hace POST a /api/auth/login
4. Backend valida y devuelve { user, token }
5. AuthService guarda en localStorage
6. AuthContext actualiza estado global
7. Usuario es redirigido a /home (ProtectedRoute)
```

---

## 5. SISTEMA DE AUTENTICACIÓN

### 5.1. AuthContext (`contexts/AuthContext.tsx`)

**Estado de autenticación:**
```typescript
interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: number;
        email: string;
        nombre: string;
        tipo: string;  // 'CLIENTE' | 'PROVEEDOR' | 'INTERNO'
        roles: string[];  // ['ADMIN', 'CONTADOR', 'PROVEEDOR']
    } | null;
    token: string | null;
}
```

**Hook de uso:**
```typescript
const { isAuthenticated, user, signIn, signOut, loading } = useAuth();

// Ejemplo de uso
if (user?.roles.includes('ADMIN')) {
  // Lógica exclusiva para admins
}
```

### 5.2. AuthService (`services/AuthService.ts`)

**Métodos principales:**

```typescript
class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse>
  
  // Register
  static async register(data: RegisterCredentials): Promise<AuthResponse>
  
  // Logout
  static async logout(): Promise<void>
  
  // Validar token de invitación
  static async validateInviteToken(token: string): Promise<{ valid: boolean }>
  
  // Aceptar invitación
  static async acceptInviteToken(data: AcceptInviteData): Promise<AuthResponse>
  
  // Helpers
  static getStoredToken(): string | null
  static getStoredUser(): AuthResponse['user'] | null
  static getAuthState(): AuthState
  static clearAuthData(): void
}
```

**Almacenamiento:**
- Token: `localStorage.getItem('auth_token')`
- Usuario: `localStorage.getItem('auth_user')`

### 5.3. Componentes de Protección de Rutas

**ProtectedRoute** (`components/route/ProtectedRoute.tsx`):
```typescript
// Protege rutas privadas, redirige a /sign-in si no autenticado
<ProtectedRoute>
  <DashboardView />
</ProtectedRoute>
```

**PublicRoute** (`components/route/PublicRoute.tsx`):
```typescript
// Rutas públicas, redirige a /home si ya está autenticado
<PublicRoute>
  <SignInPage />
</PublicRoute>
```

**AuthorityGuard** (`components/route/AuthorityGuard.tsx`):
```typescript
// Protege componentes según roles específicos
<AuthorityGuard 
  userAuthority={user?.roles || []} 
  authority={['ADMIN', 'CONTADOR']}
>
  <FinanzasModule />
</AuthorityGuard>
```

### 5.4. Hook de Autoridad

**useAuthority** (`utils/hooks/useAuthority.ts`):
```typescript
const roleMatched = useAuthority(
  userRoles,      // Roles del usuario actual
  allowedRoles    // Roles permitidos para esta acción
);

// Retorna true si el usuario tiene al menos uno de los roles permitidos
```

---

## 6. ROUTING Y NAVEGACIÓN

### 6.1. Configuración de Rutas (`configs/routes.config.tsx`)

**Rutas Públicas:**
- `/sign-in` - Login
- `/login` - Login (legacy)
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Resetear contraseña
- `/sign-up` - Registro
- `/accept-invite` - Aceptar invitación
- `/complete-provider-registration` - Completar registro de proveedor

**Rutas Protegidas:**

| Módulo | Ruta | Vista |
|--------|------|-------|
| **Dashboard** | `/home` | Home |
| **Personas** | `/personas` | PersonasView |
| | `/personas/new` | PersonaTypeSelector |
| | `/personas/cliente/new` | ClienteConEmpresaNew |
| | `/personas/proveedor/new` | ProveedorNew |
| | `/personas/interno/new` | InternoNew |
| | `/personas/edit/:id` | PersonaEdit |
| **Productos** | `/productos` | ProductosView |
| | `/productos/new` | ProductoNew |
| | `/productos/edit/:id` | ProductoEdit |
| **Servicios** | `/servicios` | ServiciosView |
| | `/servicios/new` | ServicioNew |
| | `/servicios/edit/:id` | ServicioEdit |
| **Presupuestos** | `/presupuestos` | PresupuestosView |
| | `/presupuestos/new` | PresupuestoNew |
| | `/presupuestos/edit/:id` | PresupuestoEdit |
| | `/presupuestos/view/:id` | PresupuestoView |
| **Empresas** | `/empresas` | EmpresasView |
| | `/empresas/new` | EmpresaNew |
| | `/empresas/edit/:id` | EmpresaEdit |
| **Finanzas** | `/finanzas` | FinanzasList |
| | `/finanzas/:id` | FinanzasResumen |
| **Impuestos** | `/impuestos` | ImpuestosView |
| | `/impuestos/nuevo` | ImpuestoNew |
| | `/impuestos/editar/:id` | ImpuestoEdit |
| **Gastos** | `/gastos` | GastosView |
| | `/gastos/new` | GastoNew |
| | `/gastos/rentabilidad` | RentabilidadMain |
| **Recibos** | `/recibos` | RecibosView |
| | `/recibos/new` | ReciboNew |
| **Otros** | `/monedas` | MonedaView |
| | `/historial-precios` | HistorialPrecioView |
| | `/dashboard/analytics` | PresupuestoAnalytics |

### 6.2. Navegación Lateral

La configuración del menú lateral se encuentra en `configs/navigation.config/`.

**Estructura sugerida (a implementar por UI_ACCESS_AGENT):**

```typescript
interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  roles: string[];  // Roles con acceso
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', href: '/home', roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'] },
  { label: 'Clientes', href: '/personas', roles: ['ADMIN', 'CONTADOR'] },
  { label: 'Presupuestos', href: '/presupuestos', roles: ['ADMIN', 'CONTADOR'] },
  { label: 'Productos', href: '/productos', roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'] },
  { label: 'Servicios', href: '/servicios', roles: ['ADMIN', 'CONTADOR', 'PROVEEDOR'] },
  { label: 'Finanzas', href: '/finanzas', roles: ['ADMIN'] },
  { label: 'Configuración', href: '/config', roles: ['ADMIN'] },
];
```

---

## 7. ESTADO GLOBAL (REDUX STORE)

### 7.1. Estructura del Store

**Root Reducer** (`store/rootReducer.ts`):
```typescript
const rootReducer = combineReducers({
  auth: authReducer,         // Estado de autenticación
  locale: localeReducer,     // Idioma actual (es/en)
  theme: themeReducer,       // Tema (dark/light) y configuraciones visuales
  base: baseReducer,         // Estado base de la aplicación
});
```

**Persistencia:**
- Se usa `redux-persist` para mantener el estado en `localStorage`
- Persiste: `auth`, `locale`, `theme`

### 7.2. Slices Principales

**auth** (`store/slices/auth/`):
- Maneja el estado de autenticación (token, usuario, roles)
- Sincronizado con AuthContext

**locale** (`store/slices/locale/`):
- Idioma actual de la aplicación
- Opciones: `es` (español), `en` (inglés)

**theme** (`store/slices/theme/`):
- Modo oscuro/claro
- Configuración de colores personalizados
- Layout (modern, classic, stacked)

---

## 8. SERVICIOS Y API

### 8.1. BaseService (`services/BaseService.ts`)

**Configuración de Axios:**
```typescript
const BaseService = axios.create({
  baseURL: 'http://localhost:3001/api',  // URL del backend
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token a cada request
BaseService.interceptors.request.use((config) => {
  const token = AuthService.getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
BaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      AuthService.clearAuthData();
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);
```

### 8.2. ApiService (`services/ApiService.ts`)

**Wrapper genérico para llamadas HTTP:**
```typescript
const ApiService = {
  fetchData<Response, Request>(param: AxiosRequestConfig<Request>) {
    return new Promise<AxiosResponse<Response>>((resolve, reject) => {
      BaseService(param)
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }
};
```

**Uso:**
```typescript
const response = await ApiService.fetchData<Presupuesto[]>({
  url: '/presupuestos',
  method: 'get',
});
```

### 8.3. Servicios Específicos

**finanzasService.ts:**
- `getFinanzasResumen(presupuestoId)`: Resumen financiero de un presupuesto
- `getKPIs()`: KPIs generales del sistema

**empresaService.ts:**
- `getEmpresas()`: Listar empresas
- `createEmpresa(data)`: Crear empresa

**reciboService.ts:**
- `getRecibos()`: Listar recibos
- `createRecibo(data)`: Crear recibo de pago

---

## 9. FORMULARIOS Y VALIDACIÓN

### 9.1. React Hook Form

**Patrón de uso:**
```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  nombre: yup.string().required('Nombre es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required(),
});

export function SignInForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await AuthService.login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### 9.2. Validación con Zod

**Alternativa TypeScript-first:**
```typescript
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const presupuestoSchema = z.object({
  clienteId: z.number().positive('Cliente es requerido'),
  total: z.number().min(0, 'Total debe ser positivo'),
  estado: z.enum(['BORRADOR', 'ENVIADO', 'APROBADO', 'FACTURADO']),
  items: z.array(z.object({
    productoId: z.number().optional(),
    servicioId: z.number().optional(),
    cantidad: z.number().positive(),
    precioUnitario: z.number().positive(),
  })).min(1, 'Debe incluir al menos un ítem'),
});

type PresupuestoFormData = z.infer<typeof presupuestoSchema>;
```

---

## 10. ESTILOS Y TAILWIND CSS

### 10.1. Configuración de Tailwind (`tailwind.config.cjs`)

**Versión:** Tailwind CSS v4 (con @tailwindcss/postcss)

**Características:**
- Dark mode habilitado (`class` strategy)
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Custom colors definidos en theme
- Typography plugin para contenido de texto enriquecido

**Uso de clases:**
```tsx
<div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Título
  </h1>
  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
    Acción
  </Button>
</div>
```

### 10.2. Modo Oscuro

**Activación:**
- Se controla desde `store/slices/theme/`
- Agrega/quita clase `dark` del elemento `<html>`

**Implementación:**
```typescript
// En ThemeProvider o Layout
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
```

**Estilos condicionales:**
```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

---

## 11. INTERNACIONALIZACIÓN (i18n)

### 11.1. Configuración

**Archivos de traducción:** `src/locales/`
- `en.json` - Inglés
- `es.json` - Español

**Uso:**
```typescript
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('es')}>
        Español
      </button>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

**Archivo de traducción:**
```json
{
  "welcome": "Bienvenido a Misionary ERP",
  "presupuestos": {
    "title": "Presupuestos",
    "create": "Crear Presupuesto",
    "edit": "Editar Presupuesto"
  }
}
```

---

## 12. COMPONENTES UI REUTILIZABLES

### 12.1. Librería de Componentes (`components/ui/`)

**Componentes básicos:**
- `Button`: Botón con variantes (primary, secondary, danger, etc.)
- `Input`: Input de texto con validación
- `Select`: Dropdown con react-select
- `Modal`: Modal/Dialog reutilizable
- `Card`: Contenedor con shadow y border
- `Table`: Tabla con @tanstack/react-table
- `DatePicker`: Selector de fechas
- `Toast`: Notificaciones (success, error, info, warning)

**Ejemplo de uso:**
```tsx
import { Button, Input, Modal } from '@/components/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
  Crear Presupuesto
</Button>

<Input 
  type="email" 
  placeholder="Email" 
  error={errors.email?.message}
/>

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Confirmar acción</h2>
  <p>¿Estás seguro?</p>
  <Button onClick={handleConfirm}>Sí</Button>
  <Button variant="secondary" onClick={() => setIsOpen(false)}>
    Cancelar
  </Button>
</Modal>
```

### 12.2. Componentes Template (`components/template/`)

**Layouts:**
- `Header`: Barra superior con logo, navegación y usuario
- `Sidebar`: Menú lateral con navegación
- `Footer`: Pie de página
- `ModernLayout`: Layout moderno con sidebar colapsable
- `ClassicLayout`: Layout clásico con top navigation

---

## 13. ROLES Y PERMISOS

### 13.1. Roles del Sistema

**Según el backend:**

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `ADMIN` | Administrador total | Todos los módulos, todas las acciones |
| `CONTADOR` | Contador/Gestor financiero | Presupuestos, Facturas, Clientes, Productos, Servicios |
| `PROVEEDOR` | Proveedor externo | Solo sus productos/servicios y presupuestos relacionados |

**Nota:** El frontend actualmente usa roles legacy (`ADMIN`, `USER`, `MANAGER`) que deben ser migrados.

### 13.2. Matriz de Permisos

**Presupuestos:**
| Acción | ADMIN | CONTADOR | PROVEEDOR |
|--------|-------|----------|-----------|
| Ver | ✅ | ✅ | ✅ (solo incluidos) |
| Crear | ✅ | ✅ | ❌ |
| Editar (BORRADOR) | ✅ | ✅ | ❌ |
| Editar (ENVIADO) | ✅ | ❌ | ❌ |
| Editar (APROBADO) | ✅ | ❌ | ❌ |
| Editar (FACTURADO) | ❌ | ❌ | ❌ |
| Eliminar | ✅ | ❌ | ❌ |
| Cambiar estado | ✅ | ✅ | ❌ |

**Productos/Servicios:**
| Acción | ADMIN | CONTADOR | PROVEEDOR |
|--------|-------|----------|-----------|
| Ver todos | ✅ | ✅ | ❌ |
| Ver propios | ✅ | ✅ | ✅ |
| Crear | ✅ | ✅ | ✅ |
| Editar propios | ✅ | ✅ | ✅ |
| Editar otros | ✅ | ✅ | ❌ |
| Eliminar | ✅ | ✅ | ❌ |

**Finanzas:**
| Acción | ADMIN | CONTADOR | PROVEEDOR |
|--------|-------|----------|-----------|
| Ver resumen completo | ✅ | ❌ | ❌ |
| Ver reportes básicos | ✅ | ✅ | ❌ |
| Crear pago a admin | ✅ | ❌ | ❌ |
| Crear pago a proveedor | ✅ | ✅ | ❌ |

**Configuración:**
| Acción | ADMIN | CONTADOR | PROVEEDOR |
|--------|-------|----------|-----------|
| Gestionar impuestos | ✅ | ❌ | ❌ |
| Gestionar monedas | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Invitar proveedores | ✅ | ✅ | ❌ |

---

## 14. REGLAS DE NEGOCIO FRONTEND

### 14.1. Presupuestos

**Estados y transiciones:**
```
BORRADOR → ENVIADO → APROBADO → FACTURADO
```

**Validaciones:**
- Un presupuesto debe tener al menos 1 ítem
- El total debe ser > 0
- Solo ADMIN puede editar presupuestos ENVIADOS o APROBADOS
- Presupuestos FACTURADOS son de solo lectura

**UI/UX:**
- Botón "Editar" visible solo si el usuario tiene permisos
- Botón "Eliminar" visible solo para ADMIN
- Campos deshabilitados si el presupuesto está FACTURADO
- Cambio de estado solo mediante botones específicos (no edición directa)

### 14.2. Productos y Servicios

**Validaciones:**
- Precio debe ser > 0
- Margen de agencia entre 0% y 100%
- Costo proveedor <= precio final
- Proveedor debe estar activo

**Filtrado:**
- Proveedores solo ven sus propios productos/servicios
- ADMIN y CONTADOR ven todos

### 14.3. Finanzas

**Restricciones:**
- Solo ADMIN puede ver ganancia de la empresa y pagos a admins
- No se puede pagar a admin más de la ganancia disponible
- Todos los montos deben estar en la misma moneda o convertirse

---

## 15. PATRONES DE DISEÑO Y MEJORES PRÁCTICAS

### 15.1. Componentes Smart/Dumb

**Smart Components (Containers):**
- Manejan lógica de negocio
- Conectados a Redux o Contexts
- Hacen llamadas a servicios/API
- Ejemplo: `PresupuestosView.tsx`

**Dumb Components (Presentational):**
- Solo reciben props
- Sin lógica de negocio
- Reutilizables y testeables
- Ejemplo: `PresupuestoCard.tsx`

```tsx
// Smart Component
export function PresupuestosView() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  
  useEffect(() => {
    fetchPresupuestos().then(setPresupuestos);
  }, []);

  return <PresupuestoList items={presupuestos} />;
}

// Dumb Component
interface Props {
  items: Presupuesto[];
}

export function PresupuestoList({ items }: Props) {
  return (
    <div>
      {items.map(p => (
        <PresupuestoCard key={p.id} presupuesto={p} />
      ))}
    </div>
  );
}
```

### 15.2. Custom Hooks

**Patrones comunes:**
- `useFetch`: Para llamadas HTTP reutilizables
- `usePermission`: Verificar permisos según rol
- `useForm`: Abstracción de react-hook-form

```typescript
// Hook personalizado de fetching
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ApiService.fetchData({ url })
      .then(res => setData(res.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Uso
const { data: presupuestos, loading } = useFetch<Presupuesto[]>('/presupuestos');
```

### 15.3. Error Handling

**Manejo de errores HTTP:**
```typescript
try {
  await ApiService.fetchData({
    url: '/presupuestos',
    method: 'post',
    data: presupuestoData,
  });
  
  toast.success('Presupuesto creado exitosamente');
  navigate('/presupuestos');
  
} catch (error) {
  if (error.response?.status === 400) {
    toast.error('Datos inválidos');
  } else if (error.response?.status === 403) {
    toast.error('No tienes permisos para esta acción');
  } else if (error.response?.status === 401) {
    // Ya manejado por interceptor (redirige a /sign-in)
  } else {
    toast.error('Error al crear presupuesto');
  }
}
```

### 15.4. Performance Optimization

**Lazy Loading de rutas:**
```typescript
const PresupuestosView = lazy(() => import('@/views/presupuestos/PresupuestosView'));

// En el router
<Route 
  path="/presupuestos" 
  element={
    <Suspense fallback={<Spinner />}>
      <PresupuestosView />
    </Suspense>
  } 
/>
```

**Memoización:**
```typescript
import { useMemo, useCallback } from 'react';

const expensiveCalculation = useMemo(() => {
  return presupuestos.reduce((acc, p) => acc + p.total, 0);
}, [presupuestos]);

const handleDelete = useCallback((id: number) => {
  deletePresupuesto(id);
}, []);
```

---

## 16. TESTING (Recomendaciones)

### 16.1. Herramientas Sugeridas

- **Vitest:** Testing framework (compatible con Vite)
- **React Testing Library:** Testing de componentes
- **MSW (Mock Service Worker):** Mock de API en tests

### 16.2. Ejemplo de Test

```typescript
import { render, screen } from '@testing-library/react';
import { PresupuestoCard } from './PresupuestoCard';

describe('PresupuestoCard', () => {
  it('renderiza correctamente', () => {
    const presupuesto = {
      id: 1,
      cliente: { nombre: 'Cliente Test' },
      total: 1000,
      estado: 'BORRADOR',
    };

    render(<PresupuestoCard presupuesto={presupuesto} />);

    expect(screen.getByText('Cliente Test')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
  });
});
```

---

## 17. VARIABLES DE ENTORNO

**Archivo:** `frontend/.env`

```bash
# API Backend
VITE_API_BASE_URL=http://localhost:3001/api

# Producción
VITE_API_BASE_URL_PROD=https://api.misionary.com

# Mock API (desarrollo)
VITE_ENABLE_MOCK=false

# i18n
VITE_DEFAULT_LOCALE=es

# Otros
VITE_APP_NAME=Misionary ERP
VITE_APP_VERSION=2.3.0
```

**Uso:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 18. COMANDOS ÚTILES

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo (puerto 5173)
npm run start            # Alias de dev

# Build
npm run build            # Compila para producción
npm run preview          # Preview del build de producción

# Linting y Formateo
npm run lint             # Ejecuta ESLint
npm run lint:fix         # Ejecuta ESLint y arregla automáticamente
npm run prettier         # Verifica formato con Prettier
npm run prettier:fix     # Formatea código con Prettier
npm run format           # Ejecuta prettier:fix + lint:fix
```

---

## 19. DESPLIEGUE

### 19.1. Build de Producción

```bash
npm run build
```

**Output:** `dist/`

**Archivos generados:**
- HTML, CSS, JS optimizados
- Código minificado y comprimido
- Assets con hash para cache-busting

### 19.2. Deployment en Railway (u otro hosting)

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 20. INSTRUCCIONES PARA EL AGENTE IA

Como agente especializado en el frontend de Misionary, debes:

1. **Comprender el dominio:** Estudiar la estructura de componentes, el flujo de autenticación, las rutas protegidas y el sistema de roles.

2. **Mantener la arquitectura:** Respetar la separación Smart/Dumb components, usar hooks personalizados, seguir los patrones de carpetas.

3. **Seguir los patrones existentes:** Usar React Hook Form para formularios, Tailwind para estilos, lazy loading para rutas, etc.

4. **Validar siempre:** Verificar permisos según roles, validar datos de entrada con Yup/Zod, manejar errores correctamente.

5. **Documentar cambios:** Comentar código cuando introduzcas lógica compleja o reglas de negocio.

6. **Optimizar rendimiento:** Usar `useMemo`, `useCallback`, lazy loading, code splitting.

7. **Mantener accesibilidad:** Usar HTML semántico, atributos ARIA cuando sea necesario, diseño responsive.

8. **Gestionar modo oscuro:** Siempre incluir clases `dark:` de Tailwind para soportar dark mode.

9. **Respetar reglas de negocio:**
   - Presupuestos FACTURADOS son inmutables
   - Proveedores solo ven sus propios productos
   - Solo ADMIN puede ver finanzas completas

10. **Producir código limpio:** TypeScript bien tipado, nombres descriptivos, componentes pequeños y cohesivos.

---

## 21. EJEMPLO DE FEATURE COMPLETA

**Caso:** Crear vista de lista de presupuestos con permisos según rol.

**1. Servicio** (`services/presupuestoService.ts`):
```typescript
import ApiService from './ApiService';
import type { Presupuesto } from '@/@types/presupuesto';

export const presupuestoService = {
  async getAll(filters?: { estado?: string; clienteId?: number }) {
    const response = await ApiService.fetchData<Presupuesto[]>({
      url: '/presupuestos',
      method: 'get',
      params: filters,
    });
    return response.data;
  },

  async getById(id: number) {
    const response = await ApiService.fetchData<Presupuesto>({
      url: `/presupuestos/${id}`,
      method: 'get',
    });
    return response.data;
  },

  async create(data: Partial<Presupuesto>) {
    const response = await ApiService.fetchData<Presupuesto>({
      url: '/presupuestos',
      method: 'post',
      data,
    });
    return response.data;
  },

  async update(id: number, data: Partial<Presupuesto>) {
    const response = await ApiService.fetchData<Presupuesto>({
      url: `/presupuestos/${id}`,
      method: 'put',
      data,
    });
    return response.data;
  },

  async delete(id: number) {
    await ApiService.fetchData({
      url: `/presupuestos/${id}`,
      method: 'delete',
    });
  },
};
```

**2. Hook de Permisos** (`hooks/usePresupuestoPermissions.ts`):
```typescript
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { Presupuesto } from '@/@types/presupuesto';

export function usePresupuestoPermissions(presupuesto?: Presupuesto) {
  const { user } = useAuth();
  const userRoles = user?.roles || [];

  const permissions = useMemo(() => {
    const isAdmin = userRoles.includes('ADMIN');
    const isContador = userRoles.includes('CONTADOR');

    const canView = userRoles.some(r => ['ADMIN', 'CONTADOR', 'PROVEEDOR'].includes(r));
    const canCreate = isAdmin || isContador;
    const canDelete = isAdmin;
    
    let canEdit = false;
    if (presupuesto) {
      if (presupuesto.estado === 'FACTURADO') {
        canEdit = false;
      } else if (presupuesto.estado === 'ENVIADO' || presupuesto.estado === 'APROBADO') {
        canEdit = isAdmin;
      } else {
        canEdit = isAdmin || isContador;
      }
    } else {
      canEdit = isAdmin || isContador;
    }

    const canChangeState = isAdmin || isContador;

    return {
      canView,
      canCreate,
      canEdit,
      canDelete,
      canChangeState,
    };
  }, [userRoles, presupuesto]);

  return permissions;
}
```

**3. Componente de Lista** (`views/presupuestos/PresupuestosView.tsx`):
```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { presupuestoService } from '@/services/presupuestoService';
import { usePresupuestoPermissions } from '@/hooks/usePresupuestoPermissions';
import { Button } from '@/components/ui';
import type { Presupuesto } from '@/@types/presupuesto';

export function PresupuestosView() {
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const permissions = usePresupuestoPermissions();

  useEffect(() => {
    loadPresupuestos();
  }, []);

  const loadPresupuestos = async () => {
    try {
      const data = await presupuestoService.getAll();
      setPresupuestos(data);
    } catch (error) {
      console.error('Error loading presupuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar presupuesto?')) return;
    
    try {
      await presupuestoService.delete(id);
      loadPresupuestos();
    } catch (error) {
      console.error('Error deleting presupuesto:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Presupuestos
        </h1>
        
        {permissions.canCreate && (
          <Button 
            onClick={() => navigate('/presupuestos/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Crear Presupuesto
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {presupuestos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">{p.cliente.nombre}</td>
                <td className="px-6 py-4">${p.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    p.estado === 'FACTURADO' ? 'bg-green-100 text-green-800' :
                    p.estado === 'APROBADO' ? 'bg-blue-100 text-blue-800' :
                    p.estado === 'ENVIADO' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/presupuestos/view/${p.id}`)}
                  >
                    Ver
                  </Button>
                  
                  {permissions.canEdit && p.estado !== 'FACTURADO' && (
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/presupuestos/edit/${p.id}`)}
                    >
                      Editar
                    </Button>
                  )}
                  
                  {permissions.canDelete && (
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## ✅ RESUMEN FINAL

Ahora posees el contexto completo del frontend de **Misionary ERP**:

- **Stack:** React 19 + Vite + TypeScript + TailwindCSS v4 + Redux Toolkit
- **Arquitectura:** Feature-based + Smart/Dumb Components
- **Autenticación:** AuthContext + JWT + localStorage
- **Routing:** React Router con rutas públicas y protegidas
- **Permisos:** Sistema basado en roles (ADMIN, CONTADOR, PROVEEDOR)
- **Formularios:** React Hook Form + Yup/Zod
- **Estilos:** Tailwind con dark mode
- **Internacionalización:** i18next (es/en)
- **Estado Global:** Redux con persistencia
- **API:** Axios con interceptors para auth y errores

Estás listo para **analizar, diseñar, implementar y optimizar features frontend complejas** en el ecosistema de Misionary.
