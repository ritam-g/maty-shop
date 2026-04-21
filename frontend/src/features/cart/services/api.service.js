import axios from 'axios'

const cartApi = axios.create({
    baseURL: '/api/cart',
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
