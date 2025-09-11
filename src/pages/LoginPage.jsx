import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service.js'

export function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleChange(ev) {
        const { name, value } = ev.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    async function onLogin(ev) {
        ev.preventDefault()
        setIsLoading(true)
        setError('')
        
        try {
            await authService.login(credentials)
            navigate('/profile')
        } catch (err) {
            setError('Login failed. Please check your credentials.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="login-page">
            <div className="login-container">
                <h2>Login to MisterToy</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={onLogin}>
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
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="login-info">
                    <p>For testing, you can use:</p>
                    <p><strong>Username:</strong> admin</p>
                    <p><strong>Password:</strong> password</p>
                    <p className="signup-link">
                        Don't have an account? <button 
                            type="button" 
                            className="btn-signup-link"
                            onClick={() => navigate('/signup')}
                        >
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </section>
    )
}

