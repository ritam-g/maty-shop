import React, { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShoppingBag, Package, Clock, Truck } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Container from "../../product/components/layout/Container";
import Navbar from "../../product/components/layout/Navbar";

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const checkCircleVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (id) {
        setOrderData({
          orderId: id,
          status: "confirmed",
          estimatedDelivery: "3-5 Business Days",
        });
      }
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [id]);

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
            Confirming your order...
          </p>
        </div>
      </div>
    );
  }

  const orderId = orderData?.orderId || id || "N/A";

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
              key="success-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
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

              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="glass-dark rounded-3xl p-6 md:p-8 w-full max-w-lg mb-10 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                  <span className="text-slate-400 text-sm font-medium">Order ID</span>
                  <span className="text-white font-mono font-bold text-sm tracking-wide">
                    {orderId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="text-emerald-400" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                      <p className="text-sm font-semibold text-emerald-400">Confirmed</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Clock className="text-indigo-400" size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Delivery</p>
                      <p className="text-sm font-semibold text-white">
                        {orderData?.estimatedDelivery || "3-5 Days"}
                      </p>
                    </div>
                  </div>
                </div>
              </Motion.div>

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