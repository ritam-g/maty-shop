import React, { useEffect, useRef } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '../routes'
import { useSelector } from 'react-redux'

import useAuth from '../features/auth/hooks/useAuth'
import { useCart } from '../features/cart/hooks/useCart'

/**
 * Function Name: App
 * Purpose: Bootstrap routing and restore the logged-in user on first app load.
 * Returns:
 * - Root application shell
 */
function App() {
  const { handleGetme } = useAuth()
  const { handleGetCart } = useCart()
  const user = useSelector((state) => state.auth.user)
  const hydratedCartForUserRef = useRef(null)
  
  useEffect(() => {
    let isCancelled = false

    async function bootstrapApp() {
      const currentUser = await handleGetme()
      if (isCancelled || !currentUser) return

      try {
        await handleGetCart()
        const hydratedUserId = currentUser?.id || currentUser?._id || null
        hydratedCartForUserRef.current = hydratedUserId
      } catch {
        // Cart fetch failures are surfaced by cart slice/UI.
      }
    }

    bootstrapApp()

    return () => {
      isCancelled = true
    }
  }, [handleGetCart, handleGetme])

  useEffect(() => {
    if (!user) return

    const userId = user?.id || user?._id || null
    if (hydratedCartForUserRef.current === userId) return

    handleGetCart()
      .then(() => {
        hydratedCartForUserRef.current = userId
      })
      .catch(() => {})
  }, [handleGetCart, user])
 
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
