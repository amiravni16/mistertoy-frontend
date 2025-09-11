import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../cmps/Loader'
import { showErrorMsg } from '../services/event-bus.service'
import { toyService } from '../services/toy.service'
import { Chat } from '../cmps/Chat'
import { NicePopup } from '../cmps/NicePopup'

export function ToyDetails() {
    const [toy, setToy] = useState(null)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const { toyId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadToy()
    }, [toyId])

    function loadToy() {
        toyService.getById(toyId)
            .then(toy => setToy(toy))
            .catch(err => {
                console.log('Had issues in toy details', err)
                showErrorMsg('Cannot load toy')
                navigate('/toy')
            })
    }

    if (!toy) return <Loader />
    const formattedDate = new Date(toy.createdAt).toLocaleString('he')
    return (
        <section className="toy-details">
            <div className="details-container">
                <div className="toy-image">
                    <div className="image-container">
                        {toy.imgUrl ? (
                            <img 
                                src={toy.imgUrl} 
                                alt={toy.name}
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'flex'
                                }}
                            />
                        ) : null}
                        <div className="image-placeholder" style={{ display: toy.imgUrl ? 'none' : 'flex' }}>
                            🧸
                        </div>
                    </div>
                </div>
                
                <div className="toy-info">
                    <div className="toy-header">
                        <h1>{toy.name}</h1>
                        <div className="toy-price">${toy.price}</div>
                        <div className="toy-labels">
                            {toy.labels.map((label, index) => (
                                <span key={index} className="label">{label}</span>
                            ))}
                        </div>
                        <div className={`stock-status ${toy.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {toy.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                        </div>
                        <div className="toy-meta">
                            <small>Created: {formattedDate}</small>
                        </div>
                    </div>
                    
                    {toy.description && (
                        <div className="toy-description">
                            <h3>Description</h3>
                            <p>{toy.description}</p>
                        </div>
                    )}
                    
                    <div className="toy-actions">
                        <Link to="/toy" className="btn btn--outline">
                            ← Back to Toys
                        </Link>
                        <button 
                            onClick={() => setIsChatOpen(true)} 
                            className="btn btn--primary"
                        >
                            💬 Chat About This Toy
                        </button>
                    </div>
                </div>
            </div>
            
            <NicePopup
                header={<h3>Chat About {toy.name}</h3>}
                footer={<h4>&copy; 2025-9999 Toys INC.</h4>}
                onClose={() => setIsChatOpen(false)}
                isOpen={isChatOpen}
            >
                <Chat />
            </NicePopup>
        </section>
    )
}
