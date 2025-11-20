import React, { useState } from 'react'
import { NotificationContainer } from './Notification'
import { ConfirmDialog } from './ConfirmDialog'
import { OfferForm } from './OfferForm'
import { OfferList } from './OfferList'
import { useNotification } from '../hooks/useNotification'
import type { OfferFormData, Supplier, Offer } from '@/types'

/**
 * Demo component to showcase Notification and ConfirmDialog components
 * This is for development/testing purposes only
 */
export const ComponentsDemo: React.FC = () => {
  const { notifications, showSuccess, showError, showInfo, dismissNotification } = useNotification()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [editOffer, setEditOffer] = useState<Offer | undefined>(undefined)
  const [offersLoading, setOffersLoading] = useState(false)

  // Mock suppliers data
  const mockSuppliers: Supplier[] = [
    { id: '1', name: 'Acme Corp', email: 'contact@acme.com', createdAt: new Date().toISOString() },
    { id: '2', name: 'Global Supplies Inc', email: 'info@globalsupplies.com', createdAt: new Date().toISOString() },
    { id: '3', name: 'Tech Solutions Ltd', email: 'sales@techsolutions.com', createdAt: new Date().toISOString() },
  ]

  // Mock offers data
  const mockOffers: Offer[] = [
    {
      id: '1',
      title: 'Premium Widget',
      description: 'A high-quality widget with advanced features and excellent durability',
      price: 99.99,
      supplierId: '1',
      supplierName: 'Acme Corp',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Standard Gadget',
      description: 'An affordable gadget perfect for everyday use',
      price: 49.99,
      supplierId: '2',
      supplierName: 'Global Supplies Inc',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Deluxe Tool Set',
      description: 'Complete tool set with everything you need for professional work',
      price: 199.99,
      supplierId: '3',
      supplierName: 'Tech Solutions Ltd',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  // Mock offer for edit mode
  const mockOffer: Offer = mockOffers[0]

  const handleShowSuccess = () => {
    showSuccess('Operation completed successfully!')
  }

  const handleShowError = () => {
    showError('An error occurred while processing your request.')
  }

  const handleShowInfo = () => {
    showInfo('This is an informational message.')
  }

  const handleShowCustomDuration = () => {
    showSuccess('This notification will dismiss in 10 seconds', 10000)
  }

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    setDialogLoading(true)
    // Simulate async operation
    setTimeout(() => {
      setDialogLoading(false)
      setDialogOpen(false)
      showSuccess('Action confirmed and completed!')
    }, 2000)
  }

  const handleCancel = () => {
    setDialogOpen(false)
    showInfo('Action cancelled')
  }

  const handleOpenCreateForm = () => {
    setEditOffer(undefined)
    setFormOpen(true)
  }

  const handleOpenEditForm = () => {
    setEditOffer(mockOffer)
    setFormOpen(true)
  }

  const handleFormSubmit = async (data: OfferFormData) => {
    setFormLoading(true)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setFormLoading(false)
    setFormOpen(false)
    
    if (editOffer) {
      showSuccess(`Offer "${data.title}" updated successfully!`)
    } else {
      showSuccess(`Offer "${data.title}" created successfully!`)
    }
  }

  const handleFormCancel = () => {
    setFormOpen(false)
    showInfo('Form cancelled')
  }

  const handleViewOffer = (offer: Offer) => {
    showInfo(`Viewing offer: ${offer.title}`)
  }

  const handleEditOffer = (offer: Offer) => {
    setEditOffer(offer)
    setFormOpen(true)
  }

  const handleDeleteOffer = (offerId: string) => {
    const offer = mockOffers.find(o => o.id === offerId)
    showInfo(`Delete requested for offer: ${offer?.title}`)
    setDialogOpen(true)
  }

  const handleToggleLoading = () => {
    setOffersLoading(!offersLoading)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>UI Components Demo</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>Notification Component</h2>
        <p>Click the buttons below to show different types of notifications:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleShowSuccess}>Show Success</button>
          <button onClick={handleShowError}>Show Error</button>
          <button onClick={handleShowInfo}>Show Info</button>
          <button onClick={handleShowCustomDuration}>Show Custom Duration (10s)</button>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Confirm Dialog Component</h2>
        <p>Click the button below to open a confirmation dialog:</p>
        <button onClick={handleOpenDialog}>Open Confirm Dialog</button>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Offer Form Component</h2>
        <p>Click the buttons below to open the offer form in different modes:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleOpenCreateForm}>Create New Offer</button>
          <button onClick={handleOpenEditForm}>Edit Existing Offer</button>
        </div>
      </section>

      <section>
        <h2>Offer List Component</h2>
        <p>Responsive grid layout with loading and empty states:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button onClick={handleToggleLoading}>
            {offersLoading ? 'Hide Loading State' : 'Show Loading State'}
          </button>
        </div>
        <OfferList
          offers={offersLoading ? [] : mockOffers}
          onView={handleViewOffer}
          onEdit={handleEditOffer}
          onDelete={handleDeleteOffer}
          loading={offersLoading}
        />
      </section>

      <NotificationContainer 
        notifications={notifications}
        onClose={dismissNotification}
      />

      <ConfirmDialog
        open={dialogOpen}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action? This cannot be undone."
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        loading={dialogLoading}
      />

      {formOpen && (
        <OfferForm
          offer={editOffer}
          suppliers={mockSuppliers}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
          suppliersLoading={false}
        />
      )}
    </div>
  )
}
