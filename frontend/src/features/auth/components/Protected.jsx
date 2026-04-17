import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

function Protected({ children, role = "buyer" }) {
    const user = useSelector((state) => state.auth.user)
    const loading = useSelector((state) => state.auth.isLoading)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user && !loading) {
            navigate('/login')
        } else if (user && user.role !== role) {
            navigate('/')
        }
    }, [user, loading, role, navigate])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) return null

    return <>{children}</>
}

export default Protected