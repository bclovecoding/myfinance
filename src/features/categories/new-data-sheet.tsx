import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { OneData } from './constant'
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
          <SheetTitle>New {OneData}</SheetTitle>
          <SheetDescription>
            Creat new {OneData} to organize your transactions.
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
