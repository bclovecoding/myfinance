import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db } from '@/db/drizzle'
import { eq, sql } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

import { InsertAccountSchema, accountsTable } from '@/db/schema'

const accounts = new Hono()
  .get('/', async (c) => {
    const userId = c.get('clerkAuth')?.userId
    const data = await db
      .select({ id: accountsTable.id, name: accountsTable.name })
      .from(accountsTable)
      .where(eq(accountsTable.userId, sql`${userId}`))
    return c.json({ data })
  })
  .post(
    '/',
    zValidator('json', InsertAccountSchema.pick({ name: true })),
    async (c) => {
      const userId = c.get('clerkAuth')?.userId!
      const values = c.req.valid('json')
      const [data] = await db
        .insert(accountsTable)
        .values({
          id: createId(),
          userId,
          ...values,
        })
        .returning()
      return c.json({ data })
    }
  )

export default accounts
