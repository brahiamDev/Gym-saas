# Roadmap GymSaaS 🚀

> Estado actual y plan de trabajo para completar la plataforma.
> Última actualización: 2026-05-09

---

## Leyenda

| Estado | Emoji | Significado |
|--------|-------|-------------|
| Completado | ✅ | Implementado y funcionando |
| En progreso | 🔄 | En desarrollo actual |
| Pendiente | ⬜ | Por hacer |
| Bloqueado | 🚫 | Depende de otro módulo |

---

## Fase 0: Fundación (Infraestructura)

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 0.1 | Inicializar proyecto con Vite + React + TypeScript | ✅ | Completo |
| 0.2 | Configurar TailwindCSS con paleta de colores custom | ✅ | Paleta fitness-tech implementada |
| 0.3 | Configurar path aliases (tsconfig + vite) | ✅ | @/*, @/features/*, etc. |
| 0.4 | Instalar y configurar shadcn/ui | ✅ | Base: slate, CSS variables listas |
| 0.5 | Instalar dependencias core (Zustand, TanStack Query, RHF, Zod, Framer Motion, etc.) | ✅ | Todas instaladas |
| 0.6 | Configurar ESLint + Prettier | ✅ | Flat config |
| 0.7 | Configurar Vitest + Testing Library | ✅ | jsdom, globals activos |
| 0.8 | Crear estructura de carpetas (features, layouts, routes, etc.) | ✅ | 12 features con 8 subcarpetas cada uno |
| 0.9 | Configurar cliente Supabase | ✅ | Cliente singleton en services/supabase/client.ts |
| 0.10 | Crear archivo .env.example | ✅ | Variables de Supabase listas |
| 0.11 | Crear AGENTS.md y ROADMAP.md | ✅ | Este documento + AGENTS.md |

---

## Fase 1: Autenticación y Autorización (Auth + RBAC)

> **Prioridad**: CRÍTICA — Todo depende de esto.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 1.1 | Diseñar schema SQL: gyms, users, profiles | ⬜ | Incluye soft delete, timestamps, triggers |
| 1.2 | Crear enum de roles (super_admin → guest) | ⬜ | 7 roles con jerarquía |
| 1.3 | Implementar matriz de permisos | ⬜ | Por módulo × acción × rol |
| 1.4 | Implementar utilidades de permisos (hasPermission, canAccess) | ⬜ | Con tests unitarios |
| 1.5 | Implementar servicio de auth (signIn, signUp, signOut) | ⬜ | Integración con Supabase Auth |
| 1.6 | Implementar authStore (Zustand) | ⬜ | User, profile, session, selectores |
| 1.7 | Implementar hook useAuth | ⬜ | Con TanStack Query para profile |
| 1.8 | Implementar hook useRole | ⬜ | Derivado del profile |
| 1.9 | Crear schemas Zod (login, register, forgotPassword) | ⬜ | Validación frontend |
| 1.10 | Crear componente LoginForm | ⬜ | React Hook Form + Zod |
| 1.11 | Crear componente RegisterForm | ⬜ | Con indicador de fuerza de password |
| 1.12 | Crear página LoginPage | ⬜ | Diseño profesional con AuthLayout |
| 1.13 | Crear página RegisterPage | ⬜ | Diseño profesional con AuthLayout |
| 1.14 | Implementar ProtectedRoute | ⬜ | Guards por auth + role + permission |
| 1.15 | Configurar rutas con lazy loading | ⬜ | AdminLayout vs MemberLayout |
| 1.16 | Implementar RLS policies en SQL | ⬜ | Isolación por gym_id |
| 1.17 | Tests: servicios de auth | ⬜ | Mock de Supabase |
| 1.18 | Tests: utilidades de permisos | ⬜ | 20+ casos |
| 1.19 | Tests: LoginForm (integración) | ⬜ | Render, submit, validación |

---

## Fase 2: Base de Datos y Modelo de Datos

> **Prioridad**: CRÍTICA — Antes de CRUDs.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 2.1 | Diseñar tabla `gyms` | ⬜ | Con settings JSONB, logo, etc. |
| 2.2 | Diseñar tabla `members` | ⬜ | Datos personales, estado, QR code |
| 2.3 | Diseñar tabla `memberships` | ⬜ | Planes: nombre, precio, duración, beneficios |
| 2.4 | Diseñar tabla `member_memberships` | ⬜ | Relación histórica socio-plan |
| 2.5 | Diseñar tabla `checkins` | ⬜ | Entrada/salida, timestamp, método (QR, manual) |
| 2.6 | Diseñar tabla `workouts` | ⬜ | Rutinas predefinidas y personalizadas |
| 2.7 | Diseñar tabla `workout_exercises` | ⬜ | Ejercicios con sets, reps, peso |
| 2.8 | Diseñar tabla `rankings` | ⬜ | Tablas de posiciones por categoría |
| 2.9 | Diseñar tabla `streaks` | ⬜ | Rachas de asistencia consecutiva |
| 2.10 | Diseñar tabla `notifications` | ⬜ | Tipo, mensaje, leído, timestamp |
| 2.11 | Diseñar tabla `payments` | ⬜ | Monto, método, estado, facturación |
| 2.12 | Diseñar tabla `badges` | ⬜ | Definición de logros |
| 2.13 | Diseñar tabla `user_badges` | ⬜ | Relación usuario-logro |
| 2.14 | Diseñar tabla `challenges` | ⬜ | Retos del gym |
| 2.15 | Diseñar tabla `challenge_participants` | ⬜ | Progreso en retos |
| 2.16 | Diseñar tabla `body_metrics` | ⬜ | Peso, altura, % grasa, etc. |
| 2.17 | Crear índices optimizados | ⬜ | gym_id, user_id, created_at, estado |
| 2.18 | Crear triggers updated_at | ⬜ | Automático en todas las tablas |
| 2.19 | Implementar soft delete | ⬜ | deleted_at + vistas filtradas |
| 2.20 | Implementar auditoría básica | ⬜ | created_by, updated_by donde aplique |

---

## Fase 3: Dashboards

> **Prioridad**: ALTA — Visibilidad para admin y clientes.

### Dashboard Admin

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 3.1 | Diseñar layout AdminLayout | ⬜ | Sidebar colapsable, header con gym selector |
| 3.2 | KPI Cards: ingresos del mes | ⬜ | Con comparativa vs mes anterior |
| 3.3 | KPI Cards: socios activos | ⬜ | Total, nuevos este mes, inactivos |
| 3.4 | KPI Cards: aforo en tiempo real | ⬜ | Número grande con indicador de capacidad |
| 3.5 | KPI Cards: membresías por vencer | ⬜ | Alerta visual |
| 3.6 | Gráfica: Ingresos mensuales (últimos 12 meses) | ⬜ | Con Recharts o similar |
| 3.7 | Gráfica: Crecimiento de socios | ⬜ | Línea temporal |
| 3.8 | Gráfica: Distribución de membresías | ⬜ | Pie chart por plan |
| 3.9 | Gráfica: Aforo por hora (heatmap) | ⬜ | Para optimizar horarios |
| 3.10 | Tabla: Últimos check-ins | ⬜ | En tiempo real |
| 3.11 | Tabla: Membresías próximas a vencer | ⬜ | Con acciones (renovar, notificar) |

### Dashboard Cliente (Member)

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 3.12 | Diseñar layout MemberLayout | ⬜ | Bottom nav en mobile, header en desktop |
| 3.13 | Card: Puntos totales | ⬜ | Con ranking position |
| 3.14 | Card: Racha actual | ⬜ | Días consecutivos, record personal |
| 3.15 | Card: QR personal | ⬜ | Código QR grande para check-in |
| 3.16 | Card: Próxima rutina | ⬜ | Resumen del día |
| 3.17 | Card: Progreso físico | ⬜ | Sparkline de peso |
| 3.18 | Sección: Badges recientes | ⬜ | Grid de insignias |
| 3.19 | Sección: Leaderboard personal | ⬜ | Posición en rankings |

---

## Fase 4: Gestión de Socios (Members CRUD)

> **Prioridad**: ALTA — Core del negocio.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 4.1 | Service: fetchMembers | ⬜ | Con filtros y paginación |
| 4.2 | Service: createMember | ⬜ | Validar email único por gym |
| 4.3 | Service: updateMember | ⬜ | |
| 4.4 | Service: deleteMember (soft) | ⬜ | |
| 4.5 | Service: searchMembers | ⬜ | Por nombre, email, teléfono |
| 4.6 | Hook: useMembers | ⬜ | TanStack Query |
| 4.7 | Hook: useMember | ⬜ | Por ID |
| 4.8 | Componente: MemberList | ⬜ | Tabla con sorting, filtros |
| 4.9 | Componente: MemberCard | ⬜ | Vista de tarjeta para mobile |
| 4.10 | Componente: MemberForm | ⬜ | Crear/editar socio |
| 4.11 | Componente: MemberDetail | ⬜ | Vista completa del socio |
| 4.12 | Página: MembersPage (admin) | ⬜ | |
| 4.13 | Página: MemberProfilePage | ⬜ | Vista propia del socio |
| 4.14 | Tests: Member service | ⬜ | |
| 4.15 | Tests: Member hooks | ⬜ | |

---

## Fase 5: Membresías (Memberships)

> **Prioridad**: ALTA — Ingresos del gym.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 5.1 | Service: CRUD memberships (planes) | ⬜ | |
| 5.2 | Service: asignar membresía a socio | ⬜ | |
| 5.3 | Service: renovar membresía | ⬜ | |
| 5.4 | Service: cancelar membresía | ⬜ | |
| 5.5 | Hook: useMemberships | ⬜ | |
| 5.6 | Hook: useMemberMemberships | ⬜ | Historial por socio |
| 5.7 | Componente: MembershipList | ⬜ | |
| 5.8 | Componente: MembershipForm | ⬜ | Crear/editar plan |
| 5.9 | Componente: MembershipCard | ⬜ | Vista del socio |
| 5.10 | Página: MembershipsPage | ⬜ | Admin |
| 5.11 | Página: MyMembershipPage | ⬜ | Cliente |
| 5.12 | Alertas: membresías por vencer | ⬜ | Notificación automática |

---

## Fase 6: Check-in System (QR + Aforo)

> **Prioridad**: ALTA — Diferenciador clave.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 6.1 | Generar QR único por socio | ⬜ | Con rotación cada 30s |
| 6.2 | Scanner de QR (cámara) | ⬜ | html5-qrcode o similar |
| 6.3 | Registro de entrada | ✅ | Timestamp, validar membresía activa |
| 6.4 | Registro de salida | ⬜ | Opcional automático o manual |
| 6.5 | Control de aforo en tiempo real | ⬜ | Contador global por gym |
| 6.6 | Validaciones: membresía activa | ⬜ | Bloquear si venció |
| 6.7 | Validaciones: horario de acceso | ⬜ | Si el plan lo restringe |
| 6.8 | Validaciones: rate limiting | ⬜ | Evitar spam de check-ins |
| 6.9 | Historial de check-ins por socio | ⬜ | |
| 6.10 | Página: CheckInPage (recepción) | ⬜ | |
| 6.11 | Página: MyQRPage (cliente) | ⬜ | Mostrar QR grande |
| 6.12 | Tests: QR generation | ⬜ | |
| 6.13 | Tests: check-in flow | ⬜ | |

---

## Fase 7: Gamificación

> **Prioridad**: MEDIA — Engagement y retención.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 7.1 | Sistema de puntos | ⬜ | Reglas: check-in = X pts, rutina = Y pts |
| 7.2 | Sistema de rachas (streaks) | ⬜ | Grace period de 24h |
| 7.3 | Motor de badges | ⬜ | Condiciones y evaluación |
| 7.4 | Badges: primer check-in | ⬜ | |
| 7.5 | Badges: racha de 7 días | ⬜ | |
| 7.6 | Badges: racha de 30 días | ⬜ | |
| 7.7 | Badges: 100 entrenamientos | ⬜ | |
| 7.8 | Badges: peso levantado total | ⬜ | |
| 7.9 | Leaderboard global | ⬜ | Top 100 por puntos |
| 7.10 | Leaderboard por gym | ⬜ | |
| 7.11 | Leaderboard mensual | ⬜ | Reset cada mes |
| 7.12 | Sistema de retos (challenges) | ⬜ | Meta semanal/mensual |
| 7.13 | Recompensas por puntos | ⬜ | Canjeables |
| 7.14 | Componente: PointsDisplay | ⬜ | |
| 7.15 | Componente: StreakDisplay | ⬜ | Fuego animado |
| 7.16 | Componente: BadgeGrid | ⬜ | |
| 7.17 | Componente: LeaderboardTable | ⬜ | |
| 7.18 | Página: GamificationPage | ⬜ | |
| 7.19 | Tests: points calculation | ⬜ | |
| 7.20 | Tests: badge evaluation | ⬜ | |

---

## Fase 8: Rutinas y Entrenamientos (Workouts)

> **Prioridad**: MEDIA — Valor para el cliente.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 8.1 | CRUD de rutinas | ⬜ | Por entrenador o sistema |
| 8.2 | CRUD de ejercicios | ⬜ | Nombre, grupo muscular, descripción |
| 8.3 | Asignar rutina a socio | ⬜ | |
| 8.4 | Registrar progreso (sets/reps/peso) | ⬜ | |
| 8.5 | Historial de entrenamientos | ⬜ | |
| 8.6 | Biblioteca de ejercicios | ⬜ | Pre-cargados |
| 8.7 | Temporizador de descanso | ⬜ | |
| 8.8 | Componente: WorkoutCard | ⬜ | |
| 8.9 | Componente: ExerciseList | ⬜ | |
| 8.10 | Componente: WorkoutPlayer | ⬜ | Ejecutar rutina en vivo |
| 8.11 | Página: WorkoutsPage | ⬜ | |
| 8.12 | Página: MyWorkoutsPage | ⬜ | |

---

## Fase 9: Facturación y Pagos (Billing)

> **Prioridad**: MEDIA — Ingresos.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 9.1 | Integración con pasarela de pagos | ⬜ | Stripe/MercadoPago (futuro) |
| 9.2 | Registro de pagos manuales | ⬜ | Efectivo, transferencia |
| 9.3 | Historial de pagos por socio | ⬜ | |
| 9.4 | Facturas/recibos | ✅ | Generar PDF |
| 9.5 | Alertas de pago pendiente | ⬜ | |
| 9.6 | Reporte de ingresos | ⬜ | Por período |
| 9.7 | Página: PaymentsPage | ⬜ | |
| 9.8 | Página: InvoicesPage | ⬜ | |

---

## Fase 10: Notificaciones

> **Prioridad**: MEDIA — Comunicación.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 10.1 | Sistema de notificaciones internas | ⬜ | En app |
| 10.2 | Notificaciones realtime | ⬜ | Push en tiempo real |
| 10.3 | Notificación: membresía por vencer | ⬜ | Automática |
| 10.4 | Notificación: racha en riesgo | ⬜ | Faltan X horas |
| 10.5 | Notificación: nuevo badge | ⬜ | Inmediata |
| 10.6 | Notificación: pago recibido | ⬜ | |
| 10.7 | Notificación: nuevo reto | ⬜ | |
| 10.8 | Email automáticos | ⬜ | Supabase Edge Functions |
| 10.9 | Componente: NotificationBell | ⬜ | En header |
| 10.10 | Componente: NotificationList | ⬜ | Dropdown/panel |
| 10.11 | Página: NotificationsPage | ⬜ | Historial completo |

---

## Fase 11: Realtime y WebSockets

> **Prioridad**: MEDIA — Experiencia premium.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 11.1 | Configurar canales de Supabase Realtime | ⬜ | |
| 11.2 | Canal: aforo en tiempo real | ⬜ | Broadcast por gym |
| 11.3 | Canal: check-ins recientes | ⬜ | |
| 11.4 | Canal: rankings en vivo | ⬜ | |
| 11.5 | Canal: notificaciones por usuario | ⬜ | |
| 11.6 | Presence: quién está en el gym | ⬜ | |
| 11.7 | Hook: useRealtimeChannel | ⬜ | Reutilizable |
| 11.8 | Hook: useAforoRealtime | ⬜ | |
| 11.9 | Hook: useRankingRealtime | ⬜ | |
| 11.10 | Optimizar reconexiones | ⬜ | Manejar desconexiones |

---

## Fase 12: Métricas Físicas

> **Prioridad**: BAJA — Valor agregado.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 12.1 | CRUD de métricas | ⬜ | Peso, altura, % grasa, medidas |
| 12.2 | Gráficas de progreso | ⬜ | Sparklines |
| 12.3 | Comparativas | ⬜ | Vs promedio del gym |
| 12.4 | Página: BodyMetricsPage | ⬜ | |

---

## Fase 13: Configuración y Perfil

> **Prioridad**: BAJA — Polishing.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 13.1 | Página de perfil de usuario | ⬜ | Editar datos |
| 13.2 | Configuración del gym (para owners) | ⬜ | Nombre, logo, horarios, capacidad |
| 13.3 | Gestión de usuarios del staff | ⬜ | Invitar, cambiar roles |
| 13.4 | Preferencias de notificaciones | ⬜ | |
| 13.5 | Tema (dark/light) | ⬜ | Por ahora solo dark |

---

## Fase 14: Testing y Calidad

> **Prioridad**: CRÍTICA — Continuo.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 14.1 | Cobertura de tests unitarios > 70% | ⬜ | |
| 14.2 | Tests de integración para features core | ⬜ | Auth, members, checkins |
| 14.3 | Tests E2E con Playwright | ⬜ | Flujos críticos |
| 14.4 | Performance audit (Lighthouse) | ⬜ | |
| 14.5 | Accessibility audit (a11y) | ⬜ | |
| 14.6 | Responsive testing | ⬜ | Mobile, tablet, desktop |
| 14.7 | Security audit | ⬜ | RLS, XSS, CSRF |

---

## Fase 15: Deploy y Producción

> **Prioridad**: BAJA — Final.

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 15.1 | CI/CD con GitHub Actions | ⬜ | Tests + build |
| 15.2 | Deploy frontend (Vercel/Netlify) | ⬜ | |
| 15.3 | Configurar dominio custom | ⬜ | |
| 15.4 | SSL/HTTPS | ⬜ | |
| 15.5 | Monitoreo (Sentry/LogRocket) | ⬜ | |
| 15.6 | Analytics | ⬜ | |
| 15.7 | Backup automático de DB | ⬜ | |

---

## Resumen por Estado

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ Completado | 12 | ~8% |
| 🔄 En progreso | 0 | 0% |
| ⬜ Pendiente | 140 | ~92% |
| 🚫 Bloqueado | 0 | 0% |

**Fases completadas**: 0/15 (Fundación en progreso)
**Fases restantes**: 15/15

---

## Próximos Pasos Inmediatos

Basado en la arquitectura definida, el orden recomendado es:

1. **Fase 1: Auth + RBAC** — Implementar autenticación real con Supabase
2. **Fase 2: Database Schema** — Crear todas las tablas en PostgreSQL
3. **Fase 4: Members CRUD** — Gestión de socios (core del negocio)
4. **Fase 3: Dashboards** — Visualización para admin y clientes
5. **Fase 6: Check-in QR** — Sistema de aforo y QR

---

> **Nota**: Este roadmap es un documento vivo. 
> Actualizarlo después de cada fase completada.
> Marcar tareas como ✅ cuando estén implementadas, testeadas y verificadas.

---

## Contexto del Proyecto

- **Nombre**: GymSaaS
- **Stack**: React + Vite + TypeScript + Tailwind + Supabase + Zustand + TanStack Query
- **Arquitectura**: Feature-based, Clean Architecture, Multi-tenant
- **Path**: `C:\Users\Brahiam\Documents\Code\gym-saas`
- **Iniciado**: Mayo 2026
- **Metodología**: SDD (Spec-Driven Development) + TDD estricto
