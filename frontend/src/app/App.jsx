import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '../routes'

import useAuth from '../features/auth/hooks/useAuth'
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
