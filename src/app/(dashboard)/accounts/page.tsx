'use client'
import PageWrapper from '@/components/page-wrapper'
import PageSkeleton from '@/components/page-skeleton'

import DataTable from '@/components/data-table'
import { columns } from './columns'

import {
  useNewData,
  useGetDataList,
  useBulkDelete,
} from '@/features/accounts/use-hooks'

export default function Page() {
  const newData = useNewData()
  const listQuery = useGetDataList()
  const bulkDeletemutaion = useBulkDelete()

  if (listQuery.isLoading) {
    return <PageSkeleton title="Accounts" />
  }

  const isDisabled = bulkDeletemutaion.isPending

  return (
    <PageWrapper title="Accounts" onAddNew={newData.onOpen}>
      <DataTable
        columns={columns}
        data={listQuery.data || []}
        filterKey="name"
        onDelete={(rows) => {
          const ids = rows.map((r) => r.original.id)
          bulkDeletemutaion.mutate({ ids })
        }}
        disabled={isDisabled}
      />
    </PageWrapper>
  )
}
