import { z } from 'zod'
import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'

export const accountsTable = pgTable(
  'accounts',
  {
    id: varchar('id', { length: 60 }).primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    userId: varchar('user_id', { length: 60 }).notNull(),
  },
  (accountsTable) => {
    return {
      userAccountIndex: uniqueIndex('user_account_idx').on(
        accountsTable.userId,
        accountsTable.name
      ),
    }
  }
)
export const accountsRelations = relations(accountsTable, ({ many }) => ({
  transactions: many(transactionsTable),
}))
export const InsertAccountSchema = createInsertSchema(accountsTable)

export const categoriesTable = pgTable(
  'categories',
  {
    id: varchar('id', { length: 60 }).primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    userId: varchar('user_id', { length: 60 }).notNull(),
  },
  (categoriesTable) => {
    return {
      userCategoryIndex: uniqueIndex('user_category_idx').on(
        categoriesTable.userId,
        categoriesTable.name
      ),
    }
  }
)
export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  transactions: many(transactionsTable),
}))
export const InsertCategorySchema = createInsertSchema(categoriesTable)

export const transactionsTable = pgTable('transactions', {
  id: varchar('id', { length: 60 }).primaryKey(),
  amount: integer('amount').notNull(),
  payee: text('payee').notNull(),
  date: timestamp('date', { mode: 'date' }).notNull(),
  notes: text('notes'),
  accountId: varchar('account_id', { length: 60 })
    .references(() => accountsTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  categoryId: varchar('category_id', { length: 60 }).references(
    () => categoriesTable.id,
    {
      onDelete: 'set null',
    }
  ),
})
export const transactionsRelations = relations(
  transactionsTable,
  ({ one }) => ({
    account: one(accountsTable, {
      fields: [transactionsTable.accountId],
      references: [accountsTable.id],
    }),
    category: one(categoriesTable, {
      fields: [transactionsTable.categoryId],
      references: [categoriesTable.id],
    }),
  })
)
export const InsertTransactionSchema = createInsertSchema(transactionsTable, {
  date: z.coerce.date(),
})
