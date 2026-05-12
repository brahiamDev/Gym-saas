-- ============================================================
-- FIX: Simplificar roles - Eliminar super_admin
-- CORREGIDO: Maneja el DEFAULT constraint correctamente
-- ============================================================

-- 1. Primero borramos el DEFAULT para poder cambiar el tipo
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- 2. Actualizar perfiles que tengan super_admin a gym_owner
UPDATE public.profiles 
SET role = 'gym_owner' 
WHERE role::text = 'super_admin';

-- 3. Crear nuevo enum sin super_admin
CREATE TYPE public.app_role_new AS ENUM (
  'gym_owner',
  'admin',
  'recepcionista', 
  'trainer',
  'member',
  'guest'
);

-- 4. Cambiar el tipo de la columna (ahora sin DEFAULT debería funcionar)
ALTER TABLE public.profiles 
  ALTER COLUMN role TYPE public.app_role_new 
  USING role::text::public.app_role_new;

-- 5. Volver a poner el DEFAULT con el nuevo tipo
ALTER TABLE public.profiles 
  ALTER COLUMN role SET DEFAULT 'guest'::public.app_role_new;

-- 6. Borrar enum viejo
DROP TYPE IF EXISTS public.app_role;

-- 7. Renombrar nuevo enum
ALTER TYPE public.app_role_new RENAME TO app_role;

-- 8. Verificar
SELECT 'Roles simplificados correctamente' as status;
SELECT DISTINCT role FROM public.profiles;
