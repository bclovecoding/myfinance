import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { handle } from 'hono/vercel'
import { clerkMiddleware } from '@hono/clerk-auth'

export const runtime = 'edge'

import accounts from './accounts'
import categories from './categories'
import transactions from './transactions'

export const userIdMiddleware = createMiddleware(async (c, next) => {
  const ca = c.get('clerkAuth')

  if (!ca || !ca.userId) {
    return c.json(
      {
        error: 'Unauthorized',
      },
      401
    )
  }
  await next()
})

const app = new Hono().basePath('/api')

app.use('*', clerkMiddleware(), userIdMiddleware)

export const routers = app
  .route('/accounts', accounts)
  .route('/categories', categories)
  .route('/transactions', transactions)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routers
