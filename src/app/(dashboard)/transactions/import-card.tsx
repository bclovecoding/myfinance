'use client'
import { useState } from 'react'
import { Ban } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import ImportDataTable from './import-data-table'

const outputDateFormat = 'yyyy-MM-dd'
const requiredOptions = ['amount', 'date', 'category']

type Props = {
  importResult: ImportResult
  onCancelImport: () => void
  onSubmit?: (data: any) => void
}

export default function ImportCard({
  importResult,
  onCancelImport,
  onSubmit,
}: Props) {
  const [result, setResult] = useState<ImportResult>(importResult)
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  )
  const excelDateConvert = (date: number) => {
    return new Date(Math.round((date - 25569) * 864e5))
  }

  const onColumnSelectChange = (columnIndex: number, value: string | null) => {
    setSelectedColumns((pre) => {
      const newSelectedColumns = { ...pre }
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null
        }
      }

      if (value === 'skip') {
        value = null
      }

      newSelectedColumns[`column_${columnIndex}`] = value
      return newSelectedColumns
    })
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-8 -mt-32">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Upload transactions
          </CardTitle>
          <Button
            className="w-full lg:w-auto"
            size="sm"
            onClick={onCancelImport}
          >
            <Ban className="size-4 mr-2" />
            Cancel
          </Button>
        </CardHeader>
        <CardContent>
          <ImportDataTable
            importResult={result}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onColumnSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
