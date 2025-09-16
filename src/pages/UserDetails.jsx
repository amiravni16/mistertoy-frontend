import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../cmps/Loader'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { userService } from '../services/user.service'
import { reviewService } from '../services/review.service'
import { authService } from '../services/auth.service'
import '../assets/style/pages/reviews.css'

export function UserDetails() {
    const loggedInUser = authService.getLoggedinUser()
    const [user, setUser] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const { userId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUserDetails()
        loadUserReviews()
    }, [userId])

    async function loadUserDetails() {
        try {
            const userData = await userService.getById(userId)
            setUser(userData)
        } catch (error) {
            console.error('Error loading user details:', error)
            showErrorMsg('Cannot load user details')
            navigate('/user')
        }
    }

    async function loadUserReviews() {
        try {
            const userReviews = await reviewService.getReviewsWithToysAndUsers({ userId })
            setReviews(userReviews)
        } catch (error) {
            console.error('Error loading user reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    async function onRemoveReview(reviewId) {
        try {
            await reviewService.remove(reviewId)
            loadUserReviews() // Reload reviews
            showSuccessMsg('Review removed!')
        } catch (error) {
            showErrorMsg('Cannot remove review')
        }
    }

    if (loading) return <Loader />

    if (!user) return <div>User not found</div>

    return (
        <section className="user-details" style={{ textAlign: 'center', padding: '20px' }}>
            <div className="user-info">
                <h1>User Profile</h1>
                <div className="user-card">
                    <h2>{user.fullname}</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Score:</strong> {user.score}</p>
                    <p><strong>Role:</strong> {user.isAdmin ? 'Admin' : 'User'}</p>
                </div>
                
                <div className="user-stats">
                    <h3>Review Statistics</h3>
                    <p><strong>Total Reviews:</strong> {reviews.length}</p>
                </div>

                <div className="user-actions">
                    <button>
                        <Link to="/dashboard">← Back to Dashboard</Link>
                    </button>
                    {loggedInUser && (loggedInUser._id === user._id || loggedInUser.isAdmin) && (
                        <button>
                            <Link to={`/user/edit/${user._id}`}>Edit Profile</Link>
                        </button>
                    )}
                </div>
            </div>

            <div className="user-reviews">
                <h2>User's Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="reviews-list">
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
                                    <small>
                                        Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                                <div className="review-actions">
                                    {(loggedInUser && (loggedInUser._id === review.user._id || loggedInUser.isAdmin)) && (
                                        <button 
                                            onClick={() => onRemoveReview(review._id)}
                                            className="remove-btn"
                                        >
                                            ✖️ Remove Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-reviews">
                        <p>This user hasn't written any reviews yet.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
