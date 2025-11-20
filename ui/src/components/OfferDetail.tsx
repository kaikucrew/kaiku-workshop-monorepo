import React from 'react'
import type { Offer } from '@/types'
import './OfferDetail.css'

interface OfferDetailProps {
  offer?: Offer
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  loading?: boolean
  isLoading?: boolean
}

/**
 * OfferDetail component displays detailed view of a single offer
 * Shows all offer fields including timestamps with proper formatting
 * Provides actions for edit, delete, and close
 * Handles loading state while fetching offer details
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */
export const OfferDetail: React.FC<OfferDetailProps> = ({
  offer,
  onClose,
  onEdit,
  onDelete,
  loading = false,
  isLoading = false,
}) => {
  // Format date to readable string
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Handle backdrop click to close
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !loading) {
      onClose()
    }
  }

  // Handle escape key to close
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [loading, onClose])

  // Prevent body scroll when detail view is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="offer-detail-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="offer-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-detail-title"
      >
        {/* Loading State */}
        {isLoading && (
          <>
            <div className="offer-detail__header">
              <h2 id="offer-detail-title" className="offer-detail__title">
                Offer Details
              </h2>
              <button
                type="button"
                className="offer-detail__close-button"
                onClick={onClose}
                aria-label="Close offer details"
              >
                ×
              </button>
            </div>
            <div className="offer-detail__body">
              <div className="offer-detail__loading">
                <div className="offer-detail__spinner" />
                <p className="offer-detail__loading-text">Loading offer details...</p>
              </div>
            </div>
          </>
        )}

        {/* Loaded Content */}
        {!isLoading && offer && (
          <>
            {/* Header */}
            <div className="offer-detail__header">
          <h2 id="offer-detail-title" className="offer-detail__title">
            Offer Details
          </h2>
          <button
            type="button"
            className="offer-detail__close-button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close offer details"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="offer-detail__body">
          {/* Title */}
          <div className="offer-detail__field">
            <label className="offer-detail__label">Title</label>
            <div className="offer-detail__value offer-detail__value--title">
              {offer.title}
            </div>
          </div>

          {/* Description */}
          <div className="offer-detail__field">
            <label className="offer-detail__label">Description</label>
            <div className="offer-detail__value offer-detail__value--description">
              {offer.description}
            </div>
          </div>

          {/* Price */}
          <div className="offer-detail__field">
            <label className="offer-detail__label">Price</label>
            <div className="offer-detail__value offer-detail__value--price">
              {formatCurrency(offer.price)}
            </div>
          </div>

          {/* Supplier */}
          <div className="offer-detail__field">
            <label className="offer-detail__label">Supplier</label>
            <div className="offer-detail__value">
              {offer.supplierName}
            </div>
          </div>

          {/* Timestamps */}
          <div className="offer-detail__timestamps">
            <div className="offer-detail__field">
              <label className="offer-detail__label">Created</label>
              <div className="offer-detail__value offer-detail__value--timestamp">
                {formatDate(offer.createdAt)}
              </div>
            </div>

            <div className="offer-detail__field">
              <label className="offer-detail__label">Last Updated</label>
              <div className="offer-detail__value offer-detail__value--timestamp">
                {formatDate(offer.updatedAt)}
              </div>
            </div>
          </div>

          {/* Offer ID (for reference) */}
          <div className="offer-detail__field">
            <label className="offer-detail__label">Offer ID</label>
            <div className="offer-detail__value offer-detail__value--id">
              {offer.id}
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="offer-detail__footer">
          <button
            type="button"
            className="offer-detail__button offer-detail__button--close"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
          <button
            type="button"
            className="offer-detail__button offer-detail__button--edit"
            onClick={onEdit}
            disabled={loading}
          >
            Edit
          </button>
          <button
            type="button"
            className="offer-detail__button offer-detail__button--delete"
            onClick={onDelete}
            disabled={loading}
          >
            Delete
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  )
}
