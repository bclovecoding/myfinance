import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { FeatureName } from './constant'
import { useNewData, useCreateData } from './use-hooks'
import DataForm, { type FormValues } from './data-form'

export default function NewDataSheet() {
  const mutaion = useCreateData()
  const { isOpen, onClose } = useNewData()

  const onSubmit = (values: FormValues) => {
    mutaion.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New {FeatureName}</SheetTitle>
          <SheetDescription>
            Creat new {FeatureName} to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <DataForm
          onSubmit={onSubmit}
          disabled={mutaion.isPending}
          defaultValues={{
            name: '',
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
