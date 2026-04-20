import { createSlice } from "@reduxjs/toolkit";
import {
  getCartItemKey,
  getProductIdFromItem,
  getVariantIdFromItem,
  normalizeCartItems,
} from "../utils/cart.utils.js";

const findItemIndexByKey = (items, key) => items.findIndex((item) => getCartItemKey(item) === key);

const buildOptimisticItem = (payload) => ({
  ...payload,
  product: payload?.product || payload,
  productId: getProductIdFromItem(payload),
  variantId: getVariantIdFromItem(payload),
  varient: getVariantIdFromItem(payload),
  quantity: Math.max(1, Number(payload?.quantity || 1)),
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = normalizeCartItems(action.payload);
    },
    restoreItems: (state, action) => {
      state.items = normalizeCartItems(action.payload);
    },
    upsertItemOptimistic: (state, action) => {
      const incoming = buildOptimisticItem(action.payload);
      const itemKey = getCartItemKey(incoming);

      const existingIndex = findItemIndexByKey(state.items, itemKey);
      if (existingIndex === -1) {
        state.items.push(incoming);
        return;
      }

      const nextQuantity = state.items[existingIndex].quantity + incoming.quantity;
      state.items[existingIndex].quantity = Math.max(1, Number(nextQuantity || 1));
    },
    setItemQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const index = findItemIndexByKey(state.items, key);
      if (index === -1) return;

      const nextQty = Math.max(0, Number(quantity || 0));
      if (nextQty === 0) {
        state.items.splice(index, 1);
        return;
      }

      state.items[index].quantity = nextQty;
    },
    removeItem: (state, action) => {
      const { key } = action.payload;
      state.items = state.items.filter((item) => getCartItemKey(item) !== key);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setItems,
  restoreItems,
  upsertItemOptimistic,
  setItemQuantity,
  removeItem,
  setLoading,
  setError,
  clearError,
} = cartSlice.actions;
export default cartSlice.reducer;
