'use client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import PageWrapper from '@/components/page-wrapper'

import { columns } from './columns'
import DataTable from '@/components/data-table'

import { useNewData, useGetData } from '@/features/accounts/useHooks'

export default function Page() {
  const newData = useNewData()
  const query = useGetData()
  return (
    <PageWrapper title="Accounts" onAddNew={newData.onOpen}>
      <DataTable
        columns={columns}
        data={query.data || []}
        filterKey="name"
        onDelete={(rows) => {
          console.log(rows)
        }}
        disabled={false}
      />
    </PageWrapper>
  )
}
