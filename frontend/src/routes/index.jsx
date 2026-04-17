import { createBrowserRouter } from 'react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import CreateProduct from '../features/product/pages/CreateProduct'
import DashBoard from '../features/product/pages/DashBoard'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <h1>Home</h1>
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
        path:'/seller',
        children:[
            {
                path: 'create-product',
                element: <CreateProduct />
            },
            {
                path: 'dashboard',
                element: <DashBoard />
            }
        ]
    }
])