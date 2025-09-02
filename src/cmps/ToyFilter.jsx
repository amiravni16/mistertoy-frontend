import { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
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

    // Initial values for Formik
    const initialValues = {
        txt: filterBy.txt || '',
        minPrice: filterBy.minPrice || '',
        maxPrice: filterBy.maxPrice || '',
        inStock: filterBy.inStock || '',
        labels: filterBy.labels || []
    }

    // Handle form changes with debouncing
    const handleFormChange = (values) => {
        setFilterByToEdit(values)
        debouncedOnSetFilter(values)
    }

    const onSubmit = (values) => {
        console.log('Filter form submitted:', values)
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
                    // Update parent component when values change
                    useEffect(() => {
                        handleFormChange(values)
                    }, [values])

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
                                    <Field
                                        as="select"
                                        name="labels"
                                        multiple
                                        className={`filter-input ${errors.labels && touched.labels ? 'error' : ''}`}
                                    >
                                        {toyLabels?.map(label => (
                                            <option key={label} value={label}>
                                                {label}
                                            </option>
                                        ))}
                                    </Field>
                                    {errors.labels && touched.labels && (
                                        <span className="error-message">{errors.labels}</span>
                                    )}
                                </div>
                </div>

                                {/* Form Validation Summary */}
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
