import { useEffect, useState } from 'react'

export function ToySort({ sortBy, onSetSort }) {
    const [sortByToEdit, setSortByToEdit] = useState({ ...sortBy })

    useEffect(() => {
        onSetSort(sortByToEdit)
    }, [sortByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.type === 'number' ? +target.value : target.value
        if (field === 'desc') value = target.checked ? -1 : 1
        setSortByToEdit(prevSort => ({
            ...prevSort,
            [field]: value,
        }))
    }

    return (
        <form className="toy-sort">
            <select name="type" value={sortByToEdit.type} onChange={handleChange}>
                <option value="">Sort by</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Date</option>
            </select>
            <label>
                <input
                    type="checkbox"
                    name="desc"
                    checked={sortByToEdit.desc < 0}
                    onChange={handleChange}
                />
                Descending
            </label>
        </form>
    )
}
