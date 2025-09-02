import { useEffect, useRef, useState, useMemo } from 'react'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { debounce } from '../services/util.service.js'
import { toyService } from '../services/toy.service.js'
import { ModernMultiSelect } from './ModernMultiSelect'
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
    
    // Debug: Log the labels being received
    useEffect(() => {
        console.log('ToyFilter received toyLabels:', toyLabels)
    }, [toyLabels])

    // Initial values for Formik - memoized to prevent unnecessary re-renders
    const initialValues = useMemo(() => ({
        txt: filterBy.txt || '',
        minPrice: filterBy.minPrice || '',
        maxPrice: filterBy.maxPrice || '',
        inStock: filterBy.inStock || '',
        labels: filterBy.labels || []
    }), [filterBy.txt, filterBy.minPrice, filterBy.maxPrice, filterBy.inStock, filterBy.labels])

    // Handle form changes with debouncing
    const handleFormChange = (values) => {
        setFilterByToEdit(values)
        debouncedOnSetFilter(values)
    }

    const onSubmit = (values) => {
        console.log('Filter form submitted:', values)
    }

    // Don't render until labels are loaded to prevent layout shifts
    if (!toyLabels || toyLabels.length === 0) {
        return (
            <section className="toy-filter">
                <div className="filter-header">
                    <h2>Filter Toys</h2>
                    <p>Loading categories...</p>
                </div>
                <div className="filter-form">
                    <div className="filter-grid">
                        <div className="filter-group">
                            <label>Search</label>
                            <div className="loading-placeholder">Loading...</div>
                        </div>
                        <div className="filter-group">
                            <label>Min Price</label>
                            <div className="loading-placeholder">Loading...</div>
                        </div>
                        <div className="filter-group">
                            <label>Max Price</label>
                            <div className="loading-placeholder">Loading...</div>
                        </div>
                        <div className="filter-group">
                            <label>Stock Status</label>
                            <div className="loading-placeholder">Loading...</div>
                        </div>
                        <div className="filter-group full-width">
                            <label>Categories</label>
                            <div className="loading-placeholder">Loading categories...</div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="toy-filter">
            <div className="filter-header">
                <h3>Advanced Toy Filter</h3>
                <p>Use the filters below to find the perfect toys</p>
            </div>
            
                        <Formik
                initialValues={initialValues}
                validationSchema={filterSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                {({ values, errors, touched, setFieldValue }) => {
                    // Update parent component when values change - debounced
                    useEffect(() => {
                        const timeoutId = setTimeout(() => {
                            handleFormChange(values)
                        }, 100)
                        return () => clearTimeout(timeoutId)
                    }, [values.txt, values.minPrice, values.maxPrice, values.inStock, values.labels])

    return (
                        <Form className="filter-form">
                            <div className="filter-grid">
                                {/* Search Input */}
                                <div className="filter-group">
                                    <label htmlFor="search">Search Toys</label>
                                    <Field
                                        id="search"
                                        name="txt"
                    type="text"
                                        placeholder="Search by name or description..."
                                        className={`filter-input ${errors.txt && touched.txt ? 'error' : ''}`}
                                    />
                                    {errors.txt && touched.txt && (
                                        <span className="error-message">{errors.txt}</span>
                                    )}
                                </div>

                                {/* Price Range */}
                                <div className="filter-group">
                                    <label htmlFor="minPrice">Min Price</label>
                                    <Field
                                        id="minPrice"
                                        name="minPrice"
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className={`filter-input ${errors.minPrice && touched.minPrice ? 'error' : ''}`}
                                    />
                                    {errors.minPrice && touched.minPrice && (
                                        <span className="error-message">{errors.minPrice}</span>
                                    )}
                                </div>

                                <div className="filter-group">
                                    <label htmlFor="maxPrice">Max Price</label>
                                    <Field
                                        id="maxPrice"
                                        name="maxPrice"
                                        type="number"
                                        placeholder="1000"
                                        min="0"
                                        step="0.01"
                                        className={`filter-input ${errors.maxPrice && touched.maxPrice ? 'error' : ''}`}
                                    />
                                    {errors.maxPrice && touched.maxPrice && (
                                        <span className="error-message">{errors.maxPrice}</span>
                                    )}
                                </div>

                                                    {/* Stock Status Select */}
                                <div className="filter-group">
                                    <label htmlFor="inStock">Stock Status</label>
                                    <Field
                                        as="select"
                                        id="inStock"
                                        name="inStock"
                                        className={`filter-input ${errors.inStock && touched.inStock ? 'error' : ''}`}
                                    >
                                        <option value="">All Items</option>
                    <option value="true">In Stock</option>
                                        <option value="false">Out of Stock</option>
                                    </Field>
                                </div>

                                {/* Labels Multi-Select */}
                                                        <div className="filter-group full-width">
                            <label>Categories</label>
                            <Field name="labels">
                                {({ field, form }) => (
                                    <div className="multi-select-container">
                                        <ModernMultiSelect
                                            key="categories-select"
                                            options={Array.isArray(toyLabels) ? toyLabels : []}
                                            value={Array.isArray(field.value) ? field.value : []}
                                            onChange={(newValue) => {
                                                form.setFieldValue('labels', newValue)
                                                form.setFieldTouched('labels', true)
                                            }}
                                            placeholder="Select categories..."
                                            className={errors.labels && touched.labels ? 'error' : ''}
                                        />
                                    </div>
                                )}
                            </Field>
                            {errors.labels && touched.labels && (
                                <span className="error-message">{errors.labels}</span>
                            )}
                        </div>
                </div>

                                {/* Form Validation Summary - Temporarily disabled */}
                                {/* <div className="validation-container">
                                    {Object.keys(errors).length > 0 && (
                                        <div className="validation-summary">
                                            <h4>Please fix the following errors:</h4>
                                            <ul>
                                                {Object.entries(errors).map(([field, error]) => (
                                                    <li key={field}>
                                                        <strong>{field}:</strong> {error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div> */}

                                {/* Filter Actions */}
                                <div className="filter-actions">
                                    <button 
                                        type="button" 
                                        className="btn-clear"
                                        onClick={() => {
                                            setFieldValue('txt', '')
                                            setFieldValue('minPrice', '')
                                            setFieldValue('maxPrice', '')
                                            setFieldValue('inStock', '')
                                            setFieldValue('labels', [])
                                        }}
                                    >
                                        Clear All Filters
                                    </button>
                                    <button type="submit" className="btn-apply">
                                        Apply Filters
                                    </button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
        </section>
    )
}
