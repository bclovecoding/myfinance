import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

export default function MaxWidthWrapper({ className, children }: Props) {
  return (
    <div className={cn('max-w-screen-2xl mx-auto', className)}>{children}</div>
  )
}
