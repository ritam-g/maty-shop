import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/store/auth.slice.js'
import productReducer from '../features/product/state/product.slice.js'
import cartReducer from '../features/cart/state/cart.slice.js'
import dashboardReducer from '../features/dashboard/state/dashboard.slice.js'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        dashboard: dashboardReducer
    }
})