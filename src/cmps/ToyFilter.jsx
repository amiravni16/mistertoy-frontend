import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Select from 'react-select'
import { debounce } from '../services/util.service.js'
import { toyService } from '../services/toy.service.js'
import '../assets/style/cmps/ToyFilter.css'

// Validation schema
const filterSchema = yup.object({
    txt: yup.string().max(50, 'Search term must be less than 50 characters'),
    minPrice: yup.number().min(0, 'Price must be positive').nullable(),
    maxPrice: yup.number().min(0, 'Price must be positive').nullable(),
    inStock: yup.string().oneOf(['', 'true', 'false']),
    labels: yup.array().of(yup.string())
}).test('price-range', 'Min price must be less than max price', function(value) {
    if (value.minPrice && value.maxPrice) {
        return value.minPrice <= value.maxPrice
    }
    return true
})

export function ToyFilter({ filterBy, onSetFilter, toyLabels }) {
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedOnSetFilter = useRef(debounce(onSetFilter, 300)).current

    const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(filterSchema),
        defaultValues: {
            txt: filterBy.txt || '',
            minPrice: filterBy.minPrice || null,
            maxPrice: filterBy.maxPrice || null,
            inStock: filterBy.inStock || '',
            labels: filterBy.labels || []
        }
    })

    // Watch individual form values to avoid infinite loops
    const watchedTxt = watch('txt')
    const watchedMinPrice = watch('minPrice')
    const watchedMaxPrice = watch('maxPrice')
    const watchedInStock = watch('inStock')
    const watchedLabels = watch('labels')

    useEffect(() => {
        const currentValues = {
            txt: watchedTxt,
            minPrice: watchedMinPrice,
            maxPrice: watchedMaxPrice,
            inStock: watchedInStock,
            labels: watchedLabels
        }
        setFilterByToEdit(currentValues)
        debouncedOnSetFilter(currentValues)
    }, [watchedTxt, watchedMinPrice, watchedMaxPrice, watchedInStock, watchedLabels, debouncedOnSetFilter])

    // Stock status options for react-select
    const stockOptions = [
        { value: '', label: 'All Items' },
        { value: 'true', label: 'In Stock' },
        { value: 'false', label: 'Out of Stock' }
    ]

    // Convert toy labels to react-select format
    const labelOptions = toyLabels?.map(label => ({
        value: label,
        label: label
    })) || []

    // Get current selected labels
    const selectedLabels = labelOptions.filter(option => 
        filterByToEdit.labels?.includes(option.value)
    )

    const onSubmit = (data) => {
        console.log('Filter form submitted:', data)
    }

    return (
        <section className="toy-filter">
            <div className="filter-header">
                <h3>Advanced Toy Filter</h3>
                <p>Use the filters below to find the perfect toys</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="filter-form">
                <div className="filter-grid">
                    {/* Search Input */}
                    <div className="filter-group">
                        <label htmlFor="search">Search Toys</label>
                        <Controller
                            name="txt"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="search"
                                    type="text"
                                    placeholder="Search by name or description..."
                                    className={`filter-input ${errors.txt ? 'error' : ''}`}
                                />
                            )}
                        />
                        {errors.txt && (
                            <span className="error-message">{errors.txt.message}</span>
                        )}
                    </div>

                    {/* Price Range */}
                    <div className="filter-group">
                        <label htmlFor="minPrice">Min Price</label>
                        <Controller
                            name="minPrice"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="minPrice"
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    value={field.value || ''}
                                    className={`filter-input ${errors.minPrice ? 'error' : ''}`}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            )}
                        />
                        {errors.minPrice && (
                            <span className="error-message">{errors.minPrice.message}</span>
                        )}
                    </div>

                    <div className="filter-group">
                        <label htmlFor="maxPrice">Max Price</label>
                        <Controller
                            name="maxPrice"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    id="maxPrice"
                                    type="number"
                                    placeholder="1000"
                                    min="0"
                                    step="0.01"
                                    value={field.value || ''}
                                    className={`filter-input ${errors.maxPrice ? 'error' : ''}`}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            )}
                        />
                        {errors.maxPrice && (
                            <span className="error-message">{errors.maxPrice.message}</span>
                        )}
                    </div>

                    {/* Stock Status Select */}
                    <div className="filter-group">
                        <label>Stock Status</label>
                        <Controller
                            name="inStock"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={stockOptions}
                                    placeholder="Select stock status..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    isClearable
                                    onChange={(option) => field.onChange(option?.value || '')}
                                    value={stockOptions.find(option => option.value === field.value)}
                                />
                            )}
                        />
                    </div>

                    {/* Labels Multi-Select */}
                    <div className="filter-group full-width">
                        <label>Categories</label>
                        <Controller
                            name="labels"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={labelOptions}
                                    placeholder="Select categories..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    isMulti
                                    isClearable
                                    closeMenuOnSelect={false}
                                    onChange={(options) => field.onChange(options?.map(option => option.value) || [])}
                                    value={selectedLabels}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Form Validation Summary */}
                {Object.keys(errors).length > 0 && (
                    <div className="validation-summary">
                        <h4>Please fix the following errors:</h4>
                        <ul>
                            {Object.entries(errors).map(([field, error]) => (
                                <li key={field}>
                                    <strong>{field}:</strong> {error.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Filter Actions */}
                <div className="filter-actions">
                    <button 
                        type="button" 
                        className="btn-clear"
                        onClick={() => {
                            setValue('txt', '')
                            setValue('minPrice', null)
                            setValue('maxPrice', null)
                            setValue('inStock', '')
                            setValue('labels', [])
                        }}
                    >
                        Clear All Filters
                    </button>
                    <button type="submit" className="btn-apply">
                        Apply Filters
                    </button>
                </div>
            </form>
        </section>
    )
}
