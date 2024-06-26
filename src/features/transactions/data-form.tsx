import { z } from 'zod'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { InsertTransactionSchema } from '@/db/schema'

import { convertAmountToMiliunits } from '@/lib/utils'

import { OneData } from './constant'
import { type SelectOption, Select } from '@/components/select'
import DatePicker from '@/components/date-picker'
import { Textarea } from '@/components/ui/textarea'
import AmountInput from '@/components/amount-input'

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
})

const apiSchema = InsertTransactionSchema.omit({
  id: true,
})

export type FormValues = z.input<typeof formSchema>
export type ApiFormValues = z.input<typeof apiSchema>

type Props = {
  id?: string
  defaultValues?: FormValues
  onSubmit: (values: ApiFormValues) => void
  onDelete?: () => void
  disabled?: boolean
  accountOptions: SelectOption[]
  categoryOptions: SelectOption[]
  onCreateAccount: (name: string) => void
  onCreateCategory: (name: string) => void
}

export default function DataForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount)
    const amountInMiliunits = convertAmountToMiliunits(amount)
    onSubmit({
      ...values,
      amount: amountInMiliunits,
    })
  }

  const handleDelete = () => {
    onDelete?.()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  placeholder="Select an account"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  placeholder="Select a category"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  disabled={disabled}
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  disabled={disabled}
                  placeholder="Add some notes"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled}>
          {id ? 'Save Changes' : `Create ${OneData}`}
        </Button>
        {id && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete {OneData}
          </Button>
        )}
      </form>
    </Form>
  )
}
