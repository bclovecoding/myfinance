import { useState, useRef } from 'react'
import { InferRequestType, InferResponseType } from 'hono'
import { client } from '@/lib/hono'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { FeatureName, OneData } from './constant'
import { Select } from '@/components/select'

export const useGetDataList = () => {
  const query = useQuery({
    queryKey: [FeatureName],
    queryFn: async () => {
      const resp = await client.api[FeatureName].$get()
      if (!resp.ok) {
        throw new Error(`Fail to fetch ${FeatureName}`)
      }
      const { data } = await resp.json()
      return data
    },
  })

  return query
}

export const useGetData = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: [OneData, { id }],
    queryFn: async () => {
      const resp = await client.api[FeatureName][':id'].$get({
        param: { id },
      })
      if (!resp.ok) {
        throw new Error(`Fail to fetch ${OneData}`)
      }
      const { data } = await resp.json()
      return data
    },
  })

  return query
}

export const useNewData = create<NewDataState>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}))

export const useOpenData = create<OpenDataState>((set) => ({
  id: undefined,
  isOpen: false,
  onClose: () => set({ id: undefined, isOpen: false }),
  onOpen: (id: string) => set({ id, isOpen: true }),
}))

type CreateRespType = InferResponseType<typeof client.api.accounts.$post>
type CreateReqType = InferRequestType<typeof client.api.accounts.$post>['json']

export const useCreateData = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation<CreateRespType, Error, CreateReqType>({
    mutationFn: async (json) => {
      const resp = await client.api[FeatureName].$post({ json })
      return await resp.json()
    },
    onSuccess: () => {
      toast.success(`${OneData}  created`)
      queryClient.invalidateQueries({ queryKey: [FeatureName] })
    },
    onError: () => {
      toast.error(`Failed to create ${OneData}`)
    },
  })
  return mutation
}

type BulkDeleteRespType = InferResponseType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>
type BulkDeleteReqType = InferRequestType<
  (typeof client.api.accounts)['bulk-delete']['$post']
>['json']

export const useBulkDelete = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation<BulkDeleteRespType, Error, BulkDeleteReqType>({
    mutationFn: async (json) => {
      const resp = await client.api[FeatureName]['bulk-delete']['$post']({
        json,
      })
      return await resp.json()
    },
    onSuccess: () => {
      toast.success(`${FeatureName} deleted`)
      queryClient.invalidateQueries({ queryKey: [FeatureName] })
    },
    onError: () => {
      toast.error(`Failed to delete ${FeatureName}`)
    },
  })
  return mutation
}

type EditRespType = InferResponseType<
  (typeof client.api.accounts)[':id']['$patch']
>
type EditReqType = InferRequestType<
  (typeof client.api.accounts)[':id']['$patch']
>['json']

export const useEditData = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<EditRespType, Error, EditReqType>({
    mutationFn: async (json) => {
      const resp = await client.api[FeatureName][':id']['$patch']({
        param: { id },
        json,
      })
      return await resp.json()
    },
    onSuccess: () => {
      toast.success(`${OneData}  updated`)
      queryClient.invalidateQueries({ queryKey: [OneData, { id }] })
      queryClient.invalidateQueries({ queryKey: [FeatureName] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error(`Failed to update ${OneData}`)
    },
  })
  return mutation
}

type DeleteRespType = InferResponseType<
  (typeof client.api.accounts)[':id']['$delete']
>

export const useDeleteData = (id?: string) => {
  const queryClient = useQueryClient()
  const mutation = useMutation<DeleteRespType, Error>({
    mutationFn: async () => {
      const resp = await client.api[FeatureName][':id']['$delete']({
        param: { id },
      })
      return await resp.json()
    },
    onSuccess: () => {
      toast.success(`${OneData}  deleted`)
      queryClient.invalidateQueries({ queryKey: [OneData, { id }] })
      queryClient.invalidateQueries({ queryKey: [FeatureName] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
    onError: () => {
      toast.error(`Failed to delete ${OneData}`)
    },
  })
  return mutation
}

export const useSelectAccount = (): [
  () => JSX.Element,
  () => Promise<unknown>
] => {
  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void
  } | null>(null)

  const selectValue = useRef<string>()
  const accountQuery = useGetDataList()
  const accountMutation = useCreateData()

  const onCreateAccount = (name: string) => accountMutation.mutate({ name })
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }))

  const disabled = accountQuery.isLoading || accountMutation.isPending

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve })
    })

  const handleClose = () => {
    setPromise(null)
  }

  const handleConfirm = () => {
    promise?.resolve(selectValue.current)
    handleClose()
  }

  const handleCancel = () => {
    promise?.resolve(undefined)
    handleClose()
  }

  const ConfirmationDialog = () => {
    return (
      <Dialog open={promise !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select account</DialogTitle>
            <DialogDescription>
              Please select an account to continue.
            </DialogDescription>
          </DialogHeader>
          <Select
            options={accountOptions}
            onCreate={onCreateAccount}
            placeholder="Select an account"
            value={selectValue.current}
            onChange={(value) => (selectValue.current = value)}
            disabled={disabled}
          />
          <DialogFooter>
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="outline">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return [ConfirmationDialog, confirm]
}
