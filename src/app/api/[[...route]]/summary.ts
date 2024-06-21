import { Hono } from 'hono'
import { subDays, parse, differenceInDays } from 'date-fns'

import { db } from '@/db/drizzle'
import { sql, desc, sum, eq, and, gte, lte, lt } from 'drizzle-orm'

import { queryValidator } from './utility'

import { transactionsTable, accountsTable, categoriesTable } from '@/db/schema'
import { calculatePercentageChange, fillMissingDays } from '@/lib/utils'

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
  const incomeChange = calculatePercentageChange(
    currentPeriod.income,
    lastPeriod.income
  )
  const expensesChange = calculatePercentageChange(
    currentPeriod.expenses,
    lastPeriod.expenses
  )
  const remainingChange = calculatePercentageChange(
    currentPeriod.remaining,
    lastPeriod.remaining
  )

  const categories = await db
    .select({
      name: categoriesTable.name,
      value: sql`SUM(ABS(${transactionsTable.amount}))`.mapWith(Number),
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .innerJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id)
    )
    .where(
      and(
        eq(accountsTable.userId, userId),
        lt(transactionsTable.amount, 0),
        gte(transactionsTable.date, startDate),
        lte(transactionsTable.date, endDate),
        accountId ? eq(transactionsTable.accountId, accountId) : undefined
      )
    )
    .groupBy(categoriesTable.name)
    .orderBy(desc(sql`SUM(ABS(${transactionsTable.amount}))`))

  const topCategories = categories.slice(0, 3)
  const otherCategories = categories.slice(3)
  const otherSum = otherCategories.reduce((total, cur) => total + cur.value, 0)

  if (otherCategories.length > 0) {
    topCategories.push({
      name: 'Other',
      value: otherSum,
    })
  }

  const activeDays = await db
    .select({
      date: transactionsTable.date,
      income:
        sql`SUM(CASE WHEN ${transactionsTable.amount} >= 0 THEN ${transactionsTable.amount} ELSE 0 END)`.mapWith(
          Number
        ),
      expenses:
        sql`SUM(CASE WHEN ${transactionsTable.amount} < 0 THEN ABS(${transactionsTable.amount}) ELSE 0 END)`.mapWith(
          Number
        ),
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .where(
      and(
        eq(accountsTable.userId, userId),
        gte(transactionsTable.date, startDate),
        lte(transactionsTable.date, endDate),
        accountId ? eq(transactionsTable.accountId, accountId) : undefined
      )
    )
    .groupBy(transactionsTable.date)
    .orderBy(transactionsTable.date)

  const days = fillMissingDays(activeDays, startDate, endDate)

  return c.json({
    data: {
      remainingAmount: currentPeriod.remaining,
      remainingChange,
      incomeAmount: currentPeriod.income,
      incomeChange,
      expensesAmount: currentPeriod.expenses,
      expensesChange,
      categories: topCategories,
      days,
    },
  })
})

export default app
