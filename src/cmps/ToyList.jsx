import { Link } from 'react-router-dom'
import { ToyPreview } from './ToyPreview'
import { authService } from '../services/auth.service.js'


export function ToyList({ onRemoveToy, toys }) {
    return (
        <section className="toy-list">
            {!toys.length ? (
                <h1 style={{ placeSelf: 'center' }}>It's empty here...</h1>
            ) : (
                <ul>
                    {toys.map(toy => (
                        <li key={toy._id}>
                            <ToyPreview toy={toy} onDelete={onRemoveToy} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}
