import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { toyService } from '../services/toy.service'
import { loadToyLabels, saveToy } from '../store/actions/toy.actions'
import { useSelector } from 'react-redux'
import { useConfirmTabClose } from '../hooks/useConfirmTabClose'

export function ToyEdit() {
    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
    const [originalToy, setOriginalToy] = useState(null)
    
    const labels = useSelector(storeState=>storeState.toyModule.toyLabels)

    const { toyId } = useParams()
    const navigate = useNavigate()

    // Check if there are unsaved changes
    const hasUnsavedChanges = originalToy && JSON.stringify(toyToEdit) !== JSON.stringify(originalToy)
    
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

    function onSaveToy(ev) {
        ev.preventDefault()
        saveToy(toyToEdit)
            .then((savedToy) => {
                showSuccessMsg(`Toy ${savedToy._id} saved successfully`)
                navigate('/toy')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot save toy')
            })
    }

    const priceValidations = {
        min: "1",
        required: true
    }

    // console.log('toyToEdit.labels:', toyToEdit.labels)
    return (
        <section className="toy-edit">
            <h2>{toyToEdit._id ? 'Edit' : 'Add'} Toy</h2>
            {hasUnsavedChanges && (
                <div className="unsaved-changes-warning">
                    ⚠️ You have unsaved changes
                </div>
            )}
            <form onSubmit={onSaveToy}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={toyToEdit.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={toyToEdit.price || ''}
                        {...priceValidations}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="labels">Labels:</label>
                    <select
                        id="labels"
                        name="labels"
                        multiple
                        value={toyToEdit.labels}
                        onChange={handleChange}
                    >
                        {labels.map(label => (
                            <option key={label} value={label}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {toyToEdit._id && (
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="inStock"
                            name="inStock"
                            checked={toyToEdit.inStock}
                            onChange={handleChange}
                        />
                        <label htmlFor="inStock">In Stock</label>
                    </div>
                )}

                <button type="submit" className="btn-save">
                    {toyToEdit._id ? 'Update Toy' : 'Add Toy'}
                </button>
            </form>
        </section>
    )
}
