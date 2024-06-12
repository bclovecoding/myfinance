import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { handle } from 'hono/vercel'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'

export const runtime = 'edge'

import accounts from './accounts'

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

export const router = app
  .use('*', clerkMiddleware(), userIdMiddleware)
  .route('/accounts', accounts)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
