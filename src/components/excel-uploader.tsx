import React from 'react'
import * as XLSX from 'xlsx'
import { Input } from '@/components/ui/input'

export default function ExcelUploader() {
  const [data, setData] = React.useState<unknown>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const workbook = XLSX.read(event.target?.result, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const sheetData = XLSX.utils.sheet_to_json(sheet)

      setData(sheetData)
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <Input type="file" onChange={handleFileUpload} />
      {!!data && (
        <div>
          <h2>Imported Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
