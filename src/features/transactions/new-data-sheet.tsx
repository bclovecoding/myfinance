import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { OneData } from './constant'
import { useNewData, useCreateData } from './useHooks'
import DataForm, { type FormValues, ApiFormValues } from './data-form'

import OptionsUtils from '@/features/options'
import Loader from '@/components/loader'

export default function NewDataSheet() {
  const mutaion = useCreateData()
  const { isOpen, onClose } = useNewData()

  const {
    accountQuery,
    accountMutation,
    onCreateAccount,
    accountOptions,
    categoryQuery,
    categoryMutation,
    onCreateCategory,
    categoryOptions,
  } = OptionsUtils()

  const onSubmit = (values: ApiFormValues) => {
    mutaion.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const isPending =
    mutaion.isPending || accountMutation.isPending || categoryMutation.isPending

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New {OneData}</SheetTitle>
          <SheetDescription>Add new {OneData}.</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <Loader />
        ) : (
          <DataForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
            defaultValues={undefined}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
