import React from "react";
import { Loader2, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import VariantAttributeDisplay from "./VariantAttributeDisplay";

/**
 * Function Name: ProductInfoPanel
 * Purpose: Show core purchase information and allow users to switch variants from the hero panel.
 * Returns:
 * - Product information card
 */
function ProductInfoPanel({
  badgeText,
  productTitle,
  description,
  priceText,
  stockMeta,
  stockText,
  selectedVariantAttributes,
  variantOptions,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  canAddToCart,
  isAdding,
  hasVariants,
}) {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-slate-900/72 p-6 shadow-[0_25px_70px_rgba(2,6,23,0.4)] backdrop-blur-xl md:p-8">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-indigo-300">
          {badgeText}
        </span>
        <span className="h-1 w-1 rounded-full bg-white/25" />
        <Badge variant={stockMeta.variant}>{stockMeta.label}</Badge>
      </div>

      <h1 className="mt-5 text-3xl font-black leading-none tracking-tight text-white sm:text-4xl lg:text-5xl">
        {productTitle}
      </h1>

      <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
        <p className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          {priceText}
        </p>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Current price
        </p>
      </div>

      <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-300">
        {description}
      </p>

      <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
          Availability
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              stockMeta.variant === "error"
                ? "bg-rose-400"
                : stockMeta.variant === "warning"
                  ? "bg-amber-300"
                  : "bg-emerald-400"
            }`}
          />
          <p className="text-sm font-semibold text-slate-200">{stockText}</p>
        </div>
      </div>

      {hasVariants && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">
              Choose variant
            </p>
            {selectedVariant?.label && (
              <p className="text-xs font-semibold text-slate-400">{selectedVariant.label}</p>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {variantOptions.map((entry) => {
              const isSelected = entry.id === selectedVariant?.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onVariantChange(entry)}
                  className={`rounded-[1.4rem] border p-3 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-300 bg-indigo-500/15 text-white shadow-[0_0_0_1px_rgba(129,140,248,0.35)]"
                      : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/30 hover:text-white"
                  } ${!entry.isAvailable ? "cursor-not-allowed opacity-45" : ""}`}
                  disabled={!entry.isAvailable}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                      <img
                        src={entry.previewImage}
                        alt={entry.label}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{entry.label}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{entry.priceText}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedVariantAttributes.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {selectedVariantAttributes.map(([key, value]) => (
                <VariantAttributeDisplay
                  key={`${selectedVariant?.id || "variant"}-${key}`}
                  name={key}
                  value={value}
                  emphasized
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <Button
          variant="primary"
          onClick={onAddToCart}
          disabled={!canAddToCart}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-200 text-xs font-black uppercase tracking-[0.28em] text-slate-950 shadow-[0_20px_55px_rgba(99,102,241,0.35)] hover:from-indigo-400 hover:to-indigo-100"
        >
          {isAdding ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
          Add to cart
        </Button>

        {!hasVariants && (
          <p className="mt-3 text-sm text-amber-300">
            Add a product variant in seller panel to enable purchase.
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-slate-300" />
          <span>Fast delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-slate-300" />
          <span>Trusted checkout</span>
        </div>
      </div>
    </aside>
  );
}

export default ProductInfoPanel;
