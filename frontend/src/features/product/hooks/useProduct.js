import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { store } from '../../../app/app.store';
import {
  addVearientProduct,
  createProduct,
  getAllProducts,
  getProduct,
  getProductById,
} from '../services/product.api';
import {
  setAllProducts,
  setAllProductsFetched,
  setAllProductsFetching,
  setError,
  setLoading,
  setProduct,
  setSellerProductsFetched,
  setSellerProductsFetching,
} from '../state/product.slice';

const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

/**
 * Function Name: UseProduct
 * Purpose: Centralize product CRUD, list fetching, cache flags, and seller dashboard refresh logic.
 * Returns:
 * - Product action handlers used across buyer and seller screens
 */
export function UseProduct() {
  const dispatch = useDispatch();

  /**
   * Function Name: createProductHandeler
   * Purpose: Create a product and invalidate cached buyer/seller lists.
   */
  const createProductHandeler = useCallback(async (productDetails) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await createProduct(productDetails);
      // Invalidate cached lists so dashboard/home fetch fresh data after create.
      dispatch(setSellerProductsFetched(false));
      dispatch(setAllProductsFetched(false));
      return data?.success;
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Function Name: getProductHandeler
   * Purpose: Fetch seller-owned products unless that list is already cached.
   */
  const getProductHandeler = useCallback(async ({ force = false } = {}) => {
    const productState = store.getState().product;

    // Prevent duplicate network calls on mount/remount while keeping force refresh available.
    if (!force && (productState.hasFetchedSellerProducts || productState.isFetchingSellerProducts)) {
      return;
    }

    dispatch(setSellerProductsFetching(true));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await getProduct();
      dispatch(setProduct(Array.isArray(data?.products) ? data.products : []));
      dispatch(setSellerProductsFetched(true));
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setSellerProductsFetching(false));
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Function Name: getAllProductHandeller
   * Purpose: Fetch the buyer-facing product list with lightweight cache guards.
   */
  const getAllProductHandeller = useCallback(async ({ force = false } = {}) => {
    const productState = store.getState().product;

    if (!force && (productState.hasFetchedAllProducts || productState.isFetchingAllProducts)) {
      return;
    }

    dispatch(setAllProductsFetching(true));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await getAllProducts();
      dispatch(setAllProducts(Array.isArray(data?.products) ? data.products : []));
      dispatch(setAllProductsFetched(true));
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
    } finally {
      dispatch(setAllProductsFetching(false));
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Function Name: getProductByIdHandeller
   * Purpose: Fetch one product for detail page rendering.
   */
  const getProductByIdHandeller = useCallback(async (productId) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await getProductById(productId);
      dispatch(setProduct(data.product));
      return data.product;
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Function Name: updateProductVarientHandeler
   * Purpose: Create a product variant and invalidate cached lists so dashboard data reloads cleanly.
   */
  const updateProductVarientHandeler = useCallback(async (data, productId) => {
    const formData = new FormData();

    formData.append('title', data.name);
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('currency', data.currency);
    formData.append('attributes', JSON.stringify(data.attributes || {}));

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const res = await addVearientProduct(formData, productId);
      dispatch(setProduct(res.updatedProduct));
      dispatch(setSellerProductsFetched(false));
      dispatch(setAllProductsFetched(false));
      return res;
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    createProductHandeler,
    getProductHandeler,
    getAllProductHandeller,
    getProductByIdHandeller,
    updateProductVarientHandeler,
  };
}
