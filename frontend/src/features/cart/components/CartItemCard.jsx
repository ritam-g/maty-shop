import React from "react";
import { motion as Motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  formatPrice,
  getPrimaryImage,
  getProductTitle,
  getUnitPrice,
  getVariantIdFromItem,
  getVariantLabel,
  getVariantStock,
} from "../utils/cart.utils.js";

function CartItemCard({ item, isPending = false, onIncrease, onDecrease, onRemove }) {
  const product = item?.product || {};
  const quantity = Math.max(1, Number(item?.quantity || 1));
  const variantId = getVariantIdFromItem(item);
  const unitPrice = getUnitPrice(item);
  const stockLimit = getVariantStock(product, variantId);
  const subtotal = unitPrice.amount * quantity;

  const cannotDecrease = isPending || quantity <= 1;
  const cannotIncrease = isPending || (Number.isFinite(stockLimit) && quantity >= stockLimit);
  
  return (
    <Motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-2xl"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-28 lg:w-32 aspect-square shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-slate-950/50">
          <img
            src={getPrimaryImage(product)}
            alt={getProductTitle(product)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-white text-lg font-bold line-clamp-1">{getProductTitle(product)}</h3>
              <p className="text-slate-400 text-sm mt-1 line-clamp-1">{getVariantLabel(product, variantId)}</p>
              {Number.isFinite(stockLimit) && (
                <p className="text-xs font-semibold text-indigo-300 mt-2">
                  Stock: {stockLimit}
                </p>
              )}
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Unit Price</p>
              <p className="text-white text-xl font-black">{formatPrice(unitPrice.amount, unitPrice.currency)}</p>
              <p className="text-slate-400 text-sm mt-1">Subtotal {formatPrice(subtotal, unitPrice.currency)}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-2xl border border-white/10 bg-slate-950/40 overflow-hidden">
              <button
                type="button"
                onClick={() => onDecrease(item)}
                disabled={cannotDecrease}
                className="h-10 w-10 grid place-content-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Decrease quantity for ${getProductTitle(product)}`}
              >
                <Minus size={16} />
              </button>
              <span className="h-10 min-w-12 px-3 grid place-content-center text-white font-bold text-sm border-x border-white/10">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onIncrease(item)}
                disabled={cannotIncrease}
                className="h-10 w-10 grid place-content-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Increase quantity for ${getProductTitle(product)}`}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item)}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 h-10 text-rose-200 hover:bg-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={15} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </Motion.article>
  );
}

export default CartItemCard;
