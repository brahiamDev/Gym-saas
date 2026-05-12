# AGENTS.md — GymSaaS Platform

> Este archivo es la fuente de verdad para agentes de IA que trabajen en este proyecto. 
> LEER PRIMERO antes de hacer cualquier cambio.

---

## Visión del Proyecto

GymSaaS es una plataforma SaaS multi-tenant para la gestión de gimnasios modernos.
Incluye: gestión de socios, membresías, pagos, rutinas, aforo en tiempo real,
gamificación (puntos, rachas, badges, rankings), check-ins por QR, estadísticas,
notificaciones y dashboards para admin y clientes.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 + Vite + TypeScript (strict mode) |
| Routing | React Router v6 |
| Estado Servidor | TanStack Query (React Query) |
| Estado Cliente | Zustand |
| Forms | React Hook Form + Zod |
| Backend/DB | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Estilos | TailwindCSS v3 |
| UI Components | shadcn/ui (base: slate) |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Testing | Vitest + @testing-library/react + @testing-library/user-event + jsdom |
| Linter | ESLint (flat config) |
| Formatter | Prettier + prettier-plugin-tailwindcss |

---

## Estructura de Carpetas

```
src/
├── app/                    # Entry point, providers globales
│   ├── App.tsx
│   └── providers/
├── routes/                 # Definición de rutas y guards
│   ├── index.tsx
│   ├── ProtectedRoute.tsx
│   └── route-definitions.ts
├── layouts/                # Layouts por rol/contexto
│   ├── RootLayout/
│   ├── AuthLayout/
│   ├── AdminLayout/
│   └── MemberLayout/
├── pages/                  # Páginas de nivel superior (landing, 404)
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   └── NotFound/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── common/             # Componentes compartidos reutilizables
├── features/               # Módulos/feature-based (cada uno autónomo)
│   ├── auth/
│   ├── members/
│   ├── memberships/
│   ├── checkins/
│   ├── workouts/
│   ├── gamification/
│   ├── rankings/
│   ├── notifications/
│   ├── billing/
│   ├── dashboard/
│   └── realtime/
├── services/               # Clientes de API y servicios externos
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── realtime.ts
│   │   └── types.ts
│   └── api/                # APIs custom (si se necesitan)
├── hooks/                  # Hooks globales reutilizables
│   ├── useAuth.ts
│   ├── useRole.ts
│   ├── useRealtime.ts
│   └── useGymContext.ts
├── store/                  # Zustand stores globales
│   ├── index.ts
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── realtimeStore.ts
├── lib/                    # Utilidades core (cn, constants, validators)
│   ├── utils.ts            # cn() helper (clsx + tailwind-merge)
│   ├── constants.ts
│   ├── validators.ts
│   └── supabase.ts         # Re-export del cliente
├── integrations/           # Configuración de servicios externos
│   └── supabase/
│       └── config.ts
├── types/                  # Tipos TypeScript globales
│   ├── index.ts
│   ├── auth.ts
│   ├── role.ts
│   ├── gym.ts
│   ├── member.ts
│   └── api.ts
├── utils/                  # Funciones utilitarias puras
│   ├── formatting.ts
│   ├── dates.ts
│   └── validation.ts
├── styles/                 # Estilos globales y tema
│   ├── globals.css
│   └── theme.css
├── constants/              # Constantes de la aplicación
│   ├── routes.ts
│   ├── roles.ts
│   ├── permissions.ts
│   └── app.ts
├── test/                   # Configuración de tests
│   ├── setup.ts
│   └── vitest.d.ts
└── main.tsx
```

### Regla de cada Feature

Cada feature DEBE tener esta estructura interna:

```
features/{featureName}/
├── components/       # Componentes específicos del feature
├── hooks/            # Hooks específicos del feature
├── services/         # Llamadas a API/Supabase del feature
├── types/            # Tipos específicos del feature
├── schemas/          # Zod schemas del feature
├── pages/            # Páginas del feature
├── store/            # Zustand store del feature (si aplica)
└── utils/            # Utilidades puras del feature
```

**REGLA DE ORO**: Ninguna feature puede importar de otra feature hermana. 
Solo puede importar de: `src/lib/*`, `src/utils/*`, `src/hooks/*`, `src/types/*`, `src/constants/*`, `src/components/common/*`, `src/services/*`, `src/store/*`.

---

## Arquitectura

### 1. Feature-Based Modular
- Cada módulo (feature) es autónomo y autocontenido
- No mezclar lógica de negocio con componentes UI
- Business logic va en `services/` y `hooks/`
- Componentes son "tontos" — reciben props y renderizan

### 2. Separación de Estado

| Tipo de Estado | Herramienta | Ejemplos |
|---------------|-------------|----------|
| Estado del servidor (datos de API) | TanStack Query | usuarios, membresías, pagos, rankings |
| Estado global cliente | Zustand | auth session, UI theme, sidebar, notificaciones toast |
| Estado local de componente | useState | form inputs, modales abiertos, toggles |
| Estado derivado | useMemo / selectors | permisos calculados, filtros, totales |

**NUNCA** duplicar datos del servidor en Zustand. Si los datos vienen de la API,
van en TanStack Query. Punto.

### 3. Multi-Tenant
- Cada tabla en PostgreSQL DEBE tener `gym_id`
- Aislamiento PRIMARIO: Row Level Security (RLS) en Supabase
- Aislamiento SECUNDARIO: filtrado por `gym_id` a nivel aplicación
- Super_admin puede ver todos los gyms; los demás roles solo su gym

### 4. RBAC (Role-Based Access Control)

**Roles** (de mayor a menor jerarquía):
1. `super_admin` — Acceso total a todos los gyms
2. `gym_owner` — Acceso total a su gym
3. `admin` — Gestión completa del gym (sin facturación de sistema)
4. `recepcionista` — Check-ins, búsqueda de socios, pagos
5. `trainer` — Rutinas, asignación de socios, métricas
6. `member` — Perfil, rutinas, progreso, QR, rankings
7. `guest` — Solo vista pública, landing

**Permisos**: Matriz de módulos × acciones (read, write, delete, admin)

### 5. Routing
- `createBrowserRouter` de React Router v6
- Lazy loading para todas las rutas de features
- `ProtectedRoute` verifica auth + role + permission
- Layouts: AdminLayout (sidebar) vs MemberLayout (bottom nav) vs AuthLayout (centrado)

### 6. Realtime
- Supabase Realtime para: aforo, rankings, check-ins, notificaciones, dashboard
- Canales: `gym:{gym_id}:{feature}`
- Presence para "quién está en el gym"

---

## Convenciones de Código

### Naming
- **Componentes**: PascalCase (`LoginForm.tsx`, `MemberCard.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth`, `useMembers`)
- **Servicios**: camelCase con sufijo de acción (`fetchMembers`, `createPayment`)
- **Tipos/Interfaces**: PascalCase (`User`, `Membership`, `AuthState`)
- **Schemas Zod**: camelCase con sufijo `Schema` (`loginSchema`, `memberSchema`)
- **Stores**: camelCase con prefijo `use` + sufijo `Store` (`useAuthStore`)
- **Constantes**: UPPER_SNAKE_CASE (`ROLES`, `PERMISSIONS`, `ROUTES`)

### Imports
- Usar path aliases SIEMPRE
- Orden: React → Librerías externas → Aliases internos → Tipos/constantes
- Ejemplo:
  ```ts
  import { useState } from 'react';
  import { useQuery } from '@tanstack/react-query';
  import { useAuthStore } from '@/store';
  import { cn } from '@/lib/utils';
  import type { Member } from '@/types';
  ```

### TypeScript
- `strict: true` obligatorio
- NO usar `any`. Si no se sabe el tipo, usar `unknown` y hacer narrowing
- Tipar explícitamente los returns de funciones públicas
- Usar `type` para unions/aliases, `interface` para objetos/shapes

### Estilos
- Mobile-first (diseñar mobile, adaptar a desktop)
- Usar Tailwind utilities. NO crear clases CSS custom salvo excepción
- Paleta de colores OBLIGATORIA (ver abajo)
- Dark theme exclusivo
- NO usar valores fijos de width/height que rompan responsive
- NO generar overflow horizontal

---

## Paleta de Colores (OBLIGATORIA)

| Token | Hex | Uso |
|-------|-----|-----|
| Background | `#0F172A` | Fondo de toda la app |
| Surface | `#111827` | Cards, modales, overlays |
| Primary | `#22C55E` | Botones principales, éxito, acciones positivas |
| Secondary | `#06B6D4` | Links secundarios, acentos alternativos |
| Accent | `#A855F7` | Destacados especiales, badges VIP |
| Text | `#F8FAFC` | Texto principal |
| Muted | `#94A3B8` | Texto secundario, placeholders, labels |
| Danger | `#EF4444` | Errores, eliminar, alertas |
| Border | `#1E293B` | Bordes de inputs y cards |

**Tipografía**:
- Headings: `font-display` (Bebas Neue)
- Body: `font-body` (Inter)

---

## Base de Datos (Supabase/PostgreSQL)

### Tablas Principales (pendientes de implementar)

- `gyms` — Información de cada gimnasio tenant
- `users` (auth.users) — Usuarios de autenticación Supabase
- `profiles` — Perfil vinculado a auth.users con gym_id y role
- `members` — Socios/clientes del gym
- `memberships` — Tipos de membresías/planes
- `member_memberships` — Relación socio-membresía (historial)
- `checkins` — Registro de entradas/salidas
- `workouts` — Rutinas de entrenamiento
- `workout_exercises` — Ejercicios dentro de una rutina
- `rankings` — Tablas de posiciones
- `streaks` — Rachas de asistencia
- `notifications` — Notificaciones del sistema
- `payments` — Pagos y facturación
- `badges` — Logros/insignias
- `challenges` — Retos del gym
- `body_metrics` — Métricas físicas (peso, altura, etc.)

### Reglas de DB
- TODAS las tablas tienen `gym_id`
- TODAS tienen `created_at`, `updated_at`
- Soft delete con `deleted_at` (donde aplique)
- Índices en: `gym_id`, `user_id`, `email`, `created_at`
- Foreign keys con `ON DELETE CASCADE` donde tenga sentido
- Triggers para auto-update de `updated_at`
- RLS policies antes de cualquier dato

---

## Testing

### Estrategia
- **Unit tests**: Funciones puras, utilidades, schemas (Vitest)
- **Integration tests**: Hooks, componentes con testing-library
- **E2E tests**: Playwright (futuro — no configurado aún)

### TDD (Strict Mode)
- Escribir test primero (RED)
- Implementar para pasar (GREEN)
- Refactorizar (REFACTOR)
- Cobertura mínima objetivo: 70%

### Comandos
```bash
npm run test        # Vitest en watch mode
npm run test:run    # Vitest una sola vez
npm run test:coverage  # Con cobertura
```

---

## Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

**NUNCA** commitear `.env` — ya está en `.gitignore`.

---

## Comandos Disponibles

```bash
npm run dev         # Servidor de desarrollo (Vite)
npm run build       # Build de producción
npm run preview     # Previsualizar build
npm run test        # Tests en watch mode
npm run test:run    # Tests una vez
npm run lint        # ESLint
npm run format      # Prettier
npx tsc --noEmit    # Chequeo de TypeScript
```

---

## Decisiones Arquitectónicas (ADRs)

### ADR-001: Feature-based Folder Structure
**Decisión**: Usar estructura por features en lugar de por tipo de archivo.
**Razón**: Escalabilidad, claridad de dominio, independencia de módulos.
**Consecuencia**: Reglas estrictas de importación entre features.

### ADR-002: Zustand para Estado Cliente
**Decisión**: Zustand en lugar de Redux/Context para estado global.
**Razón**: Simplicidad, menos boilerplate, persistencia fácil, TypeScript nativo.
**Consecuencia**: No usar Zustand para estado de servidor (eso es TanStack Query).

### ADR-003: Supabase como BaaS
**Decisión**: Supabase en lugar de backend custom.
**Razón**: Auth integrado, PostgreSQL real, RLS, Realtime, Storage. Menos código propio.
**Consecuencia**: Vendor lock-in parcial, pero acelera desarrollo 10x.

### ADR-004: TanStack Query para Server State
**Decisión**: React Query para TODO el estado que viene de API.
**Razón**: Caching, revalidación, optimistic updates, deduping, loading states automáticos.
**Consecuencia**: No usar fetch/axios directamente en componentes.

### ADR-005: RLS como Aislamiento Multi-Tenant
**Decisión**: Row Level Security en PostgreSQL como mecanismo primario de aislamiento.
**Razón**: Seguridad a nivel de base de datos, imposible de bypassear desde frontend.
**Consecuencia**: Las policies deben escribirse antes de cualquier dato.

### ADR-006: Supabase Realtime para Tiempo Real
**Decisión**: Usar Supabase Realtime en lugar de polling o WebSockets custom.
**Razón**: Integrado con PostgreSQL, escala automáticamente, menos infraestructura propia.
**Consecuencia**: Monitorear límites de conexiones, manejar reconexiones.

---

## Flujo de Datos

```
PostgreSQL (Supabase)
    ↓
RLS Policies (filtran por gym_id + role)
    ↓
Supabase Client (src/services/supabase/client.ts)
    ↓
Feature Service (src/features/{x}/services/)
    ↓
Feature Hook (src/features/{x}/hooks/)
    ↓
Componente UI (src/features/{x}/components/)
```

### Reglas
- Los componentes NUNCA llaman a Supabase directamente
- Los componentes NUNCA hacen fetch directamente
- Todo pasa por: Service → Hook → Component

---

## Checklist para Nuevos Features

Antes de implementar un nuevo feature:

- [ ] ¿Está definido en el roadmap?
- [ ] ¿Tiene su carpeta en `src/features/{nombre}/`?
- [ ] ¿Tiene types definidos en `types/` o `features/{x}/types/`?
- [ ] ¿Tiene schemas Zod en `features/{x}/schemas/`?
- [ ] ¿Tiene service en `features/{x}/services/`?
- [ ] ¿Tiene tests para el service?
- [ ] ¿Tiene hook en `features/{x}/hooks/`?
- [ ] ¿Los componentes NO tienen lógica de negocio?
- [ ] ¿Las rutas están definidas en `routes/`?
- [ ] ¿Los permisos están en `constants/permissions.ts`?
- [ ] ¿Las tablas de DB están en migrations?
- [ ] ¿Las RLS policies están definidas?
- [ ] ¿Hay tests de integración para el feature?

---

## Contacto / Contexto

- **Proyecto**: gym-saas
- **Path**: `C:\Users\Brahiam\Documents\Code\gym-saas`
- **Stack**: React + Vite + TypeScript + Tailwind + Supabase
- **Iniciado**: Mayo 2026
- **Modo de trabajo**: SDD (Spec-Driven Development) con TDD estricto

---

> Última actualización: 2026-05-09
> Si modificás este archivo, actualizá la fecha.
