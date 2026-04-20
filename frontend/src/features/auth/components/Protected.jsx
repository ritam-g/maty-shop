import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function Protected({ children, allowedRoles = null }) {
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.isLoading)

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b1326] flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 animate-pulse">
                        Authenticating Identity...
                    </p>
                </div>
            </div>
        )
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
