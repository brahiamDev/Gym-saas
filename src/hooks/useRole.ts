import { useAuthStore } from '@/store';

const ROLE_HIERARCHY = [
  'super_admin',
  'gym_owner',
  'admin',
  'recepcionista',
  'trainer',
  'member',
  'guest',
] as const;

type Role = typeof ROLE_HIERARCHY[number];

export function useRole() {
  const { profile } = useAuthStore();
  const role = (profile?.role || 'guest') as Role;
  const roleIndex = ROLE_HIERARCHY.indexOf(role);

  const hasRole = (requiredRole: Role) => {
    const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
    return roleIndex <= requiredIndex;
  };

  return {
    role,
    isSuperAdmin: role === 'super_admin',
    isGymOwner: hasRole('gym_owner'),
    isAdmin: hasRole('admin'),
    isTrainer: hasRole('trainer'),
    isMember: hasRole('member'),
    isRecepcionista: hasRole('recepcionista'),
    isGuest: role === 'guest',
    hasRole,
  };
}
