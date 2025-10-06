import { BadgeStatus } from "@/types/badge"

export const callTypes = new Map<BadgeStatus, string>([
  [BadgeStatus.ACTIVE, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [BadgeStatus.INACTIVE, 'bg-neutral-300/40 border-neutral-300'],
])

export const statusTypeTranslation = new Map<BadgeStatus, string>([
  [BadgeStatus.ACTIVE, 'Activo'],
  [BadgeStatus.INACTIVE, 'Inactivo'],
])