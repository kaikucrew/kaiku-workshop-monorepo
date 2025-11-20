import React, { useState, useEffect } from 'react'
import type { Supplier } from '@/types'
import './SearchFilter.css'

interface SearchFilterProps {
  onSearchChange: (query: string) => void
  onSupplierFilter: (supplierId: string | null) => void
  suppliers: Supplier[]
  suppliersLoading?: boolean
}

/**
 * SearchFilter component provides search and filter functionality
 * Includes debounced search input and supplier filter dropdown
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  onSupplierFilter,
  suppliers,
  suppliersLoading = false,
}) => {
  const [searchText, setSearchText] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<string>('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchText)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchText, onSearchChange])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedSupplier(value)
    onSupplierFilter(value || null)
  }

  const handleClearFilters = () => {
    setSearchText('')
    setSelectedSupplier('')
    onSearchChange('')
    onSupplierFilter(null)
  }

  const hasActiveFilters = searchText || selectedSupplier

  return (
    <div className="search-filter">
      <div className="search-filter__controls">
        {/* Search Input */}
        <div className="search-filter__field">
          <label htmlFor="search" className="search-filter__label">
            Search
          </label>
          <input
            id="search"
            type="text"
            className="search-filter__input"
            placeholder="Search by title or description..."
            value={searchText}
            onChange={handleSearchChange}
            aria-label="Search offers by title or description"
          />
        </div>

        {/* Supplier Filter */}
        <div className="search-filter__field">
          <label htmlFor="supplier-filter" className="search-filter__label">
            Filter by Supplier
          </label>
          {suppliersLoading ? (
            <div className="search-filter__loading">
              <span className="search-filter__spinner" aria-hidden="true" />
              <span>Loading suppliers...</span>
            </div>
          ) : (
            <select
              id="supplier-filter"
              className="search-filter__select"
              value={selectedSupplier}
              onChange={handleSupplierChange}
              aria-label="Filter offers by supplier"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="search-filter__actions">
            <button
              type="button"
              className="search-filter__clear-button"
              onClick={handleClearFilters}
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
