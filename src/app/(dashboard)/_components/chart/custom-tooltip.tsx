import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

export default function CustomTooltip({ active, payload }: any) {
  if (!active) return null

  const date = payload[0].payload.date
  const income = payload[0].value
  const expenses = payload[1].value

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm px-3 py-2 bg-muted text-muted-foreground">
        {format(date, 'yyyy-MM-dd')}
      </div>
      <Separator />
      <div className="px-3 py-2 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-2.5 bg-blue-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Income</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-2.5 bg-rose-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(expenses)}
          </p>
        </div>
      </div>
    </div>
  )
}
