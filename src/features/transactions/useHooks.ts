import { InferRequestType, InferResponseType } from 'hono'
import { client } from '@/lib/hono'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { toast } from 'sonner'

import { useSearchParams } from 'next/navigation'

import { FeatureName, OneData } from './constant'
import { convertAmountFromMiliunits } from '@/lib/utils'

export const useGetDataList = () => {
  const params = useSearchParams()
  const from = params.get('from') || ''
  const to = params.get('to') || ''
  const accountId = params.get('accountId') || ''
  const query = useQuery({
    queryKey: [FeatureName],
    queryFn: async () => {
      const resp = await client.api[FeatureName].$get({
        query: {
          from,
          to,
          accountId,
        },
      })
      if (!resp.ok) {
        throw new Error(`Fail to fetch ${FeatureName}`)
      }
      const { data } = await resp.json()

      return data.map((trans) => ({
        ...trans,
        amount: convertAmountFromMiliunits(trans.amount),
      }))
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
      return { ...data, amount: convertAmountFromMiliunits(data.amount) }
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

type CreateRespType = InferResponseType<typeof client.api.transactions.$post>
type CreateReqType = InferRequestType<
  typeof client.api.transactions.$post
>['json']

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
  (typeof client.api.transactions)['bulk-delete']['$post']
>
type BulkDeleteReqType = InferRequestType<
  (typeof client.api.transactions)['bulk-delete']['$post']
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
  (typeof client.api.transactions)[':id']['$patch']
>
type EditReqType = InferRequestType<
  (typeof client.api.transactions)[':id']['$patch']
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
      //TODO: Invalidate summary
    },
    onError: () => {
      toast.error(`Failed to update ${OneData}`)
    },
  })
  return mutation
}

type DeleteRespType = InferResponseType<
  (typeof client.api.transactions)[':id']['$delete']
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
      //TODO: Invalidate summary
    },
    onError: () => {
      toast.error(`Failed to delete ${OneData}`)
    },
  })
  return mutation
}
