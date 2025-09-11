import { Navigate } from 'react-router-dom'
import { authService } from '../services/auth.service.js'

export function ProtectedRoute({ children, requireAdmin = false }) {
    const user = authService.getLoggedinUser()
    
    if (!user) {
        return <Navigate to="/login" replace />
    }
    
    if (requireAdmin && !user.isAdmin) {
        return <Navigate to="/" replace />
    }
    
    return children
}
