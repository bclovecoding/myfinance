'use client'
import { useMountedState } from 'react-use'
import NewAccountSheet from '@/features/accounts/new-data-sheet'
import EditAccountSheet from '@/features/accounts/edit-data-sheet'

import NewCategorySheet from '@/features/categories/new-data-sheet'
import EditCategorySheet from '@/features/categories/edit-data-sheet'

export default function SheetProvider() {
  const isMounted = useMountedState()
  if (!isMounted) return null
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategorySheet />
      <EditCategorySheet />
    </>
  )
}
