'use client'
import { useState } from 'react'
import { Ban } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { convertAmountToMiliunits } from '@/lib/utils'

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
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {}
  )
  const excelDateConvert = (date: number) => {
    return new Date(Math.round((date - 25569) * 864e5))
  }

  const onColumnSelectChange = (columnName: string, value: string) => {
    setSelectedColumns((pre) => {
      const newSelectedColumns = { ...pre }
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = 'skip'
        }
      }

      newSelectedColumns[columnName] = value
      return newSelectedColumns
    })
  }

  const progress = Object.entries(selectedColumns).filter(([_, value]) =>
    requiredOptions.includes(value)
  ).length

  const handleContinue = () => {
    const cols = Object.entries(selectedColumns).filter(
      ([_, value]) => value !== 'skip'
    )
    const mappedData = importResult.list
      .map((l) => {
        let item: any = {}
        cols.forEach(([src, tar]) => {
          if (tar !== 'date') item[tar] = l[src]
          else item[tar] = excelDateConvert(l[src])
        })
        return item
      })
      .map((row) => ({
        ...row,
        amount: convertAmountToMiliunits(row.amount),
      }))
    console.log({ mappedData })
    onSubmit?.(mappedData)
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-8 -mt-32">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Upload transactions
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            <Button
              className="w-full lg:w-auto"
              onClick={onCancelImport}
              size="sm"
            >
              <Ban className="size-4 mr-2" />
              Cancel
            </Button>
            <Button
              disabled={progress < requiredOptions.length}
              size="sm"
              className="w-full lg:w-auto"
              onClick={handleContinue}
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportDataTable
            importResult={importResult}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onColumnSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
