import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { AppFooter } from './cmps/AppFooter'
import { AppHeader } from './cmps/AppHeader'
import { ProtectedRoute } from './cmps/ProtectedRoute'
import { UserMsg } from './cmps/UserMsg'
import { About } from './pages/About'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ProfilePage } from './pages/ProfilePage'
import { ToyDashboard } from './pages/ToyDashboard'
import { ToyDetails } from './pages/ToyDetails'
import { ToyEdit } from './pages/ToyEdit'
import { ToyIndex } from './pages/ToyIndex'
import { UserDetails } from './pages/UserDetails'
import { ReviewExplore } from './pages/ReviewExplore'
import { store } from './store/store'

function App() {
    return (
        <Provider store={store}>
            <Router>
                <section className="main-layout app">
                    <AppHeader />
                    <main>
                        <Routes>
                            <Route element={<HomePage />} path="/" />
                            <Route element={<About />} path="/about" />
                            <Route element={<LoginPage />} path="/login" />
                            <Route element={<SignupPage />} path="/signup" />
                            <Route element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } path="/profile" />
                            <Route element={<ToyDashboard />} path="/dashboard" />
                            <Route element={<ToyIndex />} path="/toy" />
                            <Route element={
                                <ProtectedRoute requireAdmin={true}>
                                    <ToyEdit />
                                </ProtectedRoute>
                            } path="/toy/edit/:toyId?" />
                            <Route element={<ToyDetails />} path="/toy/:toyId" />
                            <Route element={<UserDetails />} path="/user/:userId" />
                            <Route element={<ReviewExplore />} path="/reviews" />
                        </Routes>
                    </main>
                    <AppFooter />
                </section>
            </Router>
            <UserMsg />
        </Provider>
    )
}

export default App
