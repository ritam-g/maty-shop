import axios from 'axios'

const cartApi = axios.create({
    baseURL: '/api/cart',
    withCredentials: true
})

export async function addToCart({ productId, variantId, quantity = 1 }) {
    const response = await cartApi.get(`/add/${productId}/${variantId}/${quantity}`)
    return response.data
}
export async function getCart() {
    const response = await cartApi.get('/get')
    return response.data
}