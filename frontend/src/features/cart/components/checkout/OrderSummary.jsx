import React from "react";
import { motion as Motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import {
  formatPrice,
  getPrimaryImage,
  getProductTitle,
  getVariantIdFromItem,
  getVariantLabel,
  getUnitPrice,
} from "../../utils/cart.utils.js";

function OrderSummary({
  items,
  totals,
  currency = "INR",
  isPlacing = false,
  onPlaceOrder,
}) {
  const deliveryFee = totals.totalItems > 0 ? 49 : 0;
  const finalTotal = Number(totals.total || 0) + deliveryFee;

  return (
    <Motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 md:p-7 shadow-2xl lg:sticky lg:top-28"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-white">Order Summary</h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-100">
          <Sparkles size={12} />
          Premium
        </span>
      </div>

      <div className="max-h-[20rem] space-y-3 overflow-auto pr-1">
        {items.map((item, index) => {
          const unit = getUnitPrice(item);
          const variantId = getVariantIdFromItem(item);
          return (
            <Motion.article
              key={`${item.productId}-${variantId}-${index}`}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 + (index * 0.04), duration: 0.3 }}
              className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/65 p-3"
            >
              <img
                src={getPrimaryImage(item.product)}
                alt={getProductTitle(item.product)}
                className="h-16 w-16 rounded-xl object-cover border border-white/10"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{getProductTitle(item.product)}</p>
                <p className="mt-1 truncate text-[11px] text-slate-400">{getVariantLabel(item.product, variantId)}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-bold text-white">
                    {formatPrice(unit.amount * item.quantity, unit.currency)}
                  </span>
                </div>
              </div>
            </Motion.article>
          );
        })}
      </div>

      <div className="my-6 h-px bg-white/10" />

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-slate-300">
          <span>Subtotal</span>
          <span className="font-semibold text-white">{formatPrice(totals.subtotal || 0, currency)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Delivery Fee</span>
          <span className="font-semibold text-white">{formatPrice(deliveryFee, currency)}</span>
        </div>
      </div>

      <div className="my-6 h-px bg-white/10" />

      <div className="mb-5 flex items-center justify-between">
        <span className="text-slate-300 font-semibold">Total</span>
        <span className="text-3xl font-black tracking-tight text-white">
          {formatPrice(finalTotal, currency)}
        </span>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isPlacing || items.length === 0}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest transition-transform duration-300 hover:scale-[1.02] shadow-[0_12px_30px_rgba(79,70,229,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlacing ? "Placing Order..." : "Place Order"}
      </button>

      <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={14} className="text-indigo-300" />
        Secure checkout powered by encrypted transactions
      </p>
    </Motion.aside>
  );
}

export default OrderSummary;
