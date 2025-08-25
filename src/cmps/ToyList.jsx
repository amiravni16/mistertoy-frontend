import { Link } from 'react-router-dom'
import { ToyPreview } from './ToyPreview'
import { useState } from 'react'


export function ToyList({ onRemoveToy, toys }) {
    const elLis = toys.map(toy => (
        <li key={toy._id}>
            <ToyPreview toy={toy} />
            <div>
                <button>
                    <Link to={`/toy/edit/${toy._id}`}>Edit</Link>
                </button>
                <button onClick={() => onRemoveToy(toy._id)}>Remove</button>
            </div>
        </li>
    ))

    return (
        <section className="toy-list container">
            <ul>
                {elLis}
            </ul>
        </section>
    )
}
