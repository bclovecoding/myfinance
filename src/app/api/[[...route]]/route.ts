import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { handle } from 'hono/vercel'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

export const runtime = 'edge'

import summary from './summary'
import accounts from './accounts'
import categories from './categories'
import transactions from './transactions'

const userIdMiddleware = createMiddleware(async (c, next) => {
  const auth = getAuth(c)
  console.log(auth)

  // console.log({ auth })
  if (!auth || !auth.userId || !auth.orgId) {
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

const routers = app
  .route('/summary', summary)
  .route('/transactions', transactions)
  .route('/accounts', accounts)
  .route('/categories', categories)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routers
