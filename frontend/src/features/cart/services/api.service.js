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


/**  
 * Function Name: makeOrders
 * Purpose: Create a payment order on the backend
 * Params:
 * - amount: Payment amount (number, positive)
 * - currency: Currency code (INR or USD, will be normalized)
 * Returns:
 * - { success: true, order: { id, amount, currency, status } }
 * Throws:
 * - Error if validation fails or API request fails
 */
export async function makeOrders({ amount, currency = 'INR' }) {
    try {
        // Client-side validation
        const numAmount = Number(amount);
        if (!Number.isFinite(numAmount) || numAmount <= 0) {
            throw new Error('Amount must be a positive number greater than 0');
        }

        const normalizedCurrency = String(currency).trim().toUpperCase();
        const supportedCurrencies = ['INR', 'USD'];
        if (!supportedCurrencies.includes(normalizedCurrency)) {
            throw new Error(`Unsupported currency: ${currency}. Supported: ${supportedCurrencies.join(', ')}`);
        }

        console.log(`[API] Creating payment order - Amount: ${numAmount} ${normalizedCurrency}`);

        // Make API request
        const response = await cartApi.post('/payment/create/order', {
            amount: numAmount,
            currency: normalizedCurrency,
        });

        if (!response.data?.success) {
            throw new Error(response.data?.message || 'Failed to create order');
        }

        if (!response.data?.order?.id) {
            throw new Error('Invalid response: Order ID missing');
        }

        console.log(`[API] Order created - ID: ${response.data.order.id}`);

        return response.data;
    } catch (error) {
        // Extract meaningful error message
        const errorMessage = error?.response?.data?.message
            || error?.message
            || 'Failed to create payment order';
        const errorStatus = error?.response?.status;

        console.error('[API] Payment order creation failed:', {
            status: errorStatus,
            message: errorMessage,
            amount,
            currency,
        });

        // Re-throw with context
        const paymentError = new Error(errorMessage);
        paymentError.status = errorStatus;
        throw paymentError;
    }

}

export async function paymentVerification({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
    const response = await cartApi.post('/payment/verify/order', {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
    })
    return response.data
}

/**
 * Function Name: getOrderDetails
 * Purpose: Fetch order details by Razorpay payment ID.
 *          Only returns orders that belong to the authenticated user.
 * Params:
 * - paymentId: Razorpay payment ID (pay_*)
 * Returns:
 * - Order details including paymentId, orderId, status, price, orderItems
 * Throws:
 * - Error if order not found or user is not authorized
 */
export async function getOrderDetails(paymentId) {
    const response = await cartApi.get(`/order/${paymentId}`)
    return response.data
}
