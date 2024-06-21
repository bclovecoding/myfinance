import { Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function PageSkeleton() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full flex items-center justify-center">
            <Loader2 className="size-8 text-slate-300 animate-spin" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Page() {
  return <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24"></div>
}
