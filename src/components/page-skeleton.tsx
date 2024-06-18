import PageWrapper from '@/components/page-wrapper'
import { Loader2 } from 'lucide-react'

export default function PageSkeleton({ title }: { title: string }) {
  return (
    <PageWrapper title={title}>
      <div className="h-[500px] w-full flex items-center justify-center">
        <Loader2 className="size-8 text-slate-300 animate-spin" />
      </div>
    </PageWrapper>
  )
}
