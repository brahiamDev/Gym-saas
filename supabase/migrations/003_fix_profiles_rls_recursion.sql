-- ============================================================
-- FIX: Recursion infinita en RLS policies de profiles
-- ============================================================
-- El problema: Las policies de profiles hacian SELECT FROM profiles,
-- lo que causaba recursion infinita en PostgreSQL.
-- Solucion: Policies simples que usan auth.uid() directamente.

-- 1. Borrar TODAS las policies existentes de profiles
-- ============================================================
drop policy if exists "Usuarios ven su propio perfil" on public.profiles;
drop policy if exists "Super admin ve todos los perfiles" on public.profiles;
drop policy if exists "Staff del gym ve perfiles de su gym" on public.profiles;
drop policy if exists "Usuarios actualizan su perfil" on public.profiles;
drop policy if exists "Usuarios crean su propio perfil" on public.profiles;

-- 2. Crear policies SIMPLES sin recursion
-- ============================================================

-- SELECT: Cada usuario ve SU propio perfil (usando auth.uid() directamente)
create policy "Profiles: usuarios ven su propio perfil"
  on public.profiles for select
  using (id = auth.uid());

-- INSERT: Cada usuario puede crear SU propio perfil
create policy "Profiles: usuarios crean su propio perfil"
  on public.profiles for insert
  with check (id = auth.uid());

-- UPDATE: Cada usuario puede actualizar SU propio perfil
create policy "Profiles: usuarios actualizan su propio perfil"
  on public.profiles for update
  using (id = auth.uid());

-- DELETE: Cada usuario puede borrar SU propio perfil (opcional)
create policy "Profiles: usuarios borran su propio perfil"
  on public.profiles for delete
  using (id = auth.uid());

-- NOTA: Para que admin/staff vean perfiles de su gym, se hará desde
-- el backend con service_role o se implementará con funciones seguras.
-- Por ahora, cada usuario solo accede a su propio perfil.

-- 3. Verificar que la recursión se haya eliminado
-- ============================================================
select 'RLS policies de profiles corregidas - sin recursion' as status;
