'use client'
import { useMountedState } from 'react-use'
import NewAccountSheet from '@/features/accounts/new-data-sheet'

export default function SheetProvider() {
  const isMounted = useMountedState()
  if (!isMounted) return null
  return (
    <>
      <NewAccountSheet />
    </>
  )
}
