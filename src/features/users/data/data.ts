import { Shield, UserCheck, Users } from 'lucide-react'
import { UserRole, UserStatus } from '@/types/user'

export const callTypes = new Map<UserStatus, string>([
  [UserStatus.ACTIVE, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [UserStatus.INACTIVE, 'bg-neutral-300/40 border-neutral-300'],
  [UserStatus.PENDING, 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
])

export const roles = [
  {
    label: 'Admin',
    value: UserRole.ADMIN,
    icon: Shield,
  },
  {
    label: 'Moderador',
    value: UserRole.MODERATOR,
    icon: Users,
  },
  {
    label: 'Ciudadano',
    value: UserRole.CITIZEN,
    icon: UserCheck,
  },
] as const
