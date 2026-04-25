import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart, getCart, makeOrders, updateCartItemQuantity, paymentVerification } from "../services/api.service.js";
import { clearError, setError, setItems, setLoading } from "../state/cart.slice.js";

/**
 * Function Name: useCart
 * Purpose: Encapsulate cart API calls and sync server responses into Redux state.
 * Returns:
 * - Cart action handlers used by product and cart screens
 */
export const useCart = () => {
  const dispatch = useDispatch();

  /**
   * Function Name: handleGetCart
   * Purpose: Rehydrate cart state from the backend, especially after reload.
   * Returns:
   * - Latest cart response
   */
  const handleGetCart = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const data = await getCart();
      dispatch(setItems(data?.cart?.items || []));
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to fetch cart";
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Function Name: handleAddToCart
   * Purpose: Add one variant to cart and replace Redux items with server truth.
   * Params:
   * - productId: Product id
   * - variantId: Variant id
   * - quantity: Quantity increment
   * Returns:
   * - Updated cart response
   */
  const handleAddToCart = useCallback(async ({ productId, variantId, quantity = 1 }) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const response = await addToCart({ productId, variantId, quantity });
      dispatch(setItems(response?.cart?.items || []));
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to add item to cart";
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Function Name: handleUpdateCartItemQuantity
   * Purpose: Persist quantity changes from the cart page and sync Redux with the backend.
   * Params:
   * - productId: Product id
   * - variantId: Variant id
   * - quantity: New absolute quantity
   * Returns:
   * - Updated cart response
   */
  const handleUpdateCartItemQuantity = useCallback(async ({ productId, variantId, quantity }) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const response = await updateCartItemQuantity({ productId, variantId, quantity });
      dispatch(setItems(response?.cart?.items || []));
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Failed to update cart item";
      dispatch(setError(message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**  
   * Function Name: handelPaymentCart
   * Purpose: Create a payment order and return order details for Razorpay checkout
   * Params:
   * - amount: Payment amount (number, positive)
   * - currency: Currency code (INR or USD, case-insensitive)
   * Returns: Order object with { id, amount, currency }
   * Throws: Error with meaningful message on failure
   */
  const handelPaymentCart = useCallback(async ({ amount, currency = 'INR' }) => {
    try {
      // Validate inputs
      const numAmount = Number(amount);
      if (!Number.isFinite(numAmount) || numAmount <= 0) {
        throw new Error('Invalid amount: must be a positive number');
      }

      const normalizedCurrency = String(currency).trim().toUpperCase();

      console.log(`[Hook] Creating payment order - Amount: ${numAmount} ${normalizedCurrency}`);

      // Call API to create order
      const response = await makeOrders({
        amount: numAmount,
        currency: normalizedCurrency,
      });

      if (!response?.order) {
        throw new Error('Invalid response: Order data missing');
      }

      console.log(`[Hook] Order created - ID: ${response.order.id}`);

      // Return order with all necessary details
      return response.order;
    } catch (error) {
      const errorMessage = error?.message || 'Failed to create payment order';

      console.error('[Hook] Payment error:', {
        amount,
        currency,
        errorMessage,
      });

      // Re-throw so caller can handle
      throw new Error(errorMessage);
    }
  }, []);

  async function handelPaymentVerificaiton({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
    const response = await paymentVerification({ razorpay_payment_id, razorpay_order_id, razorpay_signature })
    return response
  }
  return {
    handleGetCart,
    handleAddToCart,
    handleUpdateCartItemQuantity,
    handelPaymentCart,
    handelPaymentVerificaiton
  };
};
