import { Status } from "@/types/common"

export const callTypes = new Map<Status, string>([
  [Status.ACTIVE, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [Status.INACTIVE, 'bg-neutral-300/40 border-neutral-300'],
])

export const statusTypeTranslation = new Map<Status, string>([
  [Status.ACTIVE, 'Activo'],
  [Status.INACTIVE, 'Inactivo'],
])