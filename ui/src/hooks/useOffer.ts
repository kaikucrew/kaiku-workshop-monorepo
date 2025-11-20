import { useQuery } from '@tanstack/react-query'
import { offerService } from '@/services'
import { queryKeys } from '@/lib/queryClient'
import type { Offer } from '@/types'

/**
 * Hook to fetch a single offer by ID using TanStack React Query
 * Provides automatic caching and loading states
 * 
 * @param id - Offer ID to fetch
 * @returns Query result with offer data, loading state, and error
 */
export function useOffer(id: string) {
  return useQuery<Offer>({
    queryKey: queryKeys.offer(id),
    queryFn: async () => {
      return await offerService.getById(id)
    },
    enabled: !!id // Only run query if ID is provided
  })
}
