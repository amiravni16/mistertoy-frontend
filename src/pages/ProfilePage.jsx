import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service.js'
import '../assets/style/cmps/ProfilePage.css'

export function ProfilePage() {
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        preferences: {
            favoriteCategory: '',
            notifications: true,
            theme: 'light'
        }
    })
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const loggedInUser = authService.getLoggedinUser()
        if (!loggedInUser) {
            navigate('/login')
            return
        }
        
        setUser(loggedInUser)
        setFormData({
            username: loggedInUser.username || '',
            email: loggedInUser.email || '',
            fullName: loggedInUser.fullName || '',
            preferences: {
                favoriteCategory: loggedInUser.preferences?.favoriteCategory || '',
                notifications: loggedInUser.preferences?.notifications !== false,
                theme: loggedInUser.preferences?.theme || 'light'
            }
        })
    }, [navigate])

    function handleChange(ev) {
        const { name, value, type, checked } = ev.target
        
        if (name.startsWith('preferences.')) {
            const prefKey = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [prefKey]: type === 'checkbox' ? checked : value
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    async function handleSave(ev) {
        ev.preventDefault()
        setIsLoading(true)
        setMessage('')
        
        try {
            // Update user data (this would typically call a backend API)
            const updatedUser = {
                ...user,
                ...formData
            }
            
            // For now, update localStorage (in a real app, this would be a backend call)
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            setIsEditing(false)
            setMessage('Profile updated successfully!')
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000)
        } catch (err) {
            setMessage('Failed to update profile. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    function handleLogout() {
        authService.logout()
        navigate('/login')
    }

    if (!user) {
        return <div>Loading...</div>
    }

    return (
        <section className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h2>User Profile</h2>
                    <div className="profile-actions">
                        {!isEditing && (
                            <button 
                                className="btn-edit" 
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <div className="profile-content">
                    {isEditing ? (
                        <form onSubmit={handleSave} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fullName">Full Name:</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="favoriteCategory">Favorite Toy Category:</label>
                                <select
                                    id="favoriteCategory"
                                    name="preferences.favoriteCategory"
                                    value={formData.preferences.favoriteCategory}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                >
                                    <option value="">Select a category</option>
                                    <option value="On wheels">On wheels</option>
                                    <option value="Box game">Box game</option>
                                    <option value="Art">Art</option>
                                    <option value="Baby">Baby</option>
                                    <option value="Doll">Doll</option>
                                    <option value="Puzzle">Puzzle</option>
                                    <option value="Outdoor">Outdoor</option>
                                    <option value="Battery Powered">Battery Powered</option>
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="preferences.notifications"
                                        checked={formData.preferences.notifications}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                    Receive notifications
                                </label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="theme">Theme:</label>
                                <select
                                    id="theme"
                                    name="preferences.theme"
                                    value={formData.preferences.theme}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn-save" 
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-cancel" 
                                    onClick={() => setIsEditing(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <div className="info-group">
                                <label>Username:</label>
                                <span>{user.username}</span>
                            </div>
                            
                            <div className="info-group">
                                <label>Email:</label>
                                <span>{user.email || 'Not provided'}</span>
                            </div>
                            
                            <div className="info-group">
                                <label>Full Name:</label>
                                <span>{user.fullName || 'Not provided'}</span>
                            </div>
                            
                            <div className="info-group">
                                <label>Favorite Category:</label>
                                <span>{user.preferences?.favoriteCategory || 'Not set'}</span>
                            </div>
                            
                            <div className="info-group">
                                <label>Notifications:</label>
                                <span>{user.preferences?.notifications ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            
                            <div className="info-group">
                                <label>Theme:</label>
                                <span>{user.preferences?.theme || 'light'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
