import { Link } from 'react-router-dom'
import { ToyPreview } from './ToyPreview'
import { authService } from '../services/auth.service.js'


export function ToyList({ onRemoveToy, toys }) {
    const user = authService.getLoggedinUser()
    const isAdmin = user && user.isAdmin

    return (
        <section className="toy-list">
            {isAdmin && (
                <div className="admin-header">
                    <Link to="/toy/edit" className="btn btn--primary">
                        Add New Toy
                    </Link>
                </div>
            )}
            
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
