import { useMutation, useQueryClient } from '@tanstack/react-query'
import { offerService } from '@/services'
import { queryKeys } from '@/lib/queryClient'
import type { UpdateOfferData, Offer } from '@/types'

/**
 * Parameters for updating an offer
 */
interface UpdateOfferParams {
  id: string
  data: UpdateOfferData
}

/**
 * Hook to update an existing offer using TanStack React Query mutation
 * Automatically invalidates the offers list and specific offer cache on success
 * 
 * @returns Mutation result with mutate function, loading state, and error
 */
export function useUpdateOffer() {
  const queryClient = useQueryClient()

  return useMutation<Offer, Error, UpdateOfferParams>({
    mutationFn: async ({ id, data }: UpdateOfferParams) => {
      return await offerService.update(id, data)
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch offers list
      queryClient.invalidateQueries({ queryKey: queryKeys.offers })
      // Invalidate and refetch specific offer
      queryClient.invalidateQueries({ queryKey: queryKeys.offer(variables.id) })
    }
  })
}
