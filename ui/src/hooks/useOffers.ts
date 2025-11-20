import { useQuery } from '@tanstack/react-query'
import { offerService } from '@/services'
import { queryKeys } from '@/lib/queryClient'
import type { Offer } from '@/types'

/**
 * Hook to fetch all offers using TanStack React Query
 * Provides automatic caching, background refetching, and loading states
 * 
 * @returns Query result with offers data, loading state, and error
 */
export function useOffers() {
  return useQuery<Offer[]>({
    queryKey: queryKeys.offers,
    queryFn: async () => {
      return await offerService.getAll()
    }
  })
}
