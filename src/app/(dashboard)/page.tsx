'use client'
import DataCharts from './_components/data-charts'
import DataGrid from './_components/data-grid'

export default function Page() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-8 -mt-32 space-y-2">
      <DataGrid />
      <DataCharts />
    </div>
  )
}
