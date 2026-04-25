import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart, getCart, makeOrders, updateCartItemQuantity } from "../services/api.service.js";
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
   * Purpose: Make a payment and return the order object
   */
  async function handelPaymentCart({ amount, currency }) {
    const response = await makeOrders({ amount, currency })
    console.log(response.order);
    
    return response.order

  }
  return {
    handleGetCart,
    handleAddToCart,
    handleUpdateCartItemQuantity,
    handelPaymentCart
  };
};
