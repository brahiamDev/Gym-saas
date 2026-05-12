-- ============================================================
-- FIX: Simplificar roles - Eliminar super_admin
-- CORREGIDO v2: Borrar policies primero, luego cambiar tipo
-- ============================================================

-- 1. BORRAR TODAS las policies que usan role
-- ============================================================
-- Gyms policies
drop policy if exists "Super admin ve todos los gyms" on public.gyms;
drop policy if exists "Usuarios ven su gym" on public.gyms;
drop policy if exists "Gym owner/admin actualiza su gym" on public.gyms;

-- Profiles policies
drop policy if exists "Profiles: usuarios ven su propio perfil" on public.profiles;
drop policy if exists "Profiles: usuarios crean su propio perfil" on public.profiles;
drop policy if exists "Profiles: usuarios actualizan su propio perfil" on public.profiles;
drop policy if exists "Profiles: usuarios borran su propio perfil" on public.profiles;

-- Members policies
drop policy if exists "Staff del gym ve socios" on public.members;
drop policy if exists "Staff del gym crea socios" on public.members;
drop policy if exists "Staff del gym actualiza socios" on public.members;

-- Memberships policies
drop policy if exists "Todos ven planes activos de su gym" on public.memberships;
drop policy if exists "Staff administra planes" on public.memberships;

-- Checkins policies
drop policy if exists "Staff ve checkins de su gym" on public.checkins;
drop policy if exists "Staff crea checkins" on public.checkins;

-- Payments policies
drop policy if exists "Staff ve pagos de su gym" on public.payments;
drop policy if exists "Staff crea pagos" on public.payments;

-- 2. Actualizar perfiles con super_admin a gym_owner
-- ============================================================
UPDATE public.profiles 
SET role = 'gym_owner' 
WHERE role::text = 'super_admin';

-- 3. Crear nuevo enum sin super_admin
-- ============================================================
CREATE TYPE public.app_role_new AS ENUM (
  'gym_owner',
  'admin',
  'recepcionista', 
  'trainer',
  'member',
  'guest'
);

-- 4. Cambiar el tipo de la columna role
-- ============================================================
ALTER TABLE public.profiles 
  ALTER COLUMN role DROP DEFAULT;

ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE public.app_role_new 
  USING role::text::public.app_role_new;

ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'guest'::public.app_role_new;

-- 5. Borrar enum viejo y renombrar
-- ============================================================
DROP TYPE IF EXISTS public.app_role;
ALTER TYPE public.app_role_new RENAME TO app_role;

-- 6. RECREAR las policies con el nuevo enum
-- ============================================================

-- GYMS policies
create policy "Usuarios ven su gym"
  on public.gyms for select
  using (id in (
    select gym_id from public.profiles where id = auth.uid()
  ));

create policy "Gym owner/admin actualiza su gym"
  on public.gyms for update
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() 
    and gym_id = public.gyms.id 
    and role in ('gym_owner', 'admin')
  ));

-- PROFILES policies (simples, sin recursion)
create policy "Profiles: usuarios ven su propio perfil"
  on public.profiles for select
  using (id = auth.uid());

create policy "Profiles: usuarios crean su propio perfil"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Profiles: usuarios actualizan su propio perfil"
  on public.profiles for update
  using (id = auth.uid());

-- MEMBERS policies
create policy "Staff del gym ve socios"
  on public.members for select
  using (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin', 'recepcionista', 'trainer')
  ));

create policy "Staff del gym crea socios"
  on public.members for insert
  with check (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin', 'recepcionista')
  ));

create policy "Staff del gym actualiza socios"
  on public.members for update
  using (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin')
  ));

-- MEMBERSHIPS policies
create policy "Todos ven planes activos de su gym"
  on public.memberships for select
  using (gym_id in (
    select gym_id from public.profiles where id = auth.uid()
  ) and is_active = true);

create policy "Staff administra planes"
  on public.memberships for all
  using (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin')
  ));

-- CHECKINS policies
create policy "Staff ve checkins de su gym"
  on public.checkins for select
  using (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin', 'recepcionista', 'trainer')
  ));

create policy "Staff crea checkins"
  on public.checkins for insert
  with check (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin', 'recepcionista')
  ));

-- PAYMENTS policies
create policy "Staff ve pagos de su gym"
  on public.payments for select
  using (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin', 'recepcionista')
  ));

create policy "Staff crea pagos"
  on public.payments for insert
  with check (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin', 'recepcionista')
  ));

-- 7. Verificar
-- ============================================================
SELECT 'Roles simplificados y policies recreadas correctamente' as status;
SELECT DISTINCT role FROM public.profiles;
