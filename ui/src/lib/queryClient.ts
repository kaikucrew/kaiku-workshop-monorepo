import { QueryClient } from '@tanstack/react-query'

/**
 * Create and configure TanStack React Query client
 * Provides default options for queries and mutations
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
})

/**
 * Query keys for consistent cache management
 */
export const queryKeys = {
  offers: ['offers'] as const,
  offer: (id: string) => ['offers', id] as const,
  suppliers: ['suppliers'] as const,
  supplier: (id: string) => ['suppliers', id] as const
}
