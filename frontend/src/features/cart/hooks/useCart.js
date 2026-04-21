import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart, getCart, updateCartItemQuantity } from "../services/api.service.js";
import { clearError, setError, setItems, setLoading } from "../state/cart.slice.js";

export const useCart = () => {
  const dispatch = useDispatch();

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

  return {
    handleGetCart,
    handleAddToCart,
    handleUpdateCartItemQuantity,
  };
};
