import axios from 'axios'

/**
 * Base URL for cart API endpoints
 * 
 * DEVELOPMENT (Localhost):
 * Uses http://localhost:5000/api/cart for local backend
 * 
 * PRODUCTION (Render):
 * Uses https://maty-shop.onrender.com/api/cart for hosted backend
 * 
 * Configuration: Set VITE_API_BASE_URL in .env.local for production/Render URL
 * Example: VITE_API_BASE_URL=https://maty-shop.onrender.com
 */
//! render const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://maty-shop.onrender.com';
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const apiBaseUrl = 'http://localhost:3000';

const cartApi = axios.create({
    // LOCAL: http://localhost:5000/api/cart
    // PRODUCTION: https://maty-shop.onrender.com/api/cart (set via VITE_API_BASE_URL)
    baseURL: `${apiBaseUrl}/api/cart`,
    withCredentials: true
})


/**
 * Function Name: addToCart
 * Purpose: Ask the backend to add a variant to cart or increase its quantity.
 * Params:
 * - productId: Product id
 * - variantId: Variant id
 * - quantity: Quantity increment
 * Returns:
 * - Updated cart payload from the backend
 */
export async function addToCart({ productId, variantId, quantity = 1 }) {
    const response = await cartApi.get(`/add/${productId}/${variantId}/${quantity}`)
    return response.data
}

/**
 * Function Name: getCart
 * Purpose: Fetch the latest cart from the server so UI can rehydrate after reload.
 * Returns:
 * - Current cart payload
 */
export async function getCart() {
    const response = await cartApi.get('/get')
    return response.data
}

/**
 * Function Name: updateCartItemQuantity
 * Purpose: Set an exact cart quantity for one variant, including zero for removal.
 * Params:
 * - productId: Product id
 * - variantId: Variant id
 * - quantity: New absolute quantity
 * Returns:
 * - Updated cart payload from the backend
 */
export async function updateCartItemQuantity({ productId, variantId, quantity }) {
    const response = await cartApi.patch(`/item/${productId}/${variantId}/${quantity}`)
    return response.data
}

/**
 * Function Name: getCartTotalPrice
 * Purpose: Fetch the total price of the items currently in the cart
 * Returns:
 * - Cart total price object
 */
export async function getCartTotalPrice() {
    const response = await cartApi.get('/totalPrice')
    return response.data
}

/**
 * Function Name: getAllRevenue
 * Purpose: Fetch the total revenue data
 * Returns:
 * - Revenue data object
 */
export async function getAllRevenue() {
    const response = await cartApi.get('/getAllRevenu')
    return response.data
}
