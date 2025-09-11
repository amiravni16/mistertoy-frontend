import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/auth.service.js'

export function ToyPreview({ toy, onDelete }) {
    const [imageError, setImageError] = useState(false)
    const user = authService.getLoggedinUser()
    const isLoggedIn = !!user

    const handleImageError = () => {
        setImageError(true)
    }

    const getFallbackImage = () => {
        return `https://robohash.org/${toy.name}?set=set4`
    }

    const getImageSrc = () => {
        if (imageError || !toy.imgUrl || toy.imgUrl.trim() === '') {
            return getFallbackImage()
        }
        return toy.imgUrl
    }

    return (
        <article className="toy-preview flex flex-column align-center">
            <Link to={`/toy/${toy._id}`} title={toy.name}>
                <h2 className="toy-name">{toy.name || 'Unnamed Toy'}</h2>
                <div className="img-container">
                    <img 
                        src={getImageSrc()}
                        alt={toy.name || 'Toy'}
                        onError={handleImageError}
                    />
                </div>
                <p>Price: ${toy.price || 0}</p>
                <p className={toy.inStock ? 'green' : 'red'}>
                    {toy.inStock ? 'In stock' : 'Not in stock'}
                </p>
            </Link>
            
            {isLoggedIn && (
                <div className="admin-controls">
                    <Link to={`/toy/edit/${toy._id}`} className="btn btn--sm btn--primary">
                        Edit
                    </Link>
                    <button 
                        onClick={() => onDelete(toy._id)} 
                        className="btn btn--sm btn--danger"
                    >
                        Delete
                    </button>
                </div>
            )}
        </article>
    )
}
