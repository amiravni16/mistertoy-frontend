import { Link } from 'react-router-dom'
import { ToyPreview } from './ToyPreview'
import { useState } from 'react'


export function ToyList({ onRemoveToy, toys }) {
    return (
        <section className="toy-list">
            {!toys.length ? (
                <h1 style={{ placeSelf: 'center' }}>It's empty here...</h1>
            ) : (
                <ul>
                    {toys.map(toy => (
                        <li key={toy._id}>
                            <ToyPreview toy={toy} />
                            <div className="flex justify-center">
                                <Link className="btn" to={`/toy/edit/${toy._id}`}>
                                    Edit
                                </Link>
                                <button className="btn" onClick={() => onRemoveToy(toy._id)}>
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
