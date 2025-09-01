import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './assets/style/main.css'

import { UserMsg } from './cmps/UserMsg'
import { AppFooter } from './cmps/AppFooter'
import { AppHeader } from './cmps/AppHeader'
import { AboutUs } from './pages/AboutUS'
import { ToyDashboard } from './pages/ToyDashboard'
import { ToyDetails } from './pages/ToyDetails'
import { ToyEdit } from './pages/ToyEdit'
import { ToyIndex } from './pages/ToyIndex'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ProfilePage } from './pages/ProfilePage'
import { store } from './store/store'
import { HomePage } from './pages/HomePage'
import { useEffect } from 'react'
import { loadToyLabels, loadToys } from './store/actions/toy.actions'

export function App() {
    useEffect(() => {
        loadToys()
        loadToyLabels()
    }, [])
    
    return (
        <Provider store={store}>
            <Router>
                <section className="main-layout app">
                    <AppHeader />
                    <main>
                        <Routes>
                            <Route element={<HomePage />} path="/" />
                            <Route element={<AboutUs />} path="/about" />
                            <Route element={<ToyDashboard />} path="/dashboard" />
                            <Route element={<LoginPage />} path="/login" />
                            <Route element={<SignupPage />} path="/signup" />
                            <Route element={<ProfilePage />} path="/profile" />
                            <Route element={<ToyIndex />} path="/toy" />
                            <Route element={<ToyEdit />} path="/toy/edit/:toyId?" />
                            <Route element={<ToyDetails />} path="/toy/:toyId" />
                        </Routes>
                    </main>
                    <AppFooter />
                </section>
            </Router>
            <UserMsg />
        </Provider>
    )
}
