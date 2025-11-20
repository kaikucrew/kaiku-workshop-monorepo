import React, { useState } from 'react'
import { OfferDetail } from './OfferDetail'
import type { Offer } from '@/types'

/**
 * Example usage of OfferDetail component
 * Demonstrates how to integrate the component with offer data
 */
export const OfferDetailExample: React.FC = () => {
  const [showDetail, setShowDetail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Example offer data
  const exampleOffer: Offer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
    price: 299.99,
    supplierId: 'supplier-1',
    supplierName: 'TechGear Inc.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  }

  const handleClose = () => {
    setShowDetail(false)
  }

  const handleEdit = () => {
    console.log('Edit offer:', exampleOffer.id)
    // In real app, this would open the OfferForm in edit mode
  }

  const handleDelete = () => {
    console.log('Delete offer:', exampleOffer.id)
    // In real app, this would show a confirmation dialog
  }

  const simulateLoading = () => {
    setIsLoading(true)
    setShowDetail(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>OfferDetail Component Example</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={() => setShowDetail(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Show Offer Detail
        </button>

        <button
          onClick={simulateLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Show with Loading State
        </button>
      </div>

      {showDetail && (
        <OfferDetail
          offer={isLoading ? undefined : exampleOffer}
          onClose={handleClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
