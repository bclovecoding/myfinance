'use client'
import { useState, useRef } from 'react'

import { Plus, Upload } from 'lucide-react'
import * as XLSX from 'xlsx'

import { InferRequestType } from 'hono'
import { client } from '@/lib/hono'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import PageSkeleton from '@/components/page-skeleton'
import DataTable from '@/components/data-table'

import { columns } from './columns'
import {
  useNewData,
  useGetDataList,
  useBulkDelete,
  useBulkCreateData,
} from '@/features/transactions/use-hooks'
import { useSelectAccount } from '@/features/accounts/use-hooks'
import ImportCard from './import-card'

type UploadTranType = InferRequestType<
  (typeof client.api.transactions)['bulk-create']['$post']
>['json'][0]

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const initialResult: ImportResult = {
  sheetName: '',
  keys: [],
  list: [],
}

export default function Page() {
  const [variant, setVariant] = useState(VARIANTS.LIST)
  const fileInput = useRef<HTMLInputElement>(null)
  const newData = useNewData()
  const listQuery = useGetDataList()
  const bulkDeletemutaion = useBulkDelete()
  const bulkCreatemutaion = useBulkCreateData()

  const [SelectAccountDlg, selectAccount] = useSelectAccount()

  const [importResult, setImportResult] = useState<ImportResult>(initialResult)

  if (listQuery.isLoading) {
    return <PageSkeleton title="Transactions History" />
  }
  const isDisabled = bulkDeletemutaion.isPending || bulkCreatemutaion.isPending

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const workbook = XLSX.read(event.target?.result, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const list = XLSX.utils.sheet_to_json(sheet) as any[]
      const item = list[0]
      const keys = Object.keys(item)
      setImportResult({ sheetName, keys, list })
      console.log({ list })
      setVariant(VARIANTS.IMPORT)
    }

    reader.readAsArrayBuffer(file)
  }

  const onUploadButtonClick = () => {
    if (fileInput.current != undefined && fileInput.current.click != undefined)
      fileInput.current.click()
  }

  const onCancelImport = () => {
    setImportResult(initialResult)
    setVariant(VARIANTS.LIST)
  }

  const onSubmitImport = async (values: UploadTranType[]) => {
    const accountId = await selectAccount()
    if (!accountId) {
      toast.error('Please select an account to continue.')
    }

    const data: UploadTranType[] = values.map((v) => ({
      ...v,
      accountId: accountId as string,
    }))

    bulkCreatemutaion.mutate(data, {
      onSuccess: () => {
        onCancelImport()
      },
    })
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <SelectAccountDlg />
        <ImportCard
          importResult={importResult}
          onCancelImport={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-8 -mt-32">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="p-0 flex flex-col lg:flex-row gap-2">
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
              onClick={onUploadButtonClick}
              size="sm"
            >
              <Upload className="size-4 mr-2" />
              Upload
            </Button>
            <input
              type="file"
              hidden
              ref={fileInput}
              onChange={handleFileUpload}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={listQuery.data || []}
            filterKey="account"
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
