import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Offer, OfferFormData, Supplier } from '@/types'
import { validationService } from '@/services'
import './OfferForm.css'

interface OfferFormProps {
  offer?: Offer
  suppliers: Supplier[]
  onSubmit: (data: OfferFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  suppliersLoading?: boolean
}

/**
 * OfferForm component for creating or editing offers
 * Supports both create and edit modes with real-time validation
 * 
 * Requirements: 2.1, 3.1, 6.1, 7.1-7.6
 */
export const OfferForm: React.FC<OfferFormProps> = ({
  offer,
  suppliers,
  onSubmit,
  onCancel,
  loading = false,
  suppliersLoading = false,
}) => {
  const isEditMode = !!offer

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm<OfferFormData>({
    mode: 'onBlur',
    defaultValues: {
      title: offer?.title || '',
      description: offer?.description || '',
      price: offer?.price || 0,
      supplierId: offer?.supplierId || '',
    },
  })

  // Watch all fields for validation
  const formValues = watch()

  // Pre-fill form in edit mode
  useEffect(() => {
    if (offer) {
      setValue('title', offer.title)
      setValue('description', offer.description)
      setValue('price', offer.price)
      setValue('supplierId', offer.supplierId)
    }
  }, [offer, setValue])

  const handleFormSubmit = async (data: OfferFormData) => {
    // Final validation before submit
    const validationErrors = validationService.validateOfferForm(data)
    if (validationService.hasErrors(validationErrors)) {
      return
    }

    await onSubmit(data)
  }

  const handleCancel = () => {
    if (!loading) {
      onCancel()
    }
  }

  return (
    <div className="offer-form-container">
      <div className="offer-form">
        <div className="offer-form__header">
          <h2 className="offer-form__title">
            {isEditMode ? 'Edit Offer' : 'Create New Offer'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <div className="offer-form__body">
            {/* Title Field */}
            <div className="form-field">
              <label htmlFor="title" className="form-field__label">
                Title <span className="form-field__required">*</span>
              </label>
              <input
                id="title"
                type="text"
                className={`form-field__input ${errors.title ? 'form-field__input--error' : ''}`}
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 200,
                    message: 'Title must not exceed 200 characters',
                  },
                  validate: (value) => validationService.validateTitle(value) || true,
                  onBlur: () => trigger('title'),
                })}
                disabled={loading}
                aria-invalid={errors.title ? 'true' : 'false'}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <span id="title-error" className="form-field__error" role="alert">
                  {errors.title.message}
                </span>
              )}
              <span className="form-field__hint">
                {formValues.title?.length || 0}/200 characters
              </span>
            </div>

            {/* Description Field */}
            <div className="form-field">
              <label htmlFor="description" className="form-field__label">
                Description <span className="form-field__required">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                className={`form-field__textarea ${errors.description ? 'form-field__input--error' : ''}`}
                {...register('description', {
                  required: 'Description is required',
                  maxLength: {
                    value: 1000,
                    message: 'Description must not exceed 1000 characters',
                  },
                  validate: (value) => validationService.validateDescription(value) || true,
                  onBlur: () => trigger('description'),
                })}
                disabled={loading}
                aria-invalid={errors.description ? 'true' : 'false'}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <span id="description-error" className="form-field__error" role="alert">
                  {errors.description.message}
                </span>
              )}
              <span className="form-field__hint">
                {formValues.description?.length || 0}/1000 characters
              </span>
            </div>

            {/* Price Field */}
            <div className="form-field">
              <label htmlFor="price" className="form-field__label">
                Price <span className="form-field__required">*</span>
              </label>
              <div className="form-field__input-group">
                <span className="form-field__prefix">$</span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-field__input form-field__input--with-prefix ${errors.price ? 'form-field__input--error' : ''}`}
                  {...register('price', {
                    required: 'Price is required',
                    valueAsNumber: true,
                    validate: (value) => validationService.validatePrice(value) || true,
                    onBlur: () => trigger('price'),
                  })}
                  disabled={loading}
                  aria-invalid={errors.price ? 'true' : 'false'}
                  aria-describedby={errors.price ? 'price-error' : undefined}
                />
              </div>
              {errors.price && (
                <span id="price-error" className="form-field__error" role="alert">
                  {errors.price.message}
                </span>
              )}
            </div>

            {/* Supplier Dropdown */}
            <div className="form-field">
              <label htmlFor="supplierId" className="form-field__label">
                Supplier <span className="form-field__required">*</span>
              </label>
              {suppliersLoading ? (
                <div className="form-field__loading">
                  <span className="form-field__spinner" aria-hidden="true" />
                  <span>Loading suppliers...</span>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="form-field__empty">
                  No suppliers available. Please add suppliers first.
                </div>
              ) : (
                <select
                  id="supplierId"
                  className={`form-field__select ${errors.supplierId ? 'form-field__input--error' : ''}`}
                  {...register('supplierId', {
                    required: 'Supplier is required',
                    validate: (value) => validationService.validateSupplier(value) || true,
                    onBlur: () => trigger('supplierId'),
                  })}
                  disabled={loading}
                  aria-invalid={errors.supplierId ? 'true' : 'false'}
                  aria-describedby={errors.supplierId ? 'supplierId-error' : undefined}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.supplierId && (
                <span id="supplierId-error" className="form-field__error" role="alert">
                  {errors.supplierId.message}
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="offer-form__footer">
            <button
              type="button"
              className="offer-form__button offer-form__button--cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="offer-form__button offer-form__button--submit"
              disabled={loading || !isValid || suppliers.length === 0}
            >
              {loading ? (
                <>
                  <span className="offer-form__spinner" aria-hidden="true" />
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{isEditMode ? 'Update Offer' : 'Create Offer'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
