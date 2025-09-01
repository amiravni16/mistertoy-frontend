import axios from 'axios'

const BASE_URL = '/api/auth'

export const authService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    isLoggedIn
}

async function login(credentials) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials)
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data))
            return response.data
        }
    } catch (error) {
        console.error('Login failed:', error)
        throw error
    }
}

async function logout() {
    try {
        await axios.post(`${BASE_URL}/logout`)
        localStorage.removeItem('user')
    } catch (error) {
        console.error('Logout failed:', error)
        // Still remove user from localStorage even if backend call fails
        localStorage.removeItem('user')
    }
}

async function signup(credentials) {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, credentials)
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data))
            return response.data
        }
    } catch (error) {
        console.error('Signup failed:', error)
        throw error
    }
}

function getLoggedinUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

function isLoggedIn() {
    return !!getLoggedinUser()
}

