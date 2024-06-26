'use client'
import { useSearchParams } from 'next/navigation'
import { FaPiggyBank } from 'react-icons/fa'
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6'
import { useGetSummary } from '@/features/summary/use-hooks'
import { formatPeriod } from '@/lib/utils'

import { useMountedState } from 'react-use'

import DataCard, { DataCardSkeleton } from './data-card'

export default function DataGrid() {
  const { data, isLoading } = useGetSummary()

  const params = useSearchParams()
  const to = params.get('to') || undefined
  const from = params.get('from') || undefined
  const dateRangeLabel = formatPeriod({ from, to })

  const isMounted = useMountedState()

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-2 mb-4">
        <DataCardSkeleton />
        <DataCardSkeleton />
        <DataCardSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-2 mb-4">
      {isLoading ? (
        <>
          <DataCardSkeleton />
          <DataCardSkeleton />
          <DataCardSkeleton />
        </>
      ) : (
        <>
          <DataCard
            title="Remaining"
            value={data?.remainingAmount}
            percentageChange={data?.remainingChange}
            icon={FaPiggyBank}
            variant="default"
            dateRange={dateRangeLabel}
          />
          <DataCard
            title="Income"
            value={data?.incomeAmount}
            percentageChange={data?.incomeChange}
            icon={FaArrowTrendUp}
            variant="success"
            dateRange={dateRangeLabel}
          />
          <DataCard
            title="Expenses"
            value={data?.expensesAmount}
            percentageChange={data?.expensesChange}
            icon={FaArrowTrendDown}
            variant="danger"
            dateRange={dateRangeLabel}
          />
        </>
      )}
    </div>
  )
}
