import { z } from 'zod'

const zoneStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
])

export type ZoneStatus = z.infer<typeof zoneStatusSchema>