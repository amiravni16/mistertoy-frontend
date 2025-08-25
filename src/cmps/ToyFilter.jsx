import { useEffect, useRef, useState } from 'react'
import { debounce } from '../services/util.service.js'
import { toyService } from '../services/toy.service.js'


export function ToyFilter({ filterBy, onSetFilter, toyLabels }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    
    const debouncedOnSetFilter = useRef(debounce(onSetFilter, 300)).current

    useEffect(() => {
        debouncedOnSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        if (type === 'select-multiple') {
            value = [...target.selectedOptions].map(option => option.value)
        } else {
            value = type === 'number' ? +value : value
        }

        if (field === 'inStock') value = toyService.getInStockValue(value)
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }


    const { txt, inStock, labels } = filterByToEdit

    return (
        <section className="toy-filter">
            <h3>Toys Filter/Sort</h3>
            <form className="filter-form flex align-center">
                <input
                    onChange={handleChange}
                    value={txt}
                    type="text"
                    placeholder="Search"
                    name="txt"
                />
                <select name="inStock" value={inStock} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="true">In Stock</option>
                    <option value="false">Not in stock</option>
                </select>
                {toyLabels &&
                    <select
                        multiple
                        name="labels"
                        value={labels || []}
                        onChange={handleChange}
                    >
                        <option disabled value="">Labels</option>
                        <>
                            {toyLabels.map(label => (
                                <option key={label} value={label}>
                                    {label}
                                </option>
                            ))}
                        </>
                    </select>
                }
            </form>
        </section>
    )
}
