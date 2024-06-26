'use client'
import { useGetSummary } from '@/features/summary/use-hooks'
import Chart from './chart/chart'
import SpendingChart from './chart/spending-chart'

import ChartSkeleton from './chart/chart-skeleton'
import SpendingChartSkeleton from './chart/spending-chart-skeleton'

export default function DataCharts() {
  const { data, isLoading } = useGetSummary()
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartSkeleton />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingChartSkeleton />
        </div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingChart data={data?.categories} />
      </div>
    </div>
  )
}
