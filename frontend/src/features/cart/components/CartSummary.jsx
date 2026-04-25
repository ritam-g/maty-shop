import React from "react";
import { motion as Motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { formatPrice } from "../utils/cart.utils.js";

function CartSummary({ totals, currency = "INR", isLoading = false, onCheckout }) {
  if (isLoading) {
    return (
      <aside className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl animate-pulse">
        <div className="h-6 w-40 rounded-lg bg-white/10 mb-8" />
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-full rounded bg-white/10" />
          <div className="h-4 w-3/4 rounded bg-white/10" />
        </div>
        <div className="h-px bg-white/10 my-6" />
        <div className="h-5 w-full rounded bg-white/10 mb-6" />
        <div className="h-11 w-full rounded-2xl bg-indigo-500/40" />
      </aside>
    );
  }

  const totalItems = Number(totals?.totalItems || 0);
  const subtotal = Number(totals?.subtotal || 0);
  const discount = Number(totals?.discount || 0);
  const grandTotal = Number(totals?.total || 0);

  return (
    <Motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-xl font-black text-white tracking-tight">Order Summary</h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-indigo-200">
          <Sparkles size={12} />
          Secure
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-center justify-between text-slate-300">
          <span>Total Items</span>
          <span className="font-bold text-white">{totalItems}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Subtotal</span>
          <span className="font-bold text-white">{formatPrice(subtotal, currency)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Discount</span>
          <span className="font-bold text-emerald-300">-{formatPrice(discount, currency)}</span>
        </div>
      </div>

      <div className="h-px bg-white/10 my-6" />

      <div className="flex items-center justify-between mb-6">
        <span className="text-slate-300 font-semibold">Final Total</span>
        <span className="text-2xl font-black text-white tracking-tight">{formatPrice(grandTotal, currency)}</span>
      </div>

      <button
        type="button"
        onClick={() => {
          onCheckout({total:totals.total, displayCurrency:currency });
          
        }}
        disabled={totalItems <= 0}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-500 text-white font-bold uppercase tracking-wider text-xs shadow-[0_12px_30px_rgba(79,70,229,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Checkout
      </button>

      <p className="mt-4 text-xs text-slate-400 flex items-center gap-2">
        <ShieldCheck size={14} className="text-indigo-300" />
        Encrypted checkout with buyer protection
      </p>
    </Motion.aside>
  );
}

export default CartSummary;
