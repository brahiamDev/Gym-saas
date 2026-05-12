-- ============================================================
-- GymSaaS - Fix Auth Trigger
-- Remove the automatic trigger that causes "Database error saving new user"
-- and add RLS policy so profiles can be created manually from frontend.
-- ============================================================

-- 1. Drop the problematic trigger
drop trigger if exists on_auth_user_created on auth.users;

-- 2. Drop the handler function
drop function if exists public.handle_new_user();

-- 3. Add INSERT policy on profiles so authenticated users can create their own profile
-- (The trigger previously used security definer to bypass RLS, so we need this now)
create policy "Usuarios crean su propio perfil"
  on public.profiles for insert
  with check (id = auth.uid());

select 'Trigger removed and profile insert policy added successfully.' as status;