import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  product: [],
  allProducts: [],
  isLoading: false,
  error: null,
  hasFetchedAllProducts: false,
  isFetchingAllProducts: false,
  hasFetchedSellerProducts: false,
  isFetchingSellerProducts: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    setAllProductsFetched: (state, action) => {
      state.hasFetchedAllProducts = action.payload;
    },
    setAllProductsFetching: (state, action) => {
      state.isFetchingAllProducts = action.payload;
    },
    setSellerProductsFetched: (state, action) => {
      state.hasFetchedSellerProducts = action.payload;
    },
    setSellerProductsFetching: (state, action) => {
      state.isFetchingSellerProducts = action.payload;
    },
  },
});

export const {
  setProduct,
  setLoading,
  setError,
  setAllProducts,
  setAllProductsFetched,
  setAllProductsFetching,
  setSellerProductsFetched,
  setSellerProductsFetching,
} = productSlice.actions;

export default productSlice.reducer;
