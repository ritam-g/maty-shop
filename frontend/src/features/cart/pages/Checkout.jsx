import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../product/components/layout/Container";
import Navbar from "../../product/components/layout/Navbar";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { getCartTotals, normalizeCartItems } from "../utils/cart.utils.js";

const validateCheckoutForm = (values) => {
  const errors = {};

  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  if (!/^\d{10,15}$/.test(values.phone.trim())) errors.phone = "Use 10-15 digits";
  if (!values.address.trim()) errors.address = "Address is required";

  return errors;
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const cartItems = useMemo(() => normalizeCartItems(items), [items]);
  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);
  const currency = useMemo(() => (
    cartItems[0]?.product?.currency || cartItems[0]?.price?.currency || "INR"
  ), [cartItems]);

  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "upi",
  });
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [toast, setToast] = useState(null);
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const errors = useMemo(() => validateCheckoutForm(formValues), [formValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (cartItems.length === 0) return;

    setIsPlacing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      
      // Generate a mock payment ID for testing (in real flow, this comes from Razorpay)
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      setToast({ type: "success", message: "Order placed. Confirmation has been sent to your phone." });
      
      // Navigate to order success page after a short delay
      setTimeout(() => {
        navigate(`/order/${mockPaymentId}`);
      }, 1500);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-14%] right-[-8%] h-[44rem] w-[44rem] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute bottom-[-18%] left-[-14%] h-[46rem] w-[46rem] rounded-full bg-cyan-500/10 blur-[160px]" />
      </div>

      <Navbar />

      <AnimatePresence>
        {toast && (
          <Motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-6 right-6 z-[70] rounded-2xl border border-emerald-400/30 bg-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-100 backdrop-blur-xl shadow-2xl"
          >
            {toast.message}
          </Motion.div>
        )}
      </AnimatePresence>

      <main className="relative pt-28 pb-20">
        <Container>
          <Motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3"
          >
            <div>
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
                Back to Cart
              </button>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Checkout</h1>
              <p className="mt-2 text-slate-400 text-sm">Review your order, add delivery details, and complete purchase.</p>
            </div>
          </Motion.section>

          {cartItems.length === 0 ? (
            <Motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-10 text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-indigo-200">
                <ShoppingBag size={26} />
              </div>
              <h2 className="text-2xl font-black text-white">Your cart is empty</h2>
              <p className="mt-2 text-slate-400">Add products before moving to checkout.</p>
              <Link
                to="/"
                className="mt-7 inline-flex h-11 items-center rounded-2xl bg-indigo-600 px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition-colors"
              >
                Continue Shopping
              </Link>
            </Motion.section>
          ) : (
            <Motion.section
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.08 },
                },
              }}
              className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6 lg:gap-8"
            >
              <Motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                <CheckoutForm
                  values={formValues}
                  errors={errors}
                  touched={touched}
                  isSubmitted={isSubmitted}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Motion.div>

              <Motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
                <OrderSummary
                  items={cartItems}
                  totals={totals}
                  currency={currency}
                  isPlacing={isPlacing}
                  onPlaceOrder={handlePlaceOrder}
                />
              </Motion.div>
            </Motion.section>
          )}

          <AnimatePresence>
            {isSubmitted && Object.keys(errors).length === 0 && toast && (
              <Motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2"
              >
                <CheckCircle2 size={18} />
                Order received successfully.
              </Motion.div>
            )}
          </AnimatePresence>
        </Container>
      </main>
    </div>
  );
}

export default CheckoutPage;
