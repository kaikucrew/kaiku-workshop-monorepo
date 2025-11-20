import { useMutation, useQueryClient } from '@tanstack/react-query'
import { offerService } from '@/services'
import { queryKeys } from '@/lib/queryClient'
import type { CreateOfferData, Offer } from '@/types'

/**
 * Hook to create a new offer using TanStack React Query mutation
 * Automatically invalidates the offers list cache on success
 * 
 * @returns Mutation result with mutate function, loading state, and error
 */
export function useCreateOffer() {
  const queryClient = useQueryClient()

  return useMutation<Offer, Error, CreateOfferData>({
    mutationFn: async (data: CreateOfferData) => {
      return await offerService.create(data)
    },
    onSuccess: () => {
      // Invalidate and refetch offers list
      queryClient.invalidateQueries({ queryKey: queryKeys.offers })
    }
  })
}
