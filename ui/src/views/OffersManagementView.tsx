import React, { useState, useMemo } from 'react'
import type { Offer, OfferFormData } from '@/types'
import {
  useOffers,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  useSuppliers,
  useNotification,
} from '@/hooks'
import {
  OfferList,
  OfferForm,
  OfferDetail,
  SearchFilter,
  ConfirmDialog,
} from '@/components'
import './OffersManagementView.css'

type ViewMode = 'list' | 'create' | 'edit' | 'detail'

interface ViewState {
  mode: ViewMode
  selectedOffer?: Offer
}

/**
 * OffersManagementView - Main view component that integrates all offer management workflows
 * Handles list view, create, edit, delete, and detail view workflows
 * 
 * Requirements: All
 */
export const OffersManagementView: React.FC = () => {
  // State management
  const [viewState, setViewState] = useState<ViewState>({ mode: 'list' })
  const [searchQuery, setSearchQuery] = useState('')
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    offerId?: string
    offerTitle?: string
  }>({ open: false })

  // Hooks
  const { data: offers, isLoading: offersLoading, refetch: refetchOffers } = useOffers()
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers()
  const createOfferMutation = useCreateOffer()
  const updateOfferMutation = useUpdateOffer()
  const deleteOfferMutation = useDeleteOffer()
  const { showSuccess, showError } = useNotification()

  // Filter offers based on search and supplier filter
  const filteredOffers = useMemo(() => {
    if (!offers) return []

    let result = offers

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (offer) =>
          offer.title.toLowerCase().includes(query) ||
          offer.description.toLowerCase().includes(query)
      )
    }

    // Apply supplier filter
    if (supplierFilter) {
      result = result.filter((offer) => offer.supplierId === supplierFilter)
    }

    return result
  }, [offers, searchQuery, supplierFilter])

  // ============================================================================
  // View Navigation Handlers
  // ============================================================================

  const handleShowCreateForm = () => {
    setViewState({ mode: 'create' })
  }

  const handleShowEditForm = (offer: Offer) => {
    setViewState({ mode: 'edit', selectedOffer: offer })
  }

  const handleShowDetail = (offer: Offer) => {
    setViewState({ mode: 'detail', selectedOffer: offer })
  }

  const handleBackToList = () => {
    setViewState({ mode: 'list' })
  }

  // ============================================================================
  // Create Offer Workflow (Task 10.3)
  // ============================================================================

  const handleCreateOffer = async (data: OfferFormData) => {
    try {
      await createOfferMutation.mutateAsync(data)
      showSuccess('Offer created successfully')
      handleBackToList()
      refetchOffers()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create offer'
      showError(errorMessage)
      throw error
    }
  }

  // ============================================================================
  // Edit Offer Workflow (Task 10.4)
  // ============================================================================

  const handleUpdateOffer = async (data: OfferFormData) => {
    if (!viewState.selectedOffer) return

    try {
      await updateOfferMutation.mutateAsync({
        id: viewState.selectedOffer.id,
        data,
      })
      showSuccess('Offer updated successfully')
      handleBackToList()
      refetchOffers()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update offer'
      showError(errorMessage)
      throw error
    }
  }

  // ============================================================================
  // Delete Offer Workflow (Task 10.5)
  // ============================================================================

  const handleDeleteClick = (offerId: string) => {
    const offer = offers?.find((o) => o.id === offerId)
    setDeleteDialog({
      open: true,
      offerId,
      offerTitle: offer?.title || 'this offer',
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.offerId) return

    try {
      await deleteOfferMutation.mutateAsync(deleteDialog.offerId)
      showSuccess('Offer deleted successfully')
      setDeleteDialog({ open: false })
      handleBackToList()
      refetchOffers()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete offer'
      showError(errorMessage)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false })
  }

  // ============================================================================
  // Detail View Workflow (Task 10.6)
  // ============================================================================

  const handleDetailEdit = () => {
    if (viewState.selectedOffer) {
      handleShowEditForm(viewState.selectedOffer)
    }
  }

  const handleDetailDelete = () => {
    if (viewState.selectedOffer) {
      handleDeleteClick(viewState.selectedOffer.id)
    }
  }

  // ============================================================================
  // Search and Filter Handlers (Task 10.2)
  // ============================================================================

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSupplierFilter = (supplierId: string | null) => {
    setSupplierFilter(supplierId)
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="offers-management-view">
      {/* List View with Search/Filter (Task 10.2) */}
      {viewState.mode === 'list' && (
        <>
          <div className="offers-management-view__header">
            <h2 className="offers-management-view__title">All Offers</h2>
            <button
              className="offers-management-view__create-button"
              onClick={handleShowCreateForm}
            >
              + Create Offer
            </button>
          </div>

          <SearchFilter
            onSearchChange={handleSearchChange}
            onSupplierFilter={handleSupplierFilter}
            suppliers={suppliers || []}
            suppliersLoading={suppliersLoading}
          />

          {filteredOffers.length === 0 && !offersLoading && offers && offers.length > 0 && (
            <div className="offers-management-view__no-results">
              <p>No offers match your search criteria.</p>
            </div>
          )}

          <OfferList
            offers={filteredOffers}
            onEdit={handleShowEditForm}
            onDelete={handleDeleteClick}
            onView={handleShowDetail}
            loading={offersLoading}
          />
        </>
      )}

      {/* Create Offer Form (Task 10.3) */}
      {viewState.mode === 'create' && (
        <div className="offers-management-view__modal">
          <OfferForm
            suppliers={suppliers || []}
            onSubmit={handleCreateOffer}
            onCancel={handleBackToList}
            loading={createOfferMutation.isPending}
            suppliersLoading={suppliersLoading}
          />
        </div>
      )}

      {/* Edit Offer Form (Task 10.4) */}
      {viewState.mode === 'edit' && viewState.selectedOffer && (
        <div className="offers-management-view__modal">
          <OfferForm
            offer={viewState.selectedOffer}
            suppliers={suppliers || []}
            onSubmit={handleUpdateOffer}
            onCancel={handleBackToList}
            loading={updateOfferMutation.isPending}
            suppliersLoading={suppliersLoading}
          />
        </div>
      )}

      {/* Offer Detail View (Task 10.6) */}
      {viewState.mode === 'detail' && viewState.selectedOffer && (
        <OfferDetail
          offer={viewState.selectedOffer}
          onClose={handleBackToList}
          onEdit={handleDetailEdit}
          onDelete={handleDetailDelete}
          loading={deleteOfferMutation.isPending}
        />
      )}

      {/* Delete Confirmation Dialog (Task 10.5) */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Offer"
        message={`Are you sure you want to delete "${deleteDialog.offerTitle}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteOfferMutation.isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
