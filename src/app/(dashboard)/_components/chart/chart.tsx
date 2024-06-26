'use client'
import { useState } from 'react'
import { AreaChart, BarChart, FileSearch, LineChart } from 'lucide-react'

import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'

import AreaVariant from './area-variant'
import BarVariant from './bar-variant'
import LineVariant from './line-variant'

type ChartProps = {
  data?: {
    income: number
    expenses: number
    date: string
  }[]
}
export default function Chart({ data = [] }: ChartProps) {
  const [chartType, setChartType] = useState('area')
  const onTypeChange = (type: string) => {
    setChartType(type)
  }
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Area chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Bar chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Line chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col space-y-2 items-center justify-center h-[280px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data for this period
            </p>
          </div>
        ) : (
          <>
            {chartType === 'area' && <AreaVariant data={data} />}
            {chartType === 'bar' && <BarVariant data={data} />}
            {chartType === 'line' && <LineVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  )
}
