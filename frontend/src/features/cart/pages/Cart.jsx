import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowRight, AwardIcon, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "../../product/components/layout/Container";
import Navbar from "../../product/components/layout/Navbar";
import CartItemCard from "../components/CartItemCard";
import CartSummary from "../components/CartSummary";
import { useCart } from "../hooks/useCart";
import { removeItem, restoreItems, setItemQuantity } from "../state/cart.slice.js";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import {
  getCartItemKey,
  getCartTotals,
  getProductIdFromItem,
  getVariantIdFromItem,
  getVariantStock,
  normalizeCartItems,
} from "../utils/cart.utils.js";

function Toast({ toast }) {
  if (!toast) return null;
  const palette = toast.type === "error"
    ? "border-rose-400/30 bg-rose-500/20 text-rose-100"
    : "border-emerald-400/30 bg-emerald-500/20 text-emerald-100";

  return (
    <Motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      className={`fixed top-6 right-6 z-[70] px-4 py-3 rounded-2xl border backdrop-blur-xl font-semibold text-sm shadow-2xl ${palette}`}
    >
      {toast.message}
    </Motion.div>
  );
}

function CartLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6 lg:gap-8 animate-pulse">
      <section className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-3xl border border-white/10 bg-slate-900/60 p-6">
            <div className="flex gap-4">
              <div className="w-28 aspect-square rounded-2xl bg-white/10" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/2 bg-white/10 rounded" />
                <div className="h-4 w-1/3 bg-white/10 rounded" />
                <div className="h-10 w-44 bg-white/10 rounded-2xl mt-5" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <aside className="h-fit">
        <CartSummary isLoading />
      </aside>
    </div>
  );
}

function EmptyCartState({ onStartShopping }) {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 text-center"
    >
      <Motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mx-auto w-28 h-28 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-slate-800 border border-indigo-300/20 flex items-center justify-center shadow-[0_20px_60px_rgba(79,70,229,0.25)]"
      >
        <ShoppingBag size={36} className="text-indigo-200" />
      </Motion.div>

      <h2 className="mt-6 text-3xl font-black tracking-tight text-white">Your cart is empty</h2>
      <p className="mt-3 text-slate-400 max-w-lg mx-auto">
        Looks like you have not added anything yet. Explore the collection and find something worth owning.
      </p>

      <Motion.button
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={onStartShopping}
        className="mt-8 inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-xs shadow-[0_10px_30px_rgba(79,70,229,0.4)]"
      >
        Start Shopping
        <ArrowRight size={16} />
      </Motion.button>
    </Motion.section>
  );
}

/**
 * Function Name: Cart
 * Purpose: Fetch, display, and update the authenticated user's cart.
 * Returns:
 * - Full cart page with optimistic quantity controls and summary
 */
function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleAddToCart, handleGetCart, handleUpdateCartItemQuantity, handelPaymentCart, handelPaymentVerificaiton } = useCart();
  const { items, isLoading, error } = useSelector((state) => state.cart);
  const user = useSelector(state => state.auth.user)
  //! const { Razorpay } = useRazorpay();
  const { error: razorpayError, isLoading: razorpayLoading, Razorpay } = useRazorpay();
  const [pendingMap, setPendingMap] = useState({});
  const pendingLocks = React.useRef(new Set()); // Synchronous lock for race conditions
  const [toast, setToast] = useState(null);

  const cartItems = useMemo(() => normalizeCartItems(items), [items]);
  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);
  const displayCurrency = useMemo(() => {
    const first = cartItems[0];
    const fromProduct = first?.product?.currency;
    const fromItem = first?.price?.currency;
    return fromProduct || fromItem || "INR";
  }, [cartItems]);

  useEffect(() => {
    handleGetCart().catch(() => { });
  }, [handleGetCart]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const setPending = useCallback((key, value) => {
    // Synchronous update to prevent fast double-clicks before React state updates
    if (value) {
      pendingLocks.current.add(key);
    } else {
      pendingLocks.current.delete(key);
    }
    setPendingMap((prev) => ({ ...prev, [key]: value }));
  }, []);

  const showToast = useCallback((type, message) => {
    setToast({ id: Date.now(), type, message });
  }, []);

  /**
   * Function Name: handleIncrease
   * Purpose: Optimistically increase cart quantity, then persist that change on the backend.
   * Params:
   * - item: Selected cart item
   */
  const handleIncrease = useCallback(async (item) => {
    const key = getCartItemKey(item);
    // Synchronous check prevents race conditions from rapid spam clicking
    if (!key || pendingLocks.current.has(key)) return;

    const productId = getProductIdFromItem(item);
    const variantId = getVariantIdFromItem(item);
    const stockLimit = getVariantStock(item?.product, variantId);
    
    // Always validate using current cart quantity on the frontend
    const currentQty = Math.max(1, Number(item?.quantity || 1));

    if (!productId || !variantId) {
      showToast("error", "Variant is missing for this item.");
      return;
    }

    // Check stock BEFORE updating UI or triggering API
    if (Number.isFinite(stockLimit) && currentQty >= stockLimit) {
      showToast("error", "Cannot add beyond available stock.");
      return;
    }

    // Save previous state for rollback
    const snapshot = cartItems.map((entry) => ({ ...entry }));
    dispatch(setItemQuantity({ key, quantity: currentQty + 1 }));
    setPending(key, true);

    try {
      // Trigger API call (only one click = one request due to pendingLocks)
      await handleAddToCart({ productId, variantId, quantity: 1 });
    } catch (requestError) {
      // Always overwrite with server truth on error
      dispatch(restoreItems(snapshot));
      showToast("error", requestError?.response?.data?.message || "Unable to update quantity.");
    } finally {
      setPending(key, false);
    }
  }, [cartItems, dispatch, handleAddToCart, setPending, showToast]);

  /**
   * Function Name: handleDecrease
   * Purpose: Optimistically decrease cart quantity, then save the new exact quantity on the backend.
   * Params:
   * - item: Selected cart item
   */
  const handleDecrease = useCallback(async (item) => {
    const key = getCartItemKey(item);
    // Synchronous check prevents race conditions
    if (!key || pendingLocks.current.has(key)) return;

    const currentQty = Math.max(1, Number(item?.quantity || 1));
    if (currentQty <= 1) return;

    const productId = getProductIdFromItem(item);
    const variantId = getVariantIdFromItem(item);
    if (!productId || !variantId) {
      showToast("error", "Variant is missing for this item.");
      return;
    }

    const snapshot = cartItems.map((entry) => ({ ...entry }));
    dispatch(setItemQuantity({ key, quantity: currentQty - 1 }));
    setPending(key, true);

    try {
      await handleUpdateCartItemQuantity({ productId, variantId, quantity: currentQty - 1 });
    } catch (requestError) {
      dispatch(restoreItems(snapshot));
      showToast("error", requestError?.response?.data?.message || "Unable to update quantity.");
    } finally {
      setPending(key, false);
    }
  }, [cartItems, dispatch, handleUpdateCartItemQuantity, setPending, showToast]);

  /**
   * Function Name: handleRemove
   * Purpose: Remove a cart line locally first, then persist removal on the backend.
   * Params:
   * - item: Selected cart item
   */
  const handleRemove = useCallback(async (item) => {
    const key = getCartItemKey(item);
    // Synchronous check prevents race conditions
    if (!key || pendingLocks.current.has(key)) return;

    const productId = getProductIdFromItem(item);
    const variantId = getVariantIdFromItem(item);

    const snapshot = cartItems.map((entry) => ({ ...entry }));
    dispatch(removeItem({ key }));
    setPending(key, true);

    try {
      if (productId && variantId) {
        await handleUpdateCartItemQuantity({ productId, variantId, quantity: 0 });
      }
      showToast("success", "Item removed from cart.");
    } catch (requestError) {
      dispatch(restoreItems(snapshot));
      showToast("error", requestError?.response?.data?.message || "Unable to remove item.");
    } finally {
      setPending(key, false);
    }
  }, [cartItems, dispatch, handleUpdateCartItemQuantity, setPending, showToast]);

  const handleCheckout = useCallback(async ({ total = 10, displayCurrency = "INR" }) => {
    try {
      if (totals.totalItems <= 0) {
        showToast("error", "Your cart is empty.");
        return;
      }

      console.log("[Checkout] Starting payment process - Amount:", total, "Currency:", displayCurrency);

      // Step 1: Create order on backend
      let order;
      try {
        order = await handelPaymentCart({ amount: total, currency: displayCurrency });
      } catch (error) {
        const errorMsg = error?.message || "Failed to create payment order. Please try again.";
        console.error("[Checkout] Order creation failed:", errorMsg);
        showToast("error", errorMsg);
        return;
      }

      if (!order?.id) {
        console.error("[Checkout] Invalid order response - missing order ID", order);
        showToast("error", "Invalid order data received. Please try again.");
        return;
      }

      console.log("[Checkout] Order created successfully - ID:", order.id);

      // Step 2: Prepare Razorpay options with actual order data
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ShjhyRmrT6o4a5",
        amount: order.amount, // Amount already in paise/cents from backend
        currency: order.currency || "INR",
        name: "Your Store Name",
        description: `Order #${order.id}`,
        order_id: order.id, // ✅ Use actual order ID from backend
        handler: async (response) => {
          console.log("[Checkout] Payment successful - Response:", response);
          showToast("success", "Payment completed successfully!");
          // TODO: Verify payment on backend and update order status
          const ORDER = await handelPaymentVerificaiton(response)
          console.log('====================================');
          console.log('after api call ', ORDER);
          console.log('====================================');
          if (ORDER.success) {
            // Use razorpay_payment_id from the payment response for the URL parameter
            navigate(`/order/${response.razorpay_payment_id}`)
          }


        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.contact || "",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: () => {
            console.log("[Checkout] Payment modal dismissed by user");
            showToast("error", "Payment cancelled. Please try again.");
          },
        },
      };

      console.log("[Checkout] Razorpay options:", options);

      // Step 3: Open Razorpay checkout
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.on("payment.failed", (error) => {
        console.error("[Checkout] Payment failed - Error:", error);
        showToast("error", `Payment failed: ${error.description}`);
      });
      razorpayInstance.open();
    } catch (error) {
      console.error("[Checkout] Unexpected error:", error);
      showToast("error", "An unexpected error occurred. Please try again.");
    }
  }, [navigate, showToast, totals.totalItems, user, handelPaymentCart]);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-12%] right-[-10%] h-[44rem] w-[44rem] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute bottom-[-18%] left-[-12%] h-[44rem] w-[44rem] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      <Navbar />

      <AnimatePresence>
        <Toast key={toast?.id} toast={toast} />
      </AnimatePresence>

      <main className="relative pt-28 pb-20">
        <Container>
          <header className="mb-8 md:mb-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Your Cart</h1>
            <p className="mt-2 text-slate-400">Review your selections and complete checkout seamlessly.</p>
          </header>

          {isLoading && cartItems.length === 0 && <CartLoadingSkeleton />}

          {!isLoading && cartItems.length === 0 && (
            <EmptyCartState onStartShopping={() => navigate("/")} />
          )}

          {cartItems.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6 lg:gap-8 items-start">
              <section className="space-y-4">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={getCartItemKey(item)}
                      item={item}
                      isPending={Boolean(pendingMap[getCartItemKey(item)])}
                      onIncrease={handleIncrease}
                      onDecrease={handleDecrease}
                      onRemove={handleRemove}
                    />
                  ))}
                </AnimatePresence>
              </section>

              <div className="lg:sticky lg:top-28">
                <CartSummary
                  totals={totals}
                  currency={displayCurrency}
                  isLoading={isLoading}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

export default Cart;
