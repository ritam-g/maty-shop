import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalPrice: 0,
  revenue: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
    },
    clearDashboardError: (state) => {
      state.error = null;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setRevenue: (state, action) => {
      state.revenue = action.payload;
    },
  },
});

export const {
  setDashboardLoading,
  setDashboardError,
  clearDashboardError,
  setTotalPrice,
  setRevenue,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
