import { useState } from 'react'
import { Link } from 'react-router-dom'

export function ToyPreview({ toy }) {
    const [imageError, setImageError] = useState(false)

    const handleImageError = () => {
        setImageError(true)
    }

    const getFallbackImage = () => {
        // Fallback to a generic robohash image if the main image fails
        return `https://robohash.org/${toy.name}?set=set4`
    }

    // Ensure we always have a valid image URL
    const getImageSrc = () => {
        if (imageError || !toy.imgUrl || toy.imgUrl.trim() === '') {
            return getFallbackImage()
        }
        return toy.imgUrl
    }

    return (
        <article className="toy-preview">
            <div className="toy-image-container">
                <img 
                    src={getImageSrc()}
                    alt={toy.name || 'Toy'}
                    onError={handleImageError}
                    className="toy-image"
                />
                <div className="toy-overlay">
                    <div className="toy-actions">
                        <Link to={`/toy/${toy._id}`} className="btn-view">
                            👁️ View
                        </Link>
                        <Link to={`/toy/edit/${toy._id}`} className="btn-edit">
                            ✏️ Edit
                        </Link>
                    </div>
                </div>
                <div className={`stock-badge ${toy.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {toy.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
            </div>
            
            <div className="toy-info">
                <h3 className="toy-name">{toy.name || 'Unnamed Toy'}</h3>
                <div className="toy-price">${toy.price || 0}</div>
                <div className="toy-labels">
                    {(toy.labels || []).slice(0, 3).map((label, index) => (
                        <span key={index} className="toy-label">
                            {label}
                        </span>
                    ))}
                    {toy.labels && toy.labels.length > 3 && (
                        <span className="toy-label more">+{toy.labels.length - 3}</span>
                    )}
                </div>
            </div>
        </article>
    )
}
