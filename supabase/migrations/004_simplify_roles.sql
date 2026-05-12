-- ============================================================
-- FIX: Simplificar roles - Eliminar super_admin
-- ============================================================

-- Nota: PostgreSQL enum no permite borrar valores directamente
-- Creamos un nuevo enum y migramos los datos

-- 1. Crear nuevo enum sin super_admin
CREATE TYPE public.app_role_new AS ENUM (
  'gym_owner',
  'admin',
  'recepcionista', 
  'trainer',
  'member',
  'guest'
);

-- 2. Actualizar perfiles que tengan super_admin a gym_owner
UPDATE public.profiles 
SET role = 'gym_owner' 
WHERE role = 'super_admin';

-- 3. Cambiar el tipo de la columna
ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE public.app_role_new 
  USING role::text::public.app_role_new;

-- 4. Borrar enum viejo
DROP TYPE public.app_role;

-- 5. Renombrar nuevo enum
ALTER TYPE public.app_role_new RENAME TO app_role;

-- 6. Verificar
SELECT DISTINCT role FROM public.profiles;
