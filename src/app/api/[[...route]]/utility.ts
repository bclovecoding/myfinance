import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

export const idParamValidator = zValidator(
  'param',
  z.object({
    id: z.string().optional(),
  })
)

export const queryValidator = zValidator(
  'query',
  z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    accountId: z.string().optional(),
  })
)
