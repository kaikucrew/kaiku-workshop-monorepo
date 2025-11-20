import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OfferList } from '@/components/OfferList'
import type { Offer } from '@/types'

describe('OfferList Component', () => {
  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Test Offer 1',
      description: 'Description 1',
      price: 99.99,
      supplierId: 's1',
      supplierName: 'Supplier 1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Test Offer 2',
      description: 'Description 2',
      price: 49.99,
      supplierId: 's2',
      supplierName: 'Supplier 2',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ]

  const mockHandlers = {
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  }

  it('should display loading state when loading is true', () => {
    render(
      <OfferList
        offers={[]}
        loading={true}
        {...mockHandlers}
      />
    )

    expect(screen.getByText('Loading offers...')).toBeInTheDocument()
  })

  it('should display empty state when offers array is empty', () => {
    render(
      <OfferList
        offers={[]}
        loading={false}
        {...mockHandlers}
      />
    )

    expect(screen.getByText('No offers available')).toBeInTheDocument()
  })

  it('should render all offers with required fields', () => {
    render(
      <OfferList
        offers={mockOffers}
        loading={false}
        {...mockHandlers}
      />
    )

    // Check that both offers are rendered
    expect(screen.getByText('Test Offer 1')).toBeInTheDocument()
    expect(screen.getByText('Test Offer 2')).toBeInTheDocument()
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('Description 2')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('$49.99')).toBeInTheDocument()
    expect(screen.getByText('Supplier 1')).toBeInTheDocument()
    expect(screen.getByText('Supplier 2')).toBeInTheDocument()
  })

  it('should render action buttons for each offer', () => {
    render(
      <OfferList
        offers={mockOffers}
        loading={false}
        {...mockHandlers}
      />
    )

    // Each offer should have View, Edit, and Delete buttons
    const viewButtons = screen.getAllByText('View')
    const editButtons = screen.getAllByText('Edit')
    const deleteButtons = screen.getAllByText('Delete')

    expect(viewButtons).toHaveLength(2)
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })
})
