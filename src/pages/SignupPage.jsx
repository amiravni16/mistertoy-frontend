import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service.js'
import '../assets/style/cmps/LoginPage.css'

export function SignupPage() {
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '', 
        confirmPassword: '',
        email: '',
        fullName: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleChange(ev) {
        const { name, value } = ev.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    async function onSignup(ev) {
        ev.preventDefault()
        setIsLoading(true)
        setError('')
        
        // Validate passwords match
        if (credentials.password !== credentials.confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }
        
        // Validate password length
        if (credentials.password.length < 6) {
            setError('Password must be at least 6 characters long')
            setIsLoading(false)
            return
        }
        
        try {
            const signupData = {
                username: credentials.username,
                password: credentials.password,
                email: credentials.email,
                fullName: credentials.fullName
            }
            
            await authService.signup(signupData)
            navigate('/profile')
        } catch (err) {
            setError('Signup failed. Username might already exist.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="login-page">
            <div className="login-container">
                <h2>Sign Up for MisterToy</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={onSignup}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
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
                            value={credentials.email}
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
                            value={credentials.fullName}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={credentials.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-info">
                    <p>Already have an account? <button 
                        type="button" 
                        className="btn-signup-link"
                        onClick={() => navigate('/login')}
                    >
                        Login here
                    </button></p>
                </div>
            </div>
        </section>
    )
}
