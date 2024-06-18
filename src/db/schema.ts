import { pgTable, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
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

export type InsertAccount = typeof accountsTable.$inferInsert
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

export type InsertCategory = typeof categoriesTable.$inferInsert
export const InsertCategorySchema = createInsertSchema(categoriesTable)
