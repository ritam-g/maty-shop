import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from '../routes'
import {useSelector } from 'react-redux'

import useAuth from '../features/auth/hooks/useAuth'
function App() {
  const { handleGetme } = useAuth()
  
  useEffect(() => {
    handleGetme()
  }, [])
 
  return (
    <>
      
        <RouterProvider router={router} />
    

    </>
  )
}

export default App
