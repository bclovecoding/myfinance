'use client'
import { Button } from '@/components/ui/button'
import { useNewData } from '@/features/accounts/useHooks'
export default function Page() {
  const { onOpen } = useNewData()
  return (
    <div>
      Dashboard
      <Button onClick={onOpen}>Accounts</Button>
    </div>
  )
}
