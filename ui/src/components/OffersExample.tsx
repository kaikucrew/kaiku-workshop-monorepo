import { useOffers, useCreateOffer, useDeleteOffer } from '@/hooks'

/**
 * Example component demonstrating TanStack React Query hooks usage
 * This shows the pattern for using the hooks in components
 */
export function OffersExample() {
  const { data: offers, isLoading, error } = useOffers()
  const createMutation = useCreateOffer()
  const deleteMutation = useDeleteOffer()

  if (isLoading) {
    return <div>Loading offers...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const handleCreate = () => {
    createMutation.mutate({
      title: 'New Offer',
      description: 'Test offer',
      price: 99.99,
      supplierId: 'test-supplier-id'
    })
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  return (
    <div>
      <h2>Offers ({offers?.length || 0})</h2>
      <button onClick={handleCreate} disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create Offer'}
      </button>
      
      <ul>
        {offers?.map((offer) => (
          <li key={offer.id}>
            {offer.title} - ${offer.price}
            <button 
              onClick={() => handleDelete(offer.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
