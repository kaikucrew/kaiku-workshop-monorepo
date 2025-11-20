import type { Offer } from '@/types'
import './OfferList.css'

export interface OfferListProps {
  offers: Offer[]
  onEdit: (offer: Offer) => void
  onDelete: (offerId: string) => void
  onView: (offer: Offer) => void
  loading: boolean
}

/**
 * OfferList component displays all offers in a responsive grid layout
 * Handles loading states, empty states, and user interactions
 */
export function OfferList({
  offers,
  onEdit,
  onDelete,
  onView,
  loading
}: OfferListProps) {
  // Loading state
  if (loading) {
    return (
      <div className="offer-list-container">
        <div className="offer-list-loading">
          <div className="spinner" />
          <p>Loading offers...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (offers.length === 0) {
    return (
      <div className="offer-list-container">
        <div className="offer-list-empty">
          <p>No offers available</p>
        </div>
      </div>
    )
  }

  // Render offers grid
  return (
    <div className="offer-list-container">
      <div className="offer-list-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-card-content">
              <h3 className="offer-card-title">{offer.title}</h3>
              <p className="offer-card-description">{offer.description}</p>
              <div className="offer-card-details">
                <span className="offer-card-price">
                  ${offer.price.toFixed(2)}
                </span>
                <span className="offer-card-supplier">{offer.supplierName}</span>
              </div>
            </div>
            <div className="offer-card-actions">
              <button
                className="offer-card-button offer-card-button-view"
                onClick={() => onView(offer)}
                aria-label={`View ${offer.title}`}
              >
                View
              </button>
              <button
                className="offer-card-button offer-card-button-edit"
                onClick={() => onEdit(offer)}
                aria-label={`Edit ${offer.title}`}
              >
                Edit
              </button>
              <button
                className="offer-card-button offer-card-button-delete"
                onClick={() => onDelete(offer.id)}
                aria-label={`Delete ${offer.title}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
