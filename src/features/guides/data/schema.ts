import { z } from 'zod'

const guideStatusSchema = z.union([
  z.literal('published'),
  z.literal('archived'),
  z.literal('draft'),
])

export type GuideStatus = z.infer<typeof guideStatusSchema>