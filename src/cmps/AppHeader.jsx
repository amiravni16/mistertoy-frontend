import { NavLink } from 'react-router-dom'
import { authService } from '../services/auth.service.js'
import { useState, useEffect } from 'react'
import '../assets/style/cmps/AppHeader.css'

export function AppHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedInUser = authService.getLoggedinUser()
            setIsLoggedIn(!!loggedInUser)
            setUser(loggedInUser)
        }

        checkLoginStatus()
        
        // Listen for storage changes (when user logs in/out)
        window.addEventListener('storage', checkLoginStatus)
        
        return () => {
            window.removeEventListener('storage', checkLoginStatus)
        }
    }, [])

    const handleLogout = () => {
        authService.logout()
        setIsLoggedIn(false)
        setUser(null)
    }

    return (
        <section className="app-header">
            <div className="container">
                <div className="flex justify-between">
                    <nav>
                        <NavLink to="/">home</NavLink> |
                        <NavLink to="/toy">toys</NavLink> |
                        <NavLink to="/dashboard">dashboard</NavLink> |
                        <NavLink to="/about">about</NavLink> |
                        {isLoggedIn ? (
                            <>
                                <NavLink to="/profile">profile</NavLink> |
                                <button onClick={handleLogout} className="btn-logout-header">
                                    logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login">login</NavLink>
                        )}
                    </nav>
                </div>
                <div className="logo">Mister Toy</div>
                {isLoggedIn && user && (
                    <div className="user-info">
                        Welcome, {user.username}!
                    </div>
                )}
            </div>
        </section>
    )
}
