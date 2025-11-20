# TanStack React Query Hooks

This directory contains custom React hooks built with TanStack React Query for managing server state in the Offers Management UI.

## Overview

All data fetching and mutations use TanStack React Query for:
- Automatic caching and background refetching
- Loading and error state management
- Optimistic updates and cache invalidation
- Request deduplication

## Query Hooks

### `useOffers()`
Fetches all offers from the API.

```typescript
import { useOffers } from '@/hooks'

function MyComponent() {
  const { data: offers, isLoading, error, refetch } = useOffers()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {offers?.map(offer => (
        <div key={offer.id}>{offer.title}</div>
      ))}
    </div>
  )
}
```

### `useOffer(id: string)`
Fetches a single offer by ID.

```typescript
import { useOffer } from '@/hooks'

function OfferDetail({ offerId }: { offerId: string }) {
  const { data: offer, isLoading, error } = useOffer(offerId)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{offer?.title}</div>
}
```

### `useSuppliers()`
Fetches all suppliers from the API.

```typescript
import { useSuppliers } from '@/hooks'

function SupplierDropdown() {
  const { data: suppliers, isLoading } = useSuppliers()
  
  return (
    <select disabled={isLoading}>
      {suppliers?.map(supplier => (
        <option key={supplier.id} value={supplier.id}>
          {supplier.name}
        </option>
      ))}
    </select>
  )
}
```

## Mutation Hooks

### `useCreateOffer()`
Creates a new offer and automatically invalidates the offers list cache.

```typescript
import { useCreateOffer } from '@/hooks'

function CreateOfferForm() {
  const { mutate: createOffer, isPending, error } = useCreateOffer()
  
  const handleSubmit = (data: CreateOfferData) => {
    createOffer(data, {
      onSuccess: (newOffer) => {
        console.log('Created:', newOffer)
      },
      onError: (error) => {
        console.error('Failed:', error)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Offer'}
      </button>
    </form>
  )
}
```

### `useUpdateOffer()`
Updates an existing offer and invalidates relevant caches.

```typescript
import { useUpdateOffer } from '@/hooks'

function EditOfferForm({ offerId }: { offerId: string }) {
  const { mutate: updateOffer, isPending } = useUpdateOffer()
  
  const handleSubmit = (data: UpdateOfferData) => {
    updateOffer({ id: offerId, data }, {
      onSuccess: () => {
        console.log('Updated successfully')
      }
    })
  }
  
  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? 'Updating...' : 'Update Offer'}
    </button>
  )
}
```

### `useDeleteOffer()`
Deletes an offer and invalidates the offers list cache.

```typescript
import { useDeleteOffer } from '@/hooks'

function DeleteButton({ offerId }: { offerId: string }) {
  const { mutate: deleteOffer, isPending } = useDeleteOffer()
  
  const handleDelete = () => {
    if (confirm('Are you sure?')) {
      deleteOffer(offerId, {
        onSuccess: () => {
          console.log('Deleted successfully')
        }
      })
    }
  }
  
  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
```

## Query Keys

Query keys are centralized in `@/lib/queryClient.ts` for consistency:

```typescript
export const queryKeys = {
  offers: ['offers'],
  offer: (id: string) => ['offers', id],
  suppliers: ['suppliers'],
  supplier: (id: string) => ['suppliers', id]
}
```

## Cache Invalidation

Mutations automatically invalidate relevant caches:

- **Create Offer**: Invalidates `offers` list
- **Update Offer**: Invalidates `offers` list and specific `offer` detail
- **Delete Offer**: Invalidates `offers` list and removes specific `offer` from cache

## Configuration

The QueryClient is configured in `@/lib/queryClient.ts` with:

- **Stale Time**: 5 minutes (data considered fresh)
- **GC Time**: 10 minutes (unused data kept in cache)
- **Retry**: 1 attempt for queries, 0 for mutations
- **Refetch on Window Focus**: Disabled

## Error Handling

All hooks use the `ApiErrorException` class from the HTTP client, which provides:

- `message`: Human-readable error message
- `statusCode`: HTTP status code
- `error`: Error type
- `details`: Optional array of detailed error messages

```typescript
const { error } = useOffers()

if (error instanceof ApiErrorException) {
  console.log(error.message)
  console.log(error.statusCode)
  console.log(error.details)
}
```

## Best Practices

1. **Use the hooks at component level**: Don't call hooks conditionally
2. **Handle loading states**: Always show loading indicators
3. **Handle errors gracefully**: Display user-friendly error messages
4. **Use callbacks**: Leverage `onSuccess` and `onError` callbacks for side effects
5. **Avoid manual refetching**: Let React Query handle automatic refetching
6. **Use optimistic updates**: For better UX, update UI before server confirms

## Testing

When testing components that use these hooks, wrap them in a `QueryClientProvider`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
)

render(<MyComponent />, { wrapper })
```
