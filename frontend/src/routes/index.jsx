import { createBrowserRouter } from 'react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import CreateProduct from '../features/product/pages/CreateProduct'
import DashBoard from '../features/product/pages/DashBoard'
import Protected from '../features/auth/components/Protected'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Protected><h1>Home</h1></Protected>
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },

    {
        path: '/seller',
        children: [
            {
                path: 'create-product',
                element: <Protected role="seller"> <CreateProduct /></Protected >
            },
            {
                path: 'dashboard',
                element: <Protected role='seller' > <DashBoard /></Protected >
            }
        ]
    }
])