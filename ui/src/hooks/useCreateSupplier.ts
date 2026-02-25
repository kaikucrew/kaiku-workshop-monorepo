import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supplierService } from '@/services'
import { queryKeys } from '@/lib/queryClient'
import type { CreateSupplierData, Supplier } from '@/types'

export function useCreateSupplier() {
  const queryClient = useQueryClient()

  return useMutation<Supplier, Error, CreateSupplierData>({
    mutationFn: async (data: CreateSupplierData) => {
      return await supplierService.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers })
    }
  })
}
