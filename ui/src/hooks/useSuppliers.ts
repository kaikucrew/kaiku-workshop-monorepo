import { useQuery } from '@tanstack/react-query'
import { supplierService } from '@/services'
import { queryKeys } from '@/lib/queryClient'
import type { Supplier } from '@/types'

/**
 * Hook to fetch all suppliers using TanStack React Query
 * Provides automatic caching, background refetching, and loading states
 * Suppliers are cached longer since they change less frequently
 * 
 * @returns Query result with suppliers data, loading state, and error
 */
export function useSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: queryKeys.suppliers,
    queryFn: async () => {
      return await supplierService.getAll()
    },
    staleTime: 1000 * 60 * 10 // 10 minutes - suppliers change less frequently
  })
}
