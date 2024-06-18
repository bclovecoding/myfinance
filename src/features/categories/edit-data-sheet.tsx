import { Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import useConfirm from '@/hook/use-confirm'

import { OneData } from './constant'
import { useOpenData, useGetData, useEditData, useDeleteData } from './useHooks'
import DataForm, { type FormValues } from './data-form'

export default function EditDataSheet() {
  const [ConfirmDlg, confirm] = useConfirm(
    'Confirm',
    `Are you sure to delete this ${OneData}?`
  )
  const { id, isOpen, onClose } = useOpenData()
  const dataQuery = useGetData(id)
  const editMutaion = useEditData(id)
  const delMutaion = useDeleteData(id)

  const isLoading = dataQuery.isLoading
  const isPending = editMutaion.isPending || delMutaion.isPending

  const onSubmit = (values: FormValues) => {
    editMutaion.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }
  const onDelete = async () => {
    const isOk = await confirm()
    if (isOk) {
      delMutaion.mutate(undefined, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }
  const defaultValues = dataQuery.data
    ? {
        name: dataQuery.data.name,
      }
    : {
        name: '',
      }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="capitalize">Edit {OneData}</SheetTitle>
            <SheetDescription>Edit existing {OneData}</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex-center">
              <Loader2 className="size-8 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <DataForm
              id={dataQuery.data?.id}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isPending}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDlg />
    </>
  )
}
