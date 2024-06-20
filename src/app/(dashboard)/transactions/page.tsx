'use client'
import { useState } from 'react'
import { Ban, Plus, Upload } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import ExcelUploader from '@/components/excel-uploader'
import PageSkeleton from '@/components/page-skeleton'
import DataTable from '@/components/data-table'
import { columns } from './columns'
import {
  useNewData,
  useGetDataList,
  useBulkDelete,
} from '@/features/transactions/useHooks'

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

export default function Page() {
  const [variant, setVariant] = useState(VARIANTS.LIST)
  const newData = useNewData()
  const listQuery = useGetDataList()
  const bulkDeletemutaion = useBulkDelete()

  if (listQuery.isLoading) {
    return <PageSkeleton title="Transactions History" />
  }

  const isDisabled = bulkDeletemutaion.isPending

  if (variant === VARIANTS.IMPORT) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
              Upload transactions
            </CardTitle>
            <Button
              className="w-full lg:w-auto"
              size="sm"
              onClick={() => setVariant(VARIANTS.LIST)}
            >
              <Ban className="size-4 mr-2" />
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <ExcelUploader />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="p-0 space-x-2 ">
            <Button
              className="w-full lg:w-auto"
              onClick={newData.onOpen}
              size="sm"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <Button
              variant="outline"
              className="w-full lg:w-auto"
              onClick={() => setVariant(VARIANTS.IMPORT)}
              size="sm"
            >
              <Upload className="size-4 mr-2" />
              Upload
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={listQuery.data || []}
            filterKey="payee"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id)
              bulkDeletemutaion.mutate({ ids })
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}
