import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '@/db/drizzle'
import { eq, inArray, and } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

import {
  InsertCategorySchema as InsertDataSchema,
  categoriesTable as dataTable,
} from '@/db/schema'

import { idParamValidator } from './utility'

const selectColumns = { id: dataTable.id, name: dataTable.name }
const findByIdWhereClause = (userId: string, id: string) =>
  and(eq(dataTable.userId, userId), eq(dataTable.id, id))

const nameJsonValidator = zValidator(
  'json',
  InsertDataSchema.pick({ name: true })
)

const app = new Hono()
  .get('/', async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const data = await db
      .select(selectColumns)
      .from(dataTable)
      .where(eq(dataTable.userId, userId))

    return c.json({ data })
  })
  .get('/:id', idParamValidator, async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const { id } = c.req.valid('param')
    if (!id) {
      return c.json({ error: 'Id is mssing' }, 400)
    }
    const [data] = await db
      .select({ id: dataTable.id, name: dataTable.name })
      .from(dataTable)
      .where(findByIdWhereClause(userId, id))

    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }

    return c.json({ data })
  })
  .post('/', nameJsonValidator, async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const { name } = c.req.valid('json')
    const [data] = await db
      .insert(dataTable)
      .values({
        id: createId(),
        userId,
        name,
      })
      .returning()
    return c.json({ data })
  })
  .post(
    '/bulk-delete',
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const userId = c.get('clerkAuth')?.userId!
      const ids = c.req.valid('json').ids
      const data = await db
        .delete(dataTable)
        .where(and(eq(dataTable.userId, userId), inArray(dataTable.id, ids)))
        .returning(selectColumns)
      return c.json({ data })
    }
  )
  .patch('/:id', idParamValidator, nameJsonValidator, async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const { id } = c.req.valid('param')
    if (!id) {
      return c.json({ error: 'Id is mssing' }, 400)
    }
    const values = c.req.valid('json')

    const [data] = await db
      .update(dataTable)
      .set(values)
      .where(findByIdWhereClause(userId, id))
      .returning(selectColumns)
    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }
    return c.json({ data })
  })
  .delete('/:id', idParamValidator, async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const { id } = c.req.valid('param')
    if (!id) {
      return c.json({ error: 'Id is mssing' }, 400)
    }
    const [data] = await db
      .delete(dataTable)
      .where(findByIdWhereClause(userId, id))
      .returning(selectColumns)
    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }
    return c.json({ data })
  })

export default app
