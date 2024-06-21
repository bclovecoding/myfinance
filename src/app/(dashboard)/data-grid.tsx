'use client'

import { useGetSummary } from '@/features/summary/use-hooks'

export default function DataGrid() {
  const summaryQuery = useGetSummary()
  return <div>DataGrid</div>
}
