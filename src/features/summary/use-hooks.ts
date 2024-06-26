import { useSearchParams } from 'next/navigation'
import { client } from '@/lib/hono'
import { useQuery } from '@tanstack/react-query'

import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetSummary = () => {
  const params = useSearchParams()
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const accountId = params.get('accountId') || ''

  const query = useQuery({
    queryKey: ['summary', { from, to, accountId }],
    queryFn: async () => {
      const resp = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      })
      if (!resp.ok) {
        throw new Error(`Fail to fetch summary`)
      }
      const { data } = await resp.json()

      const result = {
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        remainingChange: data.remainingChange,
        incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
        incomeChange: data.incomeChange,
        expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
        expensesChange: data.expensesChange,
        categories: data.categories.map((c) => ({
          ...c,
          value: convertAmountFromMiliunits(c.value),
        })),
        days: data.days.map((d) => ({
          ...d,
          income: convertAmountFromMiliunits(d.income),
          expenses: convertAmountFromMiliunits(d.expenses),
        })),
      }

      return result
    },
  })

  return query
}
