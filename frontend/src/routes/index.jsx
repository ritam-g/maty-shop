import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Protected from '../features/auth/components/Protected';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Home from '../features/product/pages/Home';
import CreateProduct from '../features/product/pages/CreateProduct';
import DashBoard from '../features/product/pages/DashBoard';
import ProductDetailPage from '../features/product/pages/ProductDetailPage';
import SellerProductDetail from '../features/product/pages/SellerProductDetail';
import Cart from '../features/cart/pages/Cart';
import CheckoutPage from '../features/cart/pages/Checkout';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <Protected>
            <Home />
          </Protected>
        )}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/seller/create-product"
        element={(
          <Protected allowedRoles={['seller']}>
            <CreateProduct />
          </Protected>
        )}
      />

      <Route
        path="/seller/dashboard"
        element={(
          <Protected allowedRoles={['seller']}>
            <DashBoard />
          </Protected>
        )}
      />

      <Route
        path="/seller/product/:productId"
        element={(
          <Protected allowedRoles={['seller']}>
            <SellerProductDetail />
          </Protected>
        )}
      />

      <Route
        path="/product/:id"
        element={(
          <Protected>
            <ProductDetailPage />
          </Protected>
        )}
      />

      <Route
        path="/cart"
        element={(
          <Protected>
            <Cart />
          </Protected>
        )}
      />

      <Route
        path="/checkout"
        element={(
          <Protected>
            <CheckoutPage />
          </Protected>
        )}
      />
    </Routes>
  );
}
