import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import useConfirm from '@/hook/use-confirm'
import Loader from '@/components/loader'

import OptionsUtils from '@/features/options'

import { OneData } from './constant'
import {
  useOpenData,
  useGetData,
  useEditData,
  useDeleteData,
} from './use-hooks'
import DataForm, { type FormValues, type ApiFormValues } from './data-form'

export default function EditDataSheet() {
  const [ConfirmDlg, confirm] = useConfirm(
    'Confirm',
    `Are you sure to delete this ${OneData}?`
  )
  const { id, isOpen, onClose } = useOpenData()
  const dataQuery = useGetData(id)
  const editMutaion = useEditData(id)
  const delMutaion = useDeleteData(id)

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

  const isLoading =
    dataQuery.isLoading || accountQuery.isLoading || categoryQuery.isLoading
  const isPending =
    editMutaion.isPending ||
    delMutaion.isPending ||
    accountMutation.isPending ||
    categoryMutation.isPending

  const onSubmit = (values: ApiFormValues) => {
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
  const defaultValues: FormValues = dataQuery.data
    ? {
        date: new Date(dataQuery.data.date),
        accountId: dataQuery.data.accountId,
        amount: dataQuery.data.amount.toString(),
        payee: dataQuery.data.payee,
        categoryId: dataQuery.data.categoryId,
        notes: dataQuery.data.notes,
      }
    : {
        date: new Date(),
        accountId: '',
        amount: '0',
        payee: '',
        categoryId: undefined,
        notes: undefined,
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
            <Loader />
          ) : (
            <DataForm
              id={dataQuery.data?.id}
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
      <ConfirmDlg />
    </>
  )
}
