import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRevenue } from "../../cart/services/api.service.js";
import {
  setDashboardLoading,
  setDashboardError,
  clearDashboardError,
  setRevenue,
} from "../state/dashboard.slice.js";

/**
 * Function Name: useRevenue
 * Purpose: Custom hook to fetch and manage total revenue from backend
 */
export const useRevenue = () => {
  const dispatch = useDispatch();
  const { revenue, isLoading, error } = useSelector((state) => state.dashboard);

  const handleFetchRevenue = useCallback(async () => {
    dispatch(setDashboardLoading(true));
    dispatch(clearDashboardError());
    try {
      const response = await getAllRevenue();
      // Assuming response structure has the revenue inside it
      const fetchedRevenue = response?.revenue ?? response?.totalRevenu ?? response?.data ?? 0;
      dispatch(setRevenue(fetchedRevenue));
      return fetchedRevenue;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to fetch revenue";
      dispatch(setDashboardError(message));
      throw err;
    } finally {
      dispatch(setDashboardLoading(false));
    }
  }, [dispatch]);

  return {
    revenue,
    isLoading,
    error,
    fetchRevenue: handleFetchRevenue,
  };
};
