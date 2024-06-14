import { InferRequestType, InferResponseType } from 'hono'
import { client } from '@/lib/hono'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { toast } from 'sonner'

import { FeatureName } from './constant'
import { NewDataState } from '../types'

export const useGetData = () => {
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

export const useNewData = create<NewDataState>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
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
      toast.success('Account created')
      queryClient.invalidateQueries({ queryKey: [FeatureName] })
    },
    onError: () => {
      toast.error('Failed to create account')
    },
  })
  return mutation
}
