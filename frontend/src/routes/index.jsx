import { createBrowserRouter } from 'react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import CreateProduct from '../features/product/pages/CreateProduct'
import ProductList from '../features/product/pages/ProductList'

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
        path: '/create-product',
        element: <CreateProduct />
    },
    {
        path: '/products',
        element: <ProductList />
    }
])