import { z } from 'zod'

const badgeStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
])

export type BadgeStatus = z.infer<typeof badgeStatusSchema>