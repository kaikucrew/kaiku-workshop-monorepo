import { useMutation, useQueryClient } from '@tanstack/react-query'
import { offerService } from '@/services'
import { queryKeys } from '@/lib/queryClient'

/**
 * Hook to delete an offer using TanStack React Query mutation
 * Automatically invalidates the offers list cache on success
 * 
 * @returns Mutation result with mutate function, loading state, and error
 */
export function useDeleteOffer() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      return await offerService.delete(id)
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch offers list
      queryClient.invalidateQueries({ queryKey: queryKeys.offers })
      // Remove specific offer from cache
      queryClient.removeQueries({ queryKey: queryKeys.offer(id) })
    }
  })
}
