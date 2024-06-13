import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { FeatureName } from './constant'
import { useNewData } from './useHooks'

export default function NewDataSheet() {
  const { isOpen, onClose } = useNewData()
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New {FeatureName}</SheetTitle>
          <SheetDescription>
            Creat new {FeatureName} to track your transactions.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
