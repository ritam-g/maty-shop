import Razorpay from 'razorpay';
import { AppConfig } from '../config/config.js';
import { AppError } from '../utils/AppError.js';

/**
 * Initialize Razorpay instance with API credentials from environment
 */
const razorpay = new Razorpay({
    key_id: AppConfig.REZOR_PAY_API_KEY,
    key_secret: AppConfig.REZOR_PAY_API_SECRET,
});

/**
 * Function Name: validatePaymentInput
 * Purpose: Validate amount and currency before creating order
 * Params:
 * - amount: Payment amount in main currency units (e.g., rupees, dollars)
 * - currency: Currency code (INR or USD)
 * Throws: AppError if validation fails
 */
function validatePaymentInput(amount, currency) {
    // Validate amount
    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
        throw new AppError('Amount must be a positive number greater than 0', 400);
    }

    // Validate currency
    const supportedCurrencies = ['INR', 'USD'];
    const normalizedCurrency = String(currency || 'INR').trim().toUpperCase();

    if (!supportedCurrencies.includes(normalizedCurrency)) {
        throw new AppError(
            `Unsupported currency: ${currency}. Supported currencies: ${supportedCurrencies.join(', ')}`,
            400
        );
    }

    return normalizedCurrency;
}

/**
 * Function Name: createOrder
 * Purpose: Create a Razorpay order with proper validation and error handling
 * Params:
 * - amount: Payment amount (will be converted to paise/cents)
 * - currency: Currency code (INR or USD)
 * Returns: Object with { id, amount, currency }
 * Throws: AppError if order creation fails
 */
export async function createOrder({ amount, currency = 'INR' }) {
    try {
        // Validate inputs
        console.log('====================================');
        console.log(amount,currency);
        console.log('====================================');
        const normalizedCurrency = validatePaymentInput(amount, currency);
        const numAmount = Number(amount);

        // Convert to smallest unit: 1 INR = 100 paise, 1 USD = 100 cents
        const amountInSmallestUnit = Math.round(numAmount * 100);

        console.log(
            `[Payment Service] Creating Razorpay order - Amount: ${numAmount} ${normalizedCurrency}, Smallest Unit: ${amountInSmallestUnit}`
        );

        // Create order via Razorpay API
        const orderOptions = {
            amount: amountInSmallestUnit,
            currency: normalizedCurrency,
            receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        const order = await razorpay.orders.create(orderOptions);

        console.log(`[Payment Service] Order created successfully - Order ID: ${order.id}`);

        // Return clean response with only necessary fields
        return {
            id: order.id,
            amount: order.amount, // Already in smallest unit (paise/cents)
            currency: order.currency,
            status: order.status,
        };
    } catch (error) {
        // Log error with context
        console.error('[Payment Service] Error creating order:', {
            amount,
            currency,
            errorMessage: error.message,
            errorCode: error.code,
        });

        // Re-throw AppError as-is
        if (error instanceof AppError) {
            throw error;
        }

        // Handle Razorpay API errors
        if (error.statusCode) {
            throw new AppError(
                `Payment API Error: ${error.message || 'Failed to create order'}`,
                error.statusCode || 500
            );
        }

        // Generic error
        throw new AppError(
            'Failed to create payment order. Please try again.',
            500
        );
    }
}