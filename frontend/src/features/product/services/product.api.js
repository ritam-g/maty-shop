import axios from "axios";

const productApi = axios.create({
    baseURL: '/api/product',
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