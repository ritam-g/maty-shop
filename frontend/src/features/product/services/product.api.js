import axios from "axios";

/**
 * Base URL for product API endpoints
 * 
 * DEVELOPMENT (Localhost):
 * Uses http://localhost:5000/api/product for local backend
 * 
 * PRODUCTION (Render):
 * Uses https://maty-shop.onrender.com/api/product for hosted backend
 * 
 * Configuration: Set VITE_API_BASE_URL in .env.local for production/Render URL
 * Example: VITE_API_BASE_URL=https://maty-shop.onrender.com
 */
//! render const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://maty-shop.onrender.com';
// const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const apiBaseUrl = 'http://localhost:3000';

const productApi = axios.create({
    // LOCAL: http://localhost:5000/api/product
    // PRODUCTION: https://maty-shop.onrender.com/api/product (set via VITE_API_BASE_URL)
    baseURL: `${apiBaseUrl}/api/product`,
    withCredentials: true
})



export async function createProduct(productDetails) {
    const resposne = await productApi.post('/create', productDetails)
    return resposne.data
}
export async function getProduct() {
    const resposne = await productApi.get('/getProduct')
    return resposne.data
}


export async function getAllProducts() {
    const response = await productApi.get('/')
    return response.data
}

export async function getProductById(id) {
    const response = await productApi.get(`/${id}`)
    return response.data
}
export async function addVearientProduct(payload, productId) {
    const response = await productApi.post(`/${productId}/variants`, payload)
    return response.data
}

/**
 * Search across all products (buyer-facing global search).
 * Returns an array of matching product objects.
 * @param {string} query - partial search text
 */
export async function searchProducts(query) {
    const response = await productApi.get('/search', { params: { q: query } })
    // Backend returns { products: [...] } — normalise to plain array.
    return Array.isArray(response.data?.products)
        ? response.data.products
        : Array.isArray(response.data) ? response.data : []
}

/**
 * Search only the authenticated seller's products.
 * @param {string} query - partial search text
 */
export async function searchSellerProducts(query) {
    const response = await productApi.get('/seller/search', { params: { q: query } })
    return Array.isArray(response.data?.products)
        ? response.data.products
        : Array.isArray(response.data) ? response.data : []
}
