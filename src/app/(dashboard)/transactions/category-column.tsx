import { TriangleAlert } from 'lucide-react'
import { useOpenData as useOpenCategory } from '@/features/categories/useHooks'
import { useOpenData as useOpenTransaction } from '@/features/transactions/useHooks'

import { cn } from '@/lib/utils'

type Props = {
  id: string
  category: string | null | undefined
  categoryId: string | null | undefined
}

export default function CategoryColumn({ id, category, categoryId }: Props) {
  const { onOpen: onOpenCategory } = useOpenCategory()
  const { onOpen: onOpenTransaction } = useOpenTransaction()
  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId)
    } else {
      onOpenTransaction(id)
    }
  }
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center cursor-pointer hover:underline',
        !category && 'text-rose-600'
      )}
    >
      {!category && <TriangleAlert className="size-4 mr-2 shrink-0" />}
      {category || 'Uncategorized'}
    </div>
  )
}
