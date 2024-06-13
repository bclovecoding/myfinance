import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/hono'
import { create } from 'zustand'

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
