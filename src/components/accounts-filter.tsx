'use client'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import qs from 'query-string'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

import { useGetDataList as useGetAccounts } from '@/features/accounts/use-hooks'
import { useGetSummary } from '@/features/summary/use-hooks'

export default function AccountsFilter() {
  const { isLoading: isLoadingSummary } = useGetSummary()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const accountId = params.get('accountId') || 'all'
  const from = params.get('from') || ''
  const to = params.get('to') || ''

  const { data: accounts, isLoading: isLoadingAccounts } = useGetAccounts()

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    }

    if (newValue === 'all') {
      query.accountId = ''
    }

    const url = qs.stringifyUrl(
      { url: pathname, query },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    )

    router.push(url)
  }

  const isLoading = isLoadingAccounts || isLoadingSummary

  return (
    <Select value={accountId} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className="w-full lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All accounts</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
