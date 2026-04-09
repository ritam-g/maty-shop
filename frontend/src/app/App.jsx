import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from '../routes'
import { Provider } from 'react-redux'
import { store } from './app.store'
function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>

    </>
  )
}

export default App
