import { Hono } from 'hono'

const accounts = new Hono()
  .get('/', (c) => {
    const ca = c.get('clerkAuth')
    const clerkUserId = ca?.userId!
    return c.text(`List Accounts, clerkUserId is ${clerkUserId}`)
  }) // GET api/account
  .post('/', (c) => c.text('Create Account')) // POST api/account
  .delete('/:id', (c) => c.text('Delete Account')) // POST api/account

export default accounts
