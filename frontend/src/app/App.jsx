import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '../routes'

import useAuth from '../features/auth/hooks/useAuth'

/**
 * Function Name: App
 * Purpose: Bootstrap routing and restore the logged-in user on first app load.
 * Returns:
 * - Root application shell
 */
function App() {
  const { handleGetme } = useAuth()
  
  useEffect(() => {
    handleGetme()
  }, [])
 
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
