import { useState } from 'react'
import { Link } from 'react-router-dom'

export function ToyPreview({ toy }) {
    const [imageError, setImageError] = useState(false)

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
        <Link to={`/toy/${toy._id}`} title={toy.name}>
            <article className="toy-preview flex flex-column align-center">
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
            </article>
        </Link>
    )
}
