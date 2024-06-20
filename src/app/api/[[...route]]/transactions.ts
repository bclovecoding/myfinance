import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { eq, inArray, and, gte, lte, desc, sql } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { subDays, parse } from 'date-fns'

import { db } from '@/db/drizzle'
import {
  InsertTransactionSchema,
  transactionsTable,
  accountsTable,
  categoriesTable,
} from '@/db/schema'

import { idParamValidator } from './utility'

const selectColumns = {
  id: transactionsTable.id,
  date: transactionsTable.date,
  accountId: transactionsTable.accountId,
  account: accountsTable.name,
  categoryId: transactionsTable.categoryId,
  category: categoriesTable.name,
  amount: transactionsTable.amount,
  payee: transactionsTable.payee,
  notes: transactionsTable.notes,
}

const jsonDataValidator = zValidator(
  'json',
  InsertTransactionSchema.omit({ id: true })
)

const app = new Hono()
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    async (c) => {
      const userId = c.get('clerkAuth')?.userId!
      const { from, to, accountId } = c.req.valid('query')
      const defaultTo = new Date()
      const defaultFrom = subDays(defaultTo, 30)
      const startDate = from
        ? parse(from, 'yyyy-MM-dd', defaultFrom)
        : defaultFrom

      const endDate = to ? parse(to, 'yyyy-MM-dd', defaultTo) : defaultTo

      const data = await db
        .select(selectColumns)
        .from(transactionsTable)
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id)
        )
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id)
        )
        .where(
          and(
            accountId ? eq(transactionsTable.accountId, accountId) : undefined,
            eq(accountsTable.userId, userId),
            gte(transactionsTable.date, startDate),
            lte(transactionsTable.date, endDate)
          )
        )
        .orderBy(desc(transactionsTable.date))

      return c.json({ data })
    }
  )
  .get('/:id', idParamValidator, async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const { id } = c.req.valid('param')
    if (!id) {
      return c.json({ error: 'Id is mssing' }, 400)
    }

    const [data] = await db
      .select(selectColumns)
      .from(transactionsTable)
      .innerJoin(
        accountsTable,
        eq(transactionsTable.accountId, accountsTable.id)
      )
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      )
      .where(
        and(eq(transactionsTable.id, id), eq(accountsTable.userId, userId))
      )
    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }
    return c.json({ data })
  })
  .post('/', jsonDataValidator, async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const values = c.req.valid('json')
    const [accountWithTrans] = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.id, values.accountId))
    if (!accountWithTrans) {
      return c.json({ error: 'Account not found' }, 400)
    }
    if (accountWithTrans.userId !== userId) {
      return c.json({ error: 'Account not belongs to you' }, 400)
    }

    const [data] = await db
      .insert(transactionsTable)
      .values({
        id: createId(),
        ...values,
      })
      .returning()
    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }
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
      const transactionsToDelete = db.$with('transactions_to_delete').as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(
            accountsTable,
            eq(transactionsTable.accountId, accountsTable.id)
          )
          .where(
            and(
              inArray(transactionsTable.id, ids),
              eq(accountsTable.userId, userId)
            )
          )
      )
      const data = await db
        .with(transactionsToDelete)
        .delete(transactionsTable)
        .where(
          inArray(
            transactionsTable.id,
            sql`(select id from ${transactionsToDelete})`
          )
        )
        .returning({ id: transactionsTable.id })
      return c.json({ data })
    }
  )
  .patch('/:id', idParamValidator, jsonDataValidator, async (c) => {
    const userId = c.get('clerkAuth')?.userId!
    const { id } = c.req.valid('param')
    if (!id) {
      return c.json({ error: 'Id is mssing' }, 400)
    }
    const values = c.req.valid('json')

    const transactionsToUpdate = db.$with('transactions_to_update').as(
      db
        .select({ id: transactionsTable.id })
        .from(transactionsTable)
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id)
        )
        .where(
          and(eq(transactionsTable.id, id), eq(accountsTable.userId, userId))
        )
    )

    const [data] = await db
      .with(transactionsToUpdate)
      .update(transactionsTable)
      .set(values)
      .where(
        inArray(
          transactionsTable.id,
          sql`(select id from ${transactionsToUpdate})`
        )
      )
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

    const transactionToDelete = db.$with('transaction_to_delete').as(
      db
        .select({ id: transactionsTable.id })
        .from(transactionsTable)
        .innerJoin(
          accountsTable,
          eq(transactionsTable.accountId, accountsTable.id)
        )
        .where(
          and(eq(transactionsTable.id, id), eq(accountsTable.userId, userId))
        )
    )
    const [data] = await db
      .with(transactionToDelete)
      .delete(transactionsTable)
      .where(
        inArray(
          transactionsTable.id,
          sql`(select id from ${transactionToDelete})`
        )
      )
      .returning({ id: transactionsTable.id })
    if (!data) {
      return c.json({ error: 'Not found' }, 404)
    }
    return c.json({ data })
  })

export default app
