import { GuideStatus } from '@/types/guide'

export const callTypes = new Map<GuideStatus, string>([
  [GuideStatus.PUBLISHED, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  [GuideStatus.ARCHIVED, 'bg-neutral-300/40 border-neutral-300'],
  [GuideStatus.DRAFT, 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
])

export const statusTypeTranslation = new Map<GuideStatus, string>([
  [GuideStatus.PUBLISHED, 'Publicado'],
  [GuideStatus.ARCHIVED, 'Archivado'],
  [GuideStatus.DRAFT, 'Borrador'],
])