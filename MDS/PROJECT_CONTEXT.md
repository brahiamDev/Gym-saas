# PROJECT_CONTEXT.md — GymSaaS

> Documento maestro de contexto del proyecto.
> Contiene TODO lo necesario para entender el estado, arquitectura, decisiones y próximos pasos.
> 
> **Última actualización**: 2026-05-11
> **Sprint actual**: Fundación + Auth + Dashboards completados

---

## 📋 Índice

1. [Visión del Proyecto](#visión-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Estado Actual](#estado-actual)
6. [Decisiones Arquitectónicas Clave](#decisiones-arquitectónicas-clave)
7. [Base de Datos](#base-de-datos)
8. [Sistema de Roles](#sistema-de-roles)
9. [Autenticación](#autenticación)
10. [Dashboards Implementados](#dashboards-implementados)
11. [Configuración de Supabase](#configuración-de-supabase)
12. [Problemas Conocidos](#problemas-conocidos)
13. [Próximos Pasos Inmediatos](#próximos-pasos-inmediatos)
14. [Comandos Útiles](#comandos-útiles)
15. [Variables de Entorno](#variables-de-entorno)

---

## 1. Visión del Proyecto

**GymSaaS** es una plataforma SaaS multi-tenant para la gestión de gimnasios modernos. Incluye: gestión de socios, membresías, pagos, rutinas, aforo en tiempo real, gamificación (puntos, rachas, badges, rankings), check-ins por QR, estadísticas, notificaciones y dashboards para admin y clientes.

### Usuarios objetivo
- **Dueños de gimnasios** — Quieren administrar su negocio
- **Recepcionistas** — Check-ins, cobros, búsqueda de socios
- **Entrenadores** — Rutinas, asignación de socios
- **Socios/Clientes** — Perfil, QR, rutinas, gamificación

### Diferenciadores clave
- QR check-in con control de aforo en tiempo real
- Gamificación para retención de clientes
- Multi-gym (un sistema, múltiples gimnasios)

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión | Estado |
|------|-----------|---------|--------|
| Framework | React | 19 | ✅ |
| Build Tool | Vite | 8 | ✅ |
| Language | TypeScript | 5.x (strict) | ✅ |
| Routing | React Router | v6 | ✅ |
| Estado Servidor | TanStack Query (React Query) | v5 | ✅ |
| Estado Cliente | Zustand | v5 | ✅ |
| Forms | React Hook Form + Zod | Latest | ✅ |
| Backend/DB | Supabase | Latest | ✅ |
| DB Engine | PostgreSQL | 15+ | ✅ |
| Estilos | TailwindCSS | v3 | ✅ |
| UI Base | shadcn/ui | v2 (slate) | ✅ |
| Animaciones | Framer Motion | v11 | ✅ |
| Iconos | Lucide React | Latest | ✅ |
| Testing | Vitest + Testing Library | Latest | ✅ |
| Linter | ESLint (flat config) | v9 | ✅ |
| Formatter | Prettier | v3 | ✅ |

### Dependencias principales instaladas
```
react react-dom
react-router-dom
@tanstack/react-query
zustand
react-hook-form @hookform/resolvers zod
@supabase/supabase-js
framer-motion
lucide-react
tailwindcss postcss autoprefixer
clsx tailwind-merge
vitest @testing-library/react @testing-library/user-event jsdom
```

---

## 3. Arquitectura

### Feature-Based Modular
- Cada módulo es autónomo en `src/features/{nombre}/`
- Business logic en `services/` y `hooks/`, NO en componentes
- Componentes son "tontos" — reciben props y renderizan

### Separación de Estado

| Tipo de Estado | Herramienta | Ejemplos |
|---------------|-------------|----------|
| Servidor (API) | TanStack Query | usuarios, membresías, pagos |
| Cliente global | Zustand | auth session, UI theme, sidebar |
| Local | useState | form inputs, modales, toggles |
| Derivado | useMemo | permisos calculados, filtros |

**REGLA DE ORO**: NUNCA duplicar datos del servidor en Zustand.

### Multi-Tenant
- Cada tabla tiene `gym_id`
- Aislamiento primario: Row Level Security (RLS) en Supabase
- Aislamiento secundario: filtrado por `gym_id` en app
- `super_admin` removido — roles simplificados a 6

### Flujo de Datos
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

---

## 4. Estructura de Carpetas

```
src/
├── app/                    # Entry point, providers
│   ├── App.tsx
│   └── providers/
├── routes/                 # Definición de rutas
│   ├── index.tsx
│   ├── ProtectedRoute.tsx
│   └── route-definitions.ts
├── layouts/                # Layouts por rol
│   ├── RootLayout/
│   ├── AuthLayout/
│   ├── AdminLayout/
│   └── MemberLayout/
├── pages/                  # Páginas de nivel superior
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Dashboard/
│   └── NotFound/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── common/             # Componentes compartidos
├── features/               # 12 features (vacíos, listos para implementar)
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
├── services/               # Clientes de API
│   └── supabase/
│       ├── client.ts
│       ├── authService.ts
│       ├── realtime.ts
│       └── types.ts
├── hooks/                  # Hooks globales
│   ├── useAuth.ts
│   ├── useRole.ts
│   ├── useRealtime.ts
│   └── useGymContext.ts
├── store/                  # Zustand stores
│   ├── index.ts
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── realtimeStore.ts
├── lib/                    # Utilidades core
│   ├── utils.ts            # cn() helper
│   ├── constants.ts
│   └── validators.ts
├── integrations/           # Configuración de servicios
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
├── styles/                 # Estilos globales
│   ├── globals.css
│   └── theme.css
├── constants/              # Constantes
│   ├── routes.ts
│   ├── roles.ts
│   ├── permissions.ts
│   └── app.ts
└── main.tsx
```

---

## 5. Estado Actual

### ✅ Completado (Fases 0-3)

#### Fase 0: Fundación
- [x] Proyecto scaffolded con Vite + React + TypeScript
- [x] TailwindCSS configurado con paleta fitness-tech
- [x] Path aliases configurados
- [x] Dependencias instaladas (React Query, Zustand, Framer Motion, etc.)
- [x] ESLint + Prettier configurados
- [x] Vitest + Testing Library configurados
- [x] Estructura de carpetas creada

#### Fase 1: Auth + RBAC
- [x] Supabase conectado (cliente singleton con timeouts)
- [x] Tablas SQL creadas (gyms, profiles, members, memberships, checkins, payments)
- [x] Auth funcional (login, register, logout)
- [x] Registro con login automático después
- [x] Zustand authStore (user, profile, session)
- [x] Hook useAuth con restore session
- [x] RLS policies funcionando
- [x] Landing page con diseño premium
- [x] Login y Register pages con diseño profesional

#### Fase 2: Database
- [x] 6 tablas core creadas con RLS
- [x] 13 índices creados
- [x] 6 triggers auto-update
- [x] Soft delete implementado
- [x] Enum de roles simplificado (eliminado super_admin)

#### Fase 3: Dashboards
- [x] Dashboard Admin completo (KPIs, gráficas CSS, tabla de socios, accesos rápidos)
- [x] Dashboard Recepcionista (aforo, QR, búsqueda, lista de socios)
- [x] Dashboard Member (perfil, QR, gamificación, rutinas, métricas)
- [x] Responsive (mobile-first)
- [x] Animaciones con Framer Motion

### ⬜ Pendiente (Fases 4-15)

**Prioridad ALTA**:
- Members CRUD (Fase 4)
- Memberships (Fase 5)
- Check-in QR real (Fase 6)

**Prioridad MEDIA**:
- Gamificación (Fase 7)
- Workouts (Fase 8)
- Billing (Fase 9)

**Prioridad BAJA**:
- Notificaciones (Fase 10)
- Realtime (Fase 11)
- Métricas físicas (Fase 12)
- Configuración (Fase 13)
- Testing (Fase 14)
- Deploy (Fase 15)

---

## 6. Decisiones Arquitectónicas Clave

### ADR-001: Feature-based Folder Structure
- **Decisión**: Estructura por features en lugar de por tipo de archivo
- **Razón**: Escalabilidad, claridad de dominio, independencia de módulos

### ADR-002: Zustand para Estado Cliente
- **Decisión**: Zustand en lugar de Redux/Context
- **Razón**: Simplicidad, menos boilerplate, TypeScript nativo

### ADR-003: Supabase como BaaS
- **Decisión**: Supabase en lugar de backend custom
- **Razón**: Auth integrado, PostgreSQL real, RLS, Realtime

### ADR-004: TanStack Query para Server State
- **Decisión**: React Query para TODO el estado de API
- **Razón**: Caching, revalidación, optimistic updates

### ADR-005: RLS como Aislamiento Multi-Tenant
- **Decisión**: Row Level Security como mecanismo primario
- **Razón**: Seguridad a nivel de base de datos, imposible de bypass

### ADR-006: Supabase Realtime para Tiempo Real
- **Decisión**: Supabase Realtime en lugar de polling
- **Razón**: Integrado con PostgreSQL, escala automáticamente

### ADR-007: Roles simplificados (sin super_admin)
- **Decisión**: Eliminar super_admin del enum
- **Razón**: Reducir complejidad. Admin (gym_owner) tiene control total de su gym
- **Fecha**: 2026-05-11

---

## 7. Base de Datos

### Tablas Creadas ✅

| Tabla | Descripción | RLS |
|-------|-------------|-----|
| `gyms` | Gimnasios/tenants | ✅ |
| `profiles` | Perfiles de usuarios (vinculados a auth.users) | ✅ |
| `members` | Socios/clientes del gym | ✅ |
| `memberships` | Planes de membresía | ✅ |
| `member_memberships` | Relación socio-membresía (historial) | ✅ |
| `checkins` | Registro de entradas/salidas | ✅ |
| `payments` | Pagos y facturación | ✅ |

### Tablas Pendientes ⬜
- `workouts` — Rutinas
- `workout_exercises` — Ejercicios dentro de rutina
- `rankings` — Tablas de posiciones
- `streaks` — Rachas de asistencia
- `notifications` — Notificaciones del sistema
- `badges` — Logros/insignias
- `user_badges` — Relación usuario-badge
- `challenges` — Retos del gym
- `challenge_participants` — Progreso en retos
- `body_metrics` — Métricas físicas

### Enums
```sql
app_role: gym_owner, admin, recepcionista, trainer, member, guest
member_status: active, inactive, suspended
membership_status: active, expired, cancelled, pending
payment_status: paid, pending, overdue
checkin_method: qr, manual, nfc
```

### Migraciones SQL
1. `001_initial_schema.sql` — Tablas iniciales + RLS
2. `002_fix_auth_trigger.sql` — Fix trigger de auth
3. `003_fix_profiles_rls_recursion.sql` — Fix recursión RLS
4. `004_simplify_roles.sql` — Eliminar super_admin (falló)
5. `005_fix_roles_final.sql` — Fix final de roles (con drop de policies)

---

## 8. Sistema de Roles

### Roles Actuales

| Rol | Jerarquía | Permisos |
|-----|-----------|----------|
| `gym_owner` | 1 (máximo) | Todo en su gym: socios, pagos, configuración, staff |
| `admin` | 2 | Gestión operativa del gym (sin facturación de sistema) |
| `recepcionista` | 3 | Check-ins, búsqueda de socios, cobros |
| `trainer` | 4 | Rutinas, asignación de socios, métricas |
| `member` | 5 | Perfil, rutinas, progreso, QR, rankings (default al registrar) |
| `guest` | 6 | Solo landing page |

### Flujo de Asignación de Roles
1. **Registro** → Siempre crea `member`
2. **Admin asigna roles** → Desde Supabase SQL Editor:
   ```sql
   UPDATE public.profiles SET role = 'recepcionista' WHERE id = 'UUID';
   ```
3. **Dashboard dinámico** → Según `profile.role`

### Jerarquía de Permisos (en código)
```typescript
const ROLE_HIERARCHY = [
  'gym_owner',    // 0 - Todo
  'admin',        // 1 - Gestión
  'recepcionista',// 2 - Recepción
  'trainer',      // 3 - Entrenamiento
  'member',       // 4 - Socio
  'guest',        // 5 - Visitante
];
```

---

## 9. Autenticación

### Flujo de Login
1. Usuario ingresa email + password
2. `signIn()` → Supabase Auth
3. Obtiene user + session
4. `getProfile(user.id)` → Busca en `public.profiles`
5. `setAuth(user, session, profile)` → Zustand store
6. Redirige a `/dashboard`

### Flujo de Registro
1. Usuario completa formulario (nombre, email, password)
2. `signUp()` → Crea en `auth.users`
3. `signIn()` automático → Establece sesión
4. `createProfile()` → Inserta en `public.profiles` con role='member'
5. `setAuth()` → Zustand store
6. Redirige a `/dashboard`

### Session Restoration
- Al cargar la app, `RootLayout` llama `restoreSession()`
- Obtiene sesión de Supabase
- Si hay sesión, carga perfil y setea auth
- Si no hay sesión, `clearAuth()`

### RLS Policies de Profiles
```sql
-- SELECT propio
Profiles: usuarios ven su propio perfil (id = auth.uid())

-- INSERT propio
Profiles: usuarios crean su propio perfil (id = auth.uid())

-- UPDATE propio
Profiles: usuarios actualizan su propio perfil (id = auth.uid())
```

---

## 10. Dashboards Implementados

### Admin Dashboard (`gym_owner` / `admin`)
**KPIs**:
- Socios Activos (con tendencia %)
- Ingresos del Mes
- Aforo Actual / Capacidad
- Membresías por Vencer

**Gráficas CSS** (sin librerías externas):
- Ingresos últimos 6 meses (barras verticales animadas)
- Socios nuevos vs inactivos (barras comparativas)
- Distribución por plan (donut con conic-gradient)

**Tabla de Socios**:
- Columnas: Nombre, Email, Plan, Estado, Último Check-in, Acciones
- Búsqueda en tiempo real
- Filtros: Todos, Activos, Inactivos, Por Vencer
- 5-6 filas de datos mock

**Accesos Rápidos**:
- Nuevo Socio, Registrar Pago, Crear Plan, Ver Reportes, Configurar Gym, Gestionar Staff

**Feed de Actividad**:
- Check-ins recientes, pagos, nuevos registros

### Recepcionista Dashboard
**Header**:
- Fecha/hora actual
- Nombre del gym
- Aforo counter (grande)

**Acciones Principales**:
- Check-in QR (botón grande verde)
- Buscar Socio (con búsqueda)
- Registrar Pago

**Lista de Socios**:
- Código QR, Nombre, Plan, Estado, Última Visita
- Filtros: En el gym, Todos, Membresía vencida
- Acciones por fila: Check-in manual, Ver perfil

**Aforo en Tiempo Real**:
- Contador grande con progress bar animado
- Lista de "Actualmente en el gym" con horarios de entrada

### Member Dashboard (Cliente)
**Perfil Hero**:
- Avatar (iniciales)
- Nombre y "miembro desde"
- Badge de estado de membresía
- Nombre del plan actual

**Stats**:
- Puntos acumulados
- Racha actual (días)
- Check-ins este mes
- Días restantes de membresía

**Mi QR**:
- QR grande (grid pattern determinista)
- Texto: "Mostrá este código en recepción"
- Botón de descarga

**Gamificación**:
- Grid de 6 badges (locked/unlocked)
- Posición en leaderboard
- Progress bar para siguiente badge

**Mis Rutinas**:
- Tarjeta de rutina actual
- Último entrenamiento
- Gráfica de progreso (barras de últimos 7 días)

**Métricas Físicas**:
- Peso, altura, IMC
- Historial de peso (sparkline SVG)
- Botón "Actualizar medidas"

---

## 11. Configuración de Supabase

### URL del Proyecto
```
https://gyabykhekzriazduahyt.supabase.co
```

### Credenciales (en `.env`)
```env
VITE_SUPABASE_URL=https://gyabykhekzriazduahyt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Config Auth
- **Email provider**: ✅ Habilitado
- **Confirm email**: ❌ Deshabilitado (para login automático después de registro)
- **Secure email change**: ✅ Habilitado
- **Password reset**: ✅ Habilitado

### Config Realtime (preparado, no activo)
- Canales configurados en `src/services/supabase/realtime.ts`
- Pooling por gym
- Sin conexiones activas aún

---

## 12. Problemas Conocidos

### ✅ Resueltos
| Problema | Causa | Solución |
|----------|-------|----------|
| Error `border-border` no existe | Tailwind no tenía color `border` | Agregado a tailwind.config.js |
| `removeChild` en StrictMode | React StrictMode doble render | Eliminado StrictMode de main.tsx |
| Auth no conectaba | Falta `.supabase` en URL | Reiniciar Vite + corregir .env |
| "Database error saving new user" | Trigger `handle_new_user` fallaba | Eliminar trigger, crear perfil manualmente desde frontend |
| "Infinite recursion" en RLS | Policies consultaban misma tabla | Simplificar policies (solo auth.uid()) |
| "Cannot coerce 0 rows" | Perfil no existía | Cambiar `.single()` a `.maybeSingle()` |
| Registro se quedaba colgado | `signIn` después de `signUp` sin timeout | Agregar timeouts (10-15s) a todas las llamadas |
| `Crown is not defined` | Icono no importado de lucide-react | Agregar `Crown` al import |

### ⬜ Pendientes / Técnicos
| Problema | Impacto | Notas |
|----------|---------|-------|
| Build bundle 705KB | Performance | Usar lazy loading para features grandes |
| No hay tests | Calidad | Necesario implementar suite de tests |
| Datos mock en dashboard | Funcionalidad | Conectar a tablas reales cuando haya CRUDs |
| No hay error tracking | Debugging | Integrar Sentry en producción |
| No hay analytics | Métricas | Integrar PostHog o similar |

---

## 13. Próximos Pasos Inmediatos

### Sprint Siguiente (Recomendado)

**1. Members CRUD (Fase 4)**
- [ ] Crear tabla `members` con datos reales
- [ ] Service: fetchMembers con filtros
- [ ] Service: createMember
- [ ] Service: updateMember
- [ ] Service: deleteMember (soft)
- [ ] Hook: useMembers con TanStack Query
- [ ] Componente: MemberList con tabla real
- [ ] Componente: MemberForm (crear/editar)
- [ ] Página: MembersPage

**2. Memberships (Fase 5)**
- [ ] CRUD de planes de membresía
- [ ] Asignar membresía a socio
- [ ] Renovar membresía
- [ ] Alertas de vencimiento

**3. Check-in QR Real (Fase 6)**
- [ ] Generar QR único por socio
- [ ] Scanner de QR con cámara
- [ ] Validar membresía activa al check-in
- [ ] Control de aforo en tiempo real
- [ ] Historial de check-ins

### Después
**4. Gamificación (Fase 7)**
- Sistema de puntos
- Rachas (streaks)
- Badges
- Leaderboard

**5. Workouts (Fase 8)**
- CRUD de rutinas
- Biblioteca de ejercicios
- Asignar rutina a socio

---

## 14. Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor Vite (localhost:5173)

# Build
npm run build            # Build de producción
npm run preview          # Previsualizar build

# Testing
npm run test             # Vitest watch mode
npm run test:run         # Vitest una sola vez
npm run test:coverage    # Con cobertura

# Calidad de código
npm run lint             # ESLint
npm run format           # Prettier
npx tsc --noEmit         # Chequeo TypeScript

# Supabase
npx supabase login       # Login CLI
npx supabase gen types typescript --project-id "PROJECT_ID" --schema public > src/services/supabase/database.types.ts
```

---

## 15. Variables de Entorno

### `.env` (NO commitear — ya está en .gitignore)
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### `.env.example` (SÍ commitear)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Variables de Vite
Todas las variables deben empezar con `VITE_` para ser expuestas al cliente.

---

## 📎 Referencias

- **AGENTS.md**: `C:\Users\Brahiam\Documents\Code\gym-saas\AGENTS.md`
- **ROADMAP.md**: `C:\Users\Brahiam\Documents\Code\gym-saas\MDS\ROADMAP.md`
- **SQL Migrations**: `C:\Users\Brahiam\Documents\Code\gym-saas\supabase\migrations\`
- **Supabase Dashboard**: https://supabase.com/dashboard/project/gyabykhekzriazduahyt

---

> **Nota**: Este documento es la fuente de verdad del proyecto. 
> Actualizar después de cada sesión significativa.
> Si algo no está claro, revisar AGENTS.md primero.

---

**Autor**: Brahiam Raigoza Cortes
**Proyecto**: GymSaaS
**Inicio**: Mayo 2026
**Versión del documento**: 1.0
**Última actualización**: 2026-05-11
