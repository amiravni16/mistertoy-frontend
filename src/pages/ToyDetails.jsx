import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../cmps/Loader'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { toyService } from '../services/toy.service'
import { reviewService } from '../services/review.service'
import { authService } from '../services/auth.service'

export function ToyDetails() {
    const user = authService.getLoggedinUser()
    const [toy, setToy] = useState(null)
    const [msg, setMsg] = useState({ txt: '' })
    const [review, setReview] = useState({ txt: '' })
    const [reviews, setReviews] = useState([])
    const [reviewStats, setReviewStats] = useState({ totalReviews: 0, avgRating: 0 })
    const { toyId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadToy()
        loadReviews()
        loadReviewStats()
    }, [toyId])

    function handleMsgChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setMsg(msg => ({ ...msg, [field]: value }))
    }

    function handleReviewChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setReview(review => ({ ...review, [field]: value }))
    }

    async function loadToy() {
        try {
            const toy = await toyService.getById(toyId)
            setToy(toy)
        } catch (error) {
            showErrorMsg('Cannot load toy')
            navigate('/toy')
        }
    }

    async function loadReviews() {
        try {
            const reviews = await reviewService.getReviewsByToyId(toyId)
            setReviews(reviews)
        } catch (error) {
            console.error('Error loading reviews:', error)
        }
    }

    async function loadReviewStats() {
        try {
            const stats = await reviewService.getReviewStats(toyId)
            setReviewStats(stats)
        } catch (error) {
            console.error('Error loading review stats:', error)
        }
    }

    async function onSaveMsg(ev) {
        ev.preventDefault()
        
        // Check if user is logged in
        if (!user) {
            showErrorMsg('Please log in to send messages')
            return
        }
        
        try {
            const newMsg = {
                txt: msg.txt,
                by: {
                    _id: user._id,
                    fullname: user.fullname || user.username
                }
            }
            
            await toyService.addMsg(toyId, newMsg)
            setMsg({ txt: '' })
            loadToy() // Reload toy to get updated messages from backend
            showSuccessMsg('Message saved!')
        } catch (error) {
            showErrorMsg('Cannot save message')
        }
    }

    async function onRemoveMsg(msgId) {
        try {
            await toyService.removeMsg(toy._id, msgId)
            loadToy() // Reload toy to get updated messages from backend
            showSuccessMsg('Message removed!')
        } catch (error) {
            showErrorMsg('Cannot remove message')
        }
    }

    async function onSaveReview(ev) {
        ev.preventDefault()
        
        // Check if user is logged in
        if (!user) {
            showErrorMsg('Please log in to write reviews')
            return
        }
        
        try {
            const newReview = {
                txt: review.txt,
                toyId: toyId
            }
            
            await reviewService.add(newReview)
            setReview({ txt: '' })
            loadReviews() // Reload reviews from backend
            loadReviewStats() // Reload review stats
            showSuccessMsg('Review saved!')
        } catch (error) {
            showErrorMsg('Cannot save review')
        }
    }

    async function onRemoveReview(reviewId) {
        try {
            await reviewService.remove(reviewId)
            loadReviews() // Reload reviews from backend
            loadReviewStats() // Reload review stats
            showSuccessMsg('Review removed!')
        } catch (error) {
            showErrorMsg('Cannot remove review')
        }
    }

    const { txt } = msg
    const { txt: reviewTxt } = review

    if (!toy) return <Loader />

    return (
        <section className="toy-details" style={{ textAlign: 'center' }}>
            <div className="upper-section flex flex-column align-center">
                <h1>
                    Toy name: <span>{toy.name}</span>
                </h1>
                <h1>
                    Toy price: <span>${toy.price}</span>
                </h1>
                <h1>
                    Labels: <span>{toy.labels.join(' ,')}</span>
                </h1>
                <h1 className={toy.inStock ? 'green' : 'red'}>
                    {toy.inStock ? 'In stock' : 'Not in stock'}
                </h1>
                <button>
                    <Link to="/toy">Back</Link>
                </button>
            </div>
            <div className="msg-container">
                <h1>Chat</h1>
                {user ? (
                    <>
                        <form className="login-form" onSubmit={onSaveMsg}>
                            <input
                                type="text"
                                name="txt"
                                value={txt}
                                placeholder="Enter Your Message"
                                onChange={handleMsgChange}
                                required
                                autoFocus
                            />
                            <button>Send</button>
                        </form>
                        <div>
                            <ul className="clean-list">
                                {toy.msgs &&
                                    toy.msgs.map(msg => (
                                        <li key={msg.id}>
                                            By: {msg.by ? msg.by.fullname : 'Unknown User'} - {msg.txt}
                                            <button type="button" onClick={() => onRemoveMsg(msg.id)}>
                                                ✖️
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="login-prompt">
                        <p>Please <Link to="/login" className="login-link">login</Link> to add messages about this toy.</p>
                        <p className="no-messages">No messages yet. Be the first to comment!</p>
                    </div>
                )}
            </div>
            
            {/* Reviews Section */}
            <div className="reviews-container">
                <h1>Reviews</h1>
                <div className="review-stats">
                    <p>Total Reviews: {reviewStats.totalReviews}</p>
                </div>
                
                {user ? (
                    <>
                        <form className="login-form" onSubmit={onSaveReview}>
                            <textarea
                                name="txt"
                                value={reviewTxt}
                                placeholder="Write your review..."
                                onChange={handleReviewChange}
                                rows="3"
                                required
                            />
                            <button>Submit Review</button>
                        </form>
                        
                        <div>
                            <ul className="clean-list">
                                {reviews.map(review => (
                                    <li key={review._id} className="review-item">
                                        <div className="review-content">
                                            <p><strong>{review.user?.fullname || review.user?.username || 'Anonymous'}</strong></p>
                                            <p>{review.txt}</p>
                                            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        {(user._id === review.userId || user.isAdmin) && (
                                            <button 
                                                type="button" 
                                                onClick={() => onRemoveReview(review._id)}
                                                className="remove-btn"
                                            >
                                                ✖️
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="login-prompt">
                        <p>Please <Link to="/login" className="login-link">login</Link> to write reviews about this toy.</p>
                        <div>
                            <ul className="clean-list">
                                {reviews.map(review => (
                                    <li key={review._id} className="review-item">
                                        <div className="review-content">
                                            <p><strong>{review.user?.fullname || review.user?.username || 'Anonymous'}</strong></p>
                                            <p>{review.txt}</p>
                                            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
