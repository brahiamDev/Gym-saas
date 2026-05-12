-- ============================================================
-- GymSaaS - Base de Datos Inicial
-- Crear tablas: gyms, profiles, members, memberships, etc.
-- Ejecutar en Supabase SQL Editor (statement por statement)
-- ============================================================

-- ============================================================
-- 1. EXTENSIONES
-- ============================================================
-- uuid-ossp ya viene habilitada por defecto en Supabase
-- create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. ENUMS (Tipos personalizados)
-- ============================================================
-- Borramos si existen para evitar errores al re-ejecutar
drop type if exists public.app_role cascade;
drop type if exists public.member_status cascade;
drop type if exists public.membership_status cascade;
drop type if exists public.payment_status cascade;
drop type if exists public.checkin_method cascade;

create type public.app_role as enum (
  'super_admin',
  'gym_owner', 
  'admin',
  'recepcionista',
  'trainer',
  'member',
  'guest'
);

create type public.member_status as enum ('active', 'inactive', 'suspended');
create type public.membership_status as enum ('active', 'expired', 'cancelled', 'pending');
create type public.payment_status as enum ('paid', 'pending', 'overdue');
create type public.checkin_method as enum ('qr', 'manual', 'nfc');

-- ============================================================
-- 3. TABLA: gyms (Gimnasios / Tenants)
-- ============================================================
drop table if exists public.memberships cascade;
drop table if exists public.member_memberships cascade;
drop table if exists public.checkins cascade;
drop table if exists public.payments cascade;
drop table if exists public.members cascade;
drop table if exists public.profiles cascade;
drop table if exists public.gyms cascade;

create table public.gyms (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  address text,
  phone text,
  email text,
  logo_url text,
  settings jsonb default '{}',
  max_capacity integer default 100,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- ============================================================
-- 4. TABLA: profiles (Perfiles de usuarios)
-- ============================================================
-- Se vincula con auth.users de Supabase Auth
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  gym_id uuid references public.gyms(id),
  role public.app_role default 'guest',
  full_name text,
  phone text,
  avatar_url text,
  is_active boolean default true,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 5. TABLA: members (Socios/Clientes del gym)
-- ============================================================
create table public.members (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id),
  profile_id uuid not null references public.profiles(id),
  member_code text not null,
  qr_code text,
  emergency_contact text,
  emergency_phone text,
  notes text,
  status public.member_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz,
  unique(gym_id, member_code)
);

-- ============================================================
-- 6. TABLA: memberships (Planes de membresia)
-- ============================================================
create table public.memberships (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  duration_days integer not null default 30,
  benefits text[],
  features jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 7. TABLA: member_memberships (Relacion socio-membresia)
-- ============================================================
create table public.member_memberships (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references public.members(id),
  membership_id uuid not null references public.memberships(id),
  start_date date not null,
  end_date date not null,
  status public.membership_status default 'pending',
  payment_status public.payment_status default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 8. TABLA: checkins (Registro de entradas/salidas)
-- ============================================================
create table public.checkins (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id),
  member_id uuid not null references public.members(id),
  check_in_at timestamptz not null default now(),
  check_out_at timestamptz,
  method public.checkin_method default 'qr',
  verified_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz default now()
);

-- ============================================================
-- 9. TABLA: payments (Pagos y facturacion)
-- ============================================================
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  gym_id uuid not null references public.gyms(id),
  member_id uuid not null references public.members(id),
  member_membership_id uuid references public.member_memberships(id),
  amount numeric(10,2) not null,
  method text not null,
  status text not null default 'completed',
  reference_code text,
  notes text,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 10. INDICES (Performance)
-- ============================================================
create index idx_profiles_gym_id on public.profiles(gym_id);
create index idx_profiles_role on public.profiles(role);
create index idx_members_gym_id on public.members(gym_id);
create index idx_members_profile_id on public.members(profile_id);
create index idx_members_status on public.members(status);
create index idx_memberships_gym_id on public.memberships(gym_id);
create index idx_member_memberships_member_id on public.member_memberships(member_id);
create index idx_member_memberships_status on public.member_memberships(status);
create index idx_member_memberships_end_date on public.member_memberships(end_date);
create index idx_checkins_gym_id on public.checkins(gym_id);
create index idx_checkins_member_id on public.checkins(member_id);
create index idx_checkins_check_in_at on public.checkins(check_in_at);
create index idx_payments_gym_id on public.payments(gym_id);
create index idx_payments_member_id on public.payments(member_id);
create index idx_payments_created_at on public.payments(created_at);

-- ============================================================
-- 11. TRIGGER: auto-update updated_at
-- ============================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_gyms_updated_at 
  before update on public.gyms
  for each row execute function public.update_updated_at_column();

create trigger update_profiles_updated_at 
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_members_updated_at 
  before update on public.members
  for each row execute function public.update_updated_at_column();

create trigger update_memberships_updated_at 
  before update on public.memberships
  for each row execute function public.update_updated_at_column();

create trigger update_member_memberships_updated_at 
  before update on public.member_memberships
  for each row execute function public.update_updated_at_column();

create trigger update_payments_updated_at 
  before update on public.payments
  for each row execute function public.update_updated_at_column();

-- ============================================================
-- 12. ROW LEVEL SECURITY (RLS) - Habilitar
-- ============================================================
alter table public.gyms enable row level security;
alter table public.profiles enable row level security;
alter table public.members enable row level security;
alter table public.memberships enable row level security;
alter table public.member_memberships enable row level security;
alter table public.checkins enable row level security;
alter table public.payments enable row level security;

-- ============================================================
-- 13. RLS POLICIES
-- ============================================================
-- NOTA: auth.jwt() ->> 'role' NO funciona porque el rol del JWT
-- es 'authenticated' o 'anon'. El rol de la aplicacion esta en
-- la tabla profiles. Por eso usamos JOINs con profiles.

-- BORRAR policies existentes si las hay
-- (Supabase no permite duplicadas)

-- POLICIES para gyms
create policy "Super admin ve todos los gyms"
  on public.gyms for select
  using (exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'super_admin'
  ));

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

-- POLICIES para profiles
create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (id = auth.uid());

create policy "Super admin ve todos los perfiles"
  on public.profiles for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and role = 'super_admin'
  ));

create policy "Staff del gym ve perfiles de su gym"
  on public.profiles for select
  using (gym_id in (
    select gym_id from public.profiles 
    where id = auth.uid() 
    and role in ('gym_owner', 'admin', 'recepcionista', 'trainer')
  ));

create policy "Usuarios actualizan su perfil"
  on public.profiles for update
  using (id = auth.uid());

-- POLICIES para members
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

-- POLICIES para memberships (planes)
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

-- POLICIES para checkins
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

-- POLICIES para payments
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

-- ============================================================
-- 14. DATOS INICIALES (Seed)
-- ============================================================
insert into public.gyms (name, slug, address, email, max_capacity)
values (
  'Gym Central',
  'gym-central',
  'Calle Principal 123',
  'info@gymcentral.com',
  150
);

-- ============================================================
-- 15. TRIGGER: Crear perfil automaticamente al registrarse
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'guest'),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Este trigger se ejecuta despues de que un usuario se registra en auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 16. VERIFICACION FINAL
-- ============================================================
select 'Tablas creadas correctamente' as status,
       (select count(*) from information_schema.tables where table_schema = 'public') as total_tables;
