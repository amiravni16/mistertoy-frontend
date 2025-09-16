import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from '../cmps/Loader'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { reviewService } from '../services/review.service'
import { authService } from '../services/auth.service'
import '../assets/style/pages/reviews.css'

export function ReviewExplore() {
    const user = authService.getLoggedinUser()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterBy, setFilterBy] = useState({
        toyId: '',
        userId: '',
        limit: ''
    })

    useEffect(() => {
        loadReviews()
    }, [])

    async function loadReviews() {
        try {
            setLoading(true)
            const reviewsData = await reviewService.getReviewsWithToysAndUsers(filterBy)
            // Ensure reviewsData is an array
            setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        } catch (error) {
            console.error('Error loading reviews:', error)
            showErrorMsg('Cannot load reviews')
            setReviews([]) // Set empty array on error
        } finally {
            setLoading(false)
        }
    }

    function handleFilterChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setFilterBy(prev => ({ ...prev, [field]: value }))
    }

    function onApplyFilter() {
        loadReviews()
    }

    function onClearFilter() {
        setFilterBy({ toyId: '', userId: '', limit: '' })
        loadReviews()
    }

    async function onRemoveReview(reviewId) {
        try {
            await reviewService.remove(reviewId)
            loadReviews() // Reload reviews
            showSuccessMsg('Review removed!')
        } catch (error) {
            showErrorMsg('Cannot remove review')
        }
    }

    if (loading) return <Loader />

    return (
        <section className="review-explore" style={{ padding: '20px' }}>
            <div className="explore-header">
                <h1>Review Explorer</h1>
                <p>Explore all reviews in the system</p>
            </div>

            <div className="filter-section">
                <h3>Filters</h3>
                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="toyId">Filter by Toy ID:</label>
                        <input
                            type="text"
                            id="toyId"
                            name="toyId"
                            value={filterBy.toyId}
                            onChange={handleFilterChange}
                            placeholder="Enter toy ID"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label htmlFor="userId">Filter by User ID:</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={filterBy.userId}
                            onChange={handleFilterChange}
                            placeholder="Enter user ID"
                        />
                    </div>
                    
                    <div className="filter-group">
                        <label htmlFor="limit">Limit Results:</label>
                        <input
                            type="number"
                            id="limit"
                            name="limit"
                            value={filterBy.limit}
                            onChange={handleFilterChange}
                            placeholder="Number of results"
                            min="1"
                        />
                    </div>
                </div>
                
                <div className="filter-actions">
                    <button onClick={onApplyFilter} className="btn-primary">
                        Apply Filters
                    </button>
                    <button onClick={onClearFilter} className="btn-secondary">
                        Clear Filters
                    </button>
                </div>
            </div>

            <div className="reviews-stats">
                <h3>Statistics</h3>
                <p><strong>Total Reviews:</strong> {Array.isArray(reviews) ? reviews.length : 0}</p>
                {Array.isArray(reviews) && reviews.length > 0 && (
                    <div className="stats-breakdown">
                        <p><strong>Reviews per Toy:</strong></p>
                        {Object.entries(
                            reviews.reduce((acc, review) => {
                                const toyName = review.toy?.name || 'Unknown Toy'
                                acc[toyName] = (acc[toyName] || 0) + 1
                                return acc
                            }, {})
                        ).map(([toy, count]) => (
                            <span key={toy} className="stat-item">
                                {toy}: {count}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="reviews-list">
                <h3>All Reviews</h3>
                {Array.isArray(reviews) && reviews.length > 0 ? (
                    <div className="reviews-grid">
                        {reviews.map(review => (
                            <div key={review._id} className="review-card">
                                <div className="review-header">
                                    <h4>
                                        <Link to={`/toy/${review.toy._id}`}>
                                            {review.toy.name}
                                        </Link>
                                    </h4>
                                    <span className="review-price">${review.toy.price}</span>
                                </div>
                                
                                <div className="review-content">
                                    <p>"{review.txt}"</p>
                                </div>
                                
                                <div className="review-meta">
                                    <p>
                                        <strong>By:</strong> 
                                        <Link to={`/user/${review.user._id}`}>
                                            {review.user.fullname}
                                        </Link>
                                    </p>
                                    <small>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                                
                                <div className="review-actions">
                                    {(user && (user._id === review.user._id || user.isAdmin)) && (
                                        <button 
                                            onClick={() => onRemoveReview(review._id)}
                                            className="remove-btn"
                                        >
                                            ✖️ Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-reviews">
                        <p>No reviews found with the current filters.</p>
                        <button onClick={onClearFilter} className="btn-secondary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <div className="navigation">
                <button>
                    <Link to="/toy">← Back to Toys</Link>
                </button>
                <button>
                    <Link to="/dashboard">← Back to Dashboard</Link>
                </button>
            </div>
        </section>
    )
}
