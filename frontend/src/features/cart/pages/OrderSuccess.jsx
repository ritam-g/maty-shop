import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShoppingBag, Package, Clock, AlertCircle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Container from "../../product/components/layout/Container";
import Navbar from "../../product/components/layout/Navbar";
import { useCart } from "../hooks/useCart";

const checkCircleVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

function OrderSuccess() {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { handleGetOrderDetails } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    console.log("[OrderSuccess] paymentId from useParams:", paymentId);
    console.log("[OrderSuccess] paymentId type:", typeof paymentId);
    console.log("[OrderSuccess] paymentId === 'undefined':", paymentId === "undefined");
    
    const fetchOrderDetails = async () => {
      // Handle case where paymentId is undefined, null, or the string "undefined"
      if (!paymentId || paymentId === "undefined" || paymentId === "null") {
        console.error("[OrderSuccess] Invalid paymentId:", paymentId);
        setError("No payment ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await handleGetOrderDetails(paymentId);
        setOrderData(response.order);
      } catch (err) {
        const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch order details";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [paymentId, handleGetOrderDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-14%] right-[-8%] h-[44rem] w-[44rem] rounded-full bg-indigo-600/10 blur-[150px] animate-blob" />
          <div className="absolute bottom-[-18%] left-[-14%] h-[46rem] w-[46rem] rounded-full bg-cyan-500/10 blur-[160px] animate-blob" />
        </div>

        <Navbar />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="text-indigo-400" size={24} />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Loading your order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-14%] right-[-8%] h-[44rem] w-[44rem] rounded-full bg-indigo-600/10 blur-[150px]" />
          <div className="absolute bottom-[-18%] left-[-14%] h-[46rem] w-[46rem] rounded-full bg-cyan-500/10 blur-[160px]" />
        </div>

        <Navbar />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-md mx-auto px-4">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
            <AlertCircle className="text-red-400" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white text-center">Order Not Found</h1>
          <p className="text-slate-400 text-center">
            {error || "We couldn't find this order. It may not exist or you may not have permission to view it."}
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 h-12 px-6 rounded-2xl bg-indigo-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-indigo-500 transition-all"
          >
            <ShoppingBag size={18} />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (amount, currency = "INR") => {
    const formatted = Number(amount || 0).toFixed(2);
    if (currency === "INR") {
      return `₹${formatted}`;
    }
    return `$${formatted}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-14%] right-[-8%] h-[44rem] w-[44rem] rounded-full bg-indigo-600/10 blur-[150px] animate-blob" />
        <div className="absolute bottom-[-18%] left-[-14%] h-[46rem] w-[46rem] rounded-full bg-cyan-500/10 blur-[160px] animate-blob" />
        <div className="absolute top-[20%] left-[30%] h-32 w-32 rounded-full bg-emerald-500/5 blur-[80px]" />
      </div>

      <Navbar />

      <main className="relative pt-32 pb-20">
        <Container>
          <AnimatePresence mode="wait">
            <Motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-xl border border-emerald-400/30 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                  <Motion.svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <Motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="url(#checkGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={checkCircleVariants}
                    />
                    <Motion.path
                      d="M26 40L36 50L54 32"
                      stroke="url(#checkGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={checkCircleVariants}
                    />
                    <defs>
                      <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                    </defs>
                  </Motion.svg>
                </div>
              </Motion.div>

              <Motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-4xl md:text-5xl font-black text-white text-center tracking-tight mb-4"
              >
                Order Confirmed!
              </Motion.h1>

              <Motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-slate-400 text-center text-lg mb-8 max-w-md"
              >
                Thank you for your purchase. Your order has been received and is being processed.
              </Motion.p>

              {/* Order Details Card */}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="glass-dark rounded-3xl p-6 md:p-8 w-full max-w-2xl mb-10 border border-white/10"
              >
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Package size={20} className="text-indigo-400" />
                  Order Details
                </h2>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5">
                      <span className="text-slate-400 text-sm">Payment ID</span>
                      <span className="text-white font-mono text-sm truncate ml-4">
                        {orderData.paymentId || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5">
                      <span className="text-slate-400 text-sm">Order ID</span>
                      <span className="text-white font-mono text-sm truncate ml-4">
                        {orderData.orderId || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5">
                      <span className="text-slate-400 text-sm">Status</span>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        orderData.status === "paid"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {orderData.status?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5">
                      <span className="text-slate-400 text-sm">Date</span>
                      <span className="text-white text-sm">
                        {formatDate(orderData.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 mb-6">
                  <span className="text-slate-300 font-semibold">Total Amount</span>
                  <span className="text-2xl font-black text-white">
                    {formatPrice(orderData.price?.amount, orderData.price?.currency)}
                  </span>
                </div>

                {/* Order Items */}
                {orderData.orderItems && orderData.orderItems.length > 0 && (
                  <>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Order Items ({orderData.orderItems.length})
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {orderData.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 rounded-2xl bg-slate-950/50 border border-white/5"
                        >
                          {item.images && item.images.length > 0 && (
                            <img
                              src={item.images[0].url}
                              alt={item.title}
                              className="h-16 w-16 rounded-xl object-cover border border-white/10"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                              {item.title || "Product"}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Qty: {item.quantity || 1}
                            </p>
                            <p className="text-sm font-semibold text-indigo-400 mt-2">
                              {formatPrice(item.price?.amount, item.price?.currency)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Motion.div>

              {/* Action Buttons */}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <Link
                  to="/"
                  className="group inline-flex items-center gap-3 h-14 px-8 rounded-2xl bg-indigo-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  <ShoppingBag size={18} />
                  Continue Shopping
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <button
                  onClick={() => navigate("/cart")}
                  className="inline-flex items-center gap-3 h-14 px-8 rounded-2xl border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Go to Cart
                </button>
              </Motion.div>
            </Motion.section>
          </AnimatePresence>
        </Container>
      </main>
    </div>
  );
}

export default OrderSuccess;