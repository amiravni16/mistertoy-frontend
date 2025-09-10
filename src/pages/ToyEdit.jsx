import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { toyService } from '../services/toy.service'
import { loadToyLabels, saveToy } from '../store/actions/toy.actions'
import { useSelector } from 'react-redux'
import { useConfirmTabClose } from '../hooks/useConfirmTabClose'
import { ModernMultiSelect } from '../cmps/ModernMultiSelect'

// Validation schema
const toySchema = yup.object({
    name: yup.string()
        .required('Toy name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .matches(/^[a-zA-Z0-9\s\-&]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and ampersands'),
    price: yup.number()
        .required('Price is required')
        .min(0.01, 'Price must be greater than 0')
        .max(10000, 'Price must be less than $10,000')
        .typeError('Price must be a valid number'),
    labels: yup.array()
        .of(yup.string())
        .min(1, 'Please select at least one category')
        .required('At least one category is required'),
    inStock: yup.boolean(),
    description: yup.string()
        .max(500, 'Description must be less than 500 characters')
        .nullable(),
    ageRange: yup.string()
        .max(50, 'Age range must be less than 50 characters')
        .nullable()
})

export function ToyEdit() {
    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
    const [originalToy, setOriginalToy] = useState(null)
    const [initialValues, setInitialValues] = useState({
        name: '',
        price: 0,
        labels: [],
        inStock: true,
        description: '',
        ageRange: ''
    })
    
    const labels = useSelector(storeState=>storeState.toyModule.toyLabels)

    const { toyId } = useParams()
    const navigate = useNavigate()

    // Check if there are unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    
    // Use the custom hook to warn about unsaved changes
    useConfirmTabClose(hasUnsavedChanges)

    useEffect(() => {
        loadToy()
        // loadToyLabels()
    }, [])

    function loadToy() {
        if (!toyId) return
        toyService.getById(toyId)
            .then(toy => {
                setToyToEdit(toy)
                setOriginalToy(toy) // Store original for comparison
                // Set initial values for Formik
                setInitialValues({
                    name: toy.name || '',
                    price: toy.price || 0,
                    labels: toy.labels || [],
                    inStock: toy.inStock !== false,
                    description: toy.description || '',
                    ageRange: toy.ageRange || ''
                })
            })
            .catch(err => {
                console.log('Had issues in toy edit:', err)
                navigate('/toy')
                showErrorMsg('Toy not found!')
            })
    }

    // function loadToyLabels() {
    //     toyService.getToyLabels()
    //         .then(setLabels)
    //         .catch(err => {
    //             console.log('Had issues in toy edit:', err)
    //             navigate('/toy')
    //             showErrorMsg('Toy not found!')
    //         })
    // }

    function handleChange({ target }) {
        const { name, value, type, checked } = target
        let fieldValue = value
        if (type === 'checkbox') {
            fieldValue = checked
        } else if (type === 'number') {
            fieldValue = +value
        } else if (type === 'select-multiple') {
            fieldValue = [...target.selectedOptions].map(option => option.value)
        }

        setToyToEdit(prevToy => ({
            ...prevToy,
            [name]: fieldValue
        }))
    }

    const onSaveToy = (values) => {
        const toyToSave = {
            ...toyToEdit,
            ...values
        }
        
        saveToy(toyToSave)
            .then((savedToy) => {
                showSuccessMsg(`Toy ${savedToy._id} saved successfully`)
                navigate('/toy')
            })
            .catch(err => {
                console.log('err:', err)
                // Check if it's an authentication error
                if (err.response?.status === 401) {
                    showErrorMsg('Please log in to save toys')
                } else {
                    showErrorMsg('Cannot save toy')
                }
            })
    }

    return (
        <section className="toy-edit">
            <div className="edit-container">
                <div className="edit-header">
                    <h1>{toyToEdit._id ? 'Edit' : 'Add'} Toy</h1>
                    <p>Enter the details for your toy below</p>
                    {hasUnsavedChanges && (
                        <div className="unsaved-changes-warning">
                            ⚠️ You have unsaved changes
                        </div>
                    )}
                </div>

            <Formik
                initialValues={initialValues}
                validationSchema={toySchema}
                onSubmit={onSaveToy}
                enableReinitialize={true}
            >
                {({ values, errors, touched, setFieldValue, dirty }) => {
                    // Update unsaved changes state
                    useEffect(() => {
                        setHasUnsavedChanges(dirty)
                    }, [dirty])

                    return (
                        <Form className="toy-form">
                            <div className="form-grid">
                                {/* Name Field */}
                                <div className="form-group">
                                    <label htmlFor="name" className="required">Toy Name</label>
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter toy name..."
                                        className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                                    />
                                    {errors.name && touched.name && (
                                        <span className="error-message">{errors.name}</span>
                                    )}
                                </div>

                                {/* Price Field */}
                                <div className="form-group">
                                    <label htmlFor="price" className="required">Price ($)</label>
                                    <Field
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="0.00"
                                        min="0.01"
                                        step="0.01"
                                        className={`form-input ${errors.price && touched.price ? 'error' : ''}`}
                                    />
                                    {errors.price && touched.price && (
                                        <span className="error-message">{errors.price}</span>
                                    )}
                                </div>

                                {/* Categories Multi-Select */}
                                <div className="form-group full-width">
                                    <label htmlFor="labels" className="required">Categories</label>
                                    <Field name="labels">
                                        {({ field, form }) => (
                                            <ModernMultiSelect
                                                options={labels || []}
                                                value={field.value || []}
                                                onChange={(newValue) => {
                                                    form.setFieldValue('labels', newValue)
                                                    form.setFieldTouched('labels', true)
                                                }}
                                                placeholder="Select categories..."
                                                className={errors.labels && touched.labels ? 'error' : ''}
                                            />
                                        )}
                                    </Field>
                                    {errors.labels && touched.labels && (
                                        <span className="error-message">{errors.labels}</span>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div className="form-group full-width">
                                    <label htmlFor="description">Description</label>
                                    <Field
                                        as="textarea"
                                        id="description"
                                        name="description"
                                        placeholder="Enter toy description..."
                                        rows="4"
                                        className={`form-input ${errors.description && touched.description ? 'error' : ''}`}
                                    />
                                    {errors.description && touched.description && (
                                        <span className="error-message">{errors.description}</span>
                                    )}
                                </div>

                                {/* Age Range Field */}
                                <div className="form-group">
                                    <label htmlFor="ageRange">Age Range</label>
                                    <Field
                                        id="ageRange"
                                        name="ageRange"
                                        type="text"
                                        placeholder="e.g., 3-8 years"
                                        className={`form-input ${errors.ageRange && touched.ageRange ? 'error' : ''}`}
                                    />
                                    {errors.ageRange && touched.ageRange && (
                                        <span className="error-message">{errors.ageRange}</span>
                                    )}
                                </div>

                                {/* In Stock Checkbox */}
                                {toyToEdit._id && (
                                    <div className="form-group">
                                        <div className="checkbox-group">
                                            <Field
                                                type="checkbox"
                                                id="inStock"
                                                name="inStock"
                                            />
                                            <label htmlFor="inStock">In Stock</label>
                                        </div>
                                    </div>
                                )}
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

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => navigate('/toy')}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {toyToEdit._id ? 'Update Toy' : 'Add Toy'}
                                </button>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
            </div>
        </section>
    )
}
