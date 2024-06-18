import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export const idParamValidator = zValidator(
  'param',
  z.object({
    id: z.string().optional(),
  })
)