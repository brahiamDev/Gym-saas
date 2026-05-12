export const ROLES = [
  'super_admin',
  'gym_owner',
  'admin',
  'recepcionista',
  'trainer',
  'member',
  'guest',
] as const;

export type Role = typeof ROLES[number];