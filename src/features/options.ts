'use client'
import { type SelectOption } from '@/components/select'
import {
  useGetDataList as useGetCategories,
  useCreateData as useCreateCategory,
} from '@/features/categories/use-hooks'

import {
  useGetDataList as useGetAccounts,
  useCreateData as useCreateAccount,
} from '@/features/accounts/use-hooks'

export default function OptionsUtils() {
  const categoryQuery = useGetCategories()
  const categoryMutation = useCreateCategory()
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name })
  const categoryOptions: SelectOption[] = (categoryQuery.data ?? []).map(
    (category) => ({
      label: category.name,
      value: category.id,
    })
  )

  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) => accountMutation.mutate({ name })
  const accountOptions: SelectOption[] = (accountQuery.data ?? []).map(
    (account) => ({
      label: account.name,
      value: account.id,
    })
  )

  return {
    accountQuery,
    accountMutation,
    onCreateAccount,
    accountOptions,
    categoryQuery,
    categoryMutation,
    onCreateCategory,
    categoryOptions,
  }
}
