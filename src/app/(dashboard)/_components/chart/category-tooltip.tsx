import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

export default function CategoryTooltip({ active, payload }: any) {
  if (!active) return null

  const name = payload[0].payload.name
  const value = payload[0].value

  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm px-3 py-2 bg-muted text-muted-foreground">
        {name}
      </div>
      <Separator />
      <div className="px-3 py-2 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-2.5 bg-rose-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Expenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(value)}
          </p>
        </div>
      </div>
    </div>
  )
}
