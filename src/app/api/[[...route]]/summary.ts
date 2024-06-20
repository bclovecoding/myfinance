import { Hono } from 'hono'
import { subDays, parse, differenceInDays } from 'date-fns'

import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '@/db/drizzle'
import { sql, sum, eq, and, gte, lte } from 'drizzle-orm'

import { queryValidator } from './utility'

import { transactionsTable, accountsTable, categoriesTable } from '@/db/schema'

const app = new Hono().get('/', queryValidator, async (c) => {
  const userId = c.get('clerkAuth')?.userId!

  const { from, to, accountId } = c.req.valid('query')
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 30)
  const startDate = from ? parse(from, 'yyyy-MM-dd', defaultFrom) : defaultFrom
  const endDate = to ? parse(to, 'yyyy-MM-dd', defaultTo) : defaultTo

  const periodLength = differenceInDays(endDate, startDate)
  const lastPeriodStart = subDays(startDate, periodLength)
  const lastPeriodEnd = subDays(endDate, periodLength)

  // console.log({ lastPeriodStart, lastPeriodEnd })

  const fetchFinancialDate = async (fromDate: Date, toDate: Date) => {
    return await db
      .select({
        income:
          sql`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        expenses:
          sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
            Number
          ),
        remaining: sum(transactionsTable.amount).mapWith(Number),
      })
      .from(transactionsTable)
      .innerJoin(
        accountsTable,
        eq(transactionsTable.accountId, accountsTable.id)
      )
      .where(
        and(
          eq(accountsTable.userId, userId),
          gte(transactionsTable.date, fromDate),
          lte(transactionsTable.date, toDate),
          accountId ? eq(transactionsTable.accountId, accountId) : undefined
        )
      )
  }
  const [currentPeriod] = await fetchFinancialDate(startDate, endDate)
  const [lastPeriod] = await fetchFinancialDate(lastPeriodStart, lastPeriodEnd)
  return c.json({ currentPeriod, lastPeriod })
})

export default app
