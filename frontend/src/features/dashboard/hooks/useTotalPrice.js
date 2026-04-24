import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartTotalPrice } from "../../cart/services/api.service.js";
import {
  setDashboardLoading,
  setDashboardError,
  clearDashboardError,
  setTotalPrice,
} from "../state/dashboard.slice.js";

/**
 * Function Name: useTotalPrice
 * Purpose: Custom hook to fetch and manage total cart price from backend
 */
export const useTotalPrice = () => {
  const dispatch = useDispatch();
  const { totalPrice, isLoading, error } = useSelector((state) => state.dashboard);

  const handleFetchTotalPrice = useCallback(async () => {
    dispatch(setDashboardLoading(true));
    dispatch(clearDashboardError());
    try {
      const response = await getCartTotalPrice();
      // Assuming response contains a structure like { totalPrice: 100 } or { data: { totalPrice: 100 } }
      // Adjust this based on actual backend response structure
      const fetchedPrice = response?.totalPrice ?? response?.cartTotal ?? response?.data?.totalPrice ?? 0;
      dispatch(setTotalPrice(fetchedPrice));
      return fetchedPrice;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch total price";
      dispatch(setDashboardError(message));
      throw err;
    } finally {
      dispatch(setDashboardLoading(false));
    }
  }, [dispatch]);

  return {
    totalPrice,
    isLoading,
    error,
    fetchTotalPrice: handleFetchTotalPrice,
  };
};
