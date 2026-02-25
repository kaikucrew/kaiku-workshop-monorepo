import React from 'react'
import { useForm } from 'react-hook-form'
import type { CreateSupplierData } from '@/types'
import './SupplierForm.css'

interface SupplierFormProps {
  onSubmit: (data: CreateSupplierData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateSupplierData>({ mode: 'onBlur' })

  return (
    <div className="offer-form-container">
      <div className="offer-form">
        <div className="offer-form__header">
          <h2 className="offer-form__title">Create New Supplier</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="offer-form__body">
            <div className="form-field">
              <label htmlFor="name" className="form-field__label">
                Name <span className="form-field__required">*</span>
              </label>
              <input
                id="name"
                type="text"
                className={`form-field__input ${errors.name ? 'form-field__input--error' : ''}`}
                {...register('name', {
                  required: 'Name is required',
                  maxLength: { value: 200, message: 'Name must not exceed 200 characters' },
                })}
                disabled={loading}
                aria-invalid={errors.name ? 'true' : 'false'}
              />
              {errors.name && (
                <span className="form-field__error" role="alert">{errors.name.message}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-field__label">
                Email <span className="form-field__required">*</span>
              </label>
              <input
                id="email"
                type="email"
                className={`form-field__input ${errors.email ? 'form-field__input--error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                })}
                disabled={loading}
                aria-invalid={errors.email ? 'true' : 'false'}
              />
              {errors.email && (
                <span className="form-field__error" role="alert">{errors.email.message}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="phone" className="form-field__label">Phone</label>
              <input
                id="phone"
                type="tel"
                className="form-field__input"
                {...register('phone')}
                disabled={loading}
              />
            </div>
          </div>

          <div className="offer-form__footer">
            <button
              type="button"
              className="offer-form__button offer-form__button--cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="offer-form__button offer-form__button--submit"
              disabled={loading || !isValid}
            >
              {loading ? 'Creating...' : 'Create Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
