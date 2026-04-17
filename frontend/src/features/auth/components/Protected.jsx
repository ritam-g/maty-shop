import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function Protected({ children, allowedRoles = null }) {
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.isLoading)

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default Protected
