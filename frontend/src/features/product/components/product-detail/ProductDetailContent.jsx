import React from "react";
import { CheckCircle2 } from "lucide-react";
import VariantAttributeDisplay from "./VariantAttributeDisplay";

function ProductDetailContent({
  description,
  highlights,
  variantOptions,
  selectedVariant,
  onVariantChange,
}) {
  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-300">
            Product details
          </p>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-white md:text-3xl">
            Built for a cleaner buying experience
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-slate-300">
            {description}
          </p>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-[#17181d] p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight text-white">
            Highlights
          </h2>

          <div className="mt-6 space-y-5">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-indigo-300" />
                <div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {variantOptions.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-300">
                Style variations
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                Compare available variants
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Selecting a card updates the gallery, stock, and price above.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {variantOptions.map((entry) => {
              const isSelected = entry.id === selectedVariant?.id;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onVariantChange(entry)}
                  className={`overflow-hidden rounded-[1.75rem] border text-left transition-all duration-300 ${
                    isSelected
                      ? "border-indigo-400 bg-slate-900/90 shadow-[0_0_0_1px_rgba(129,140,248,0.35)]"
                      : "border-white/10 bg-slate-900/55 hover:border-white/25"
                  } ${!entry.isAvailable ? "opacity-55" : ""}`}
                  disabled={!entry.isAvailable}
                >
                  <div className="aspect-[5/4] overflow-hidden bg-slate-950">
                    <img
                      src={entry.previewImage}
                      alt={entry.label}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                          Variant
                        </p>
                        <h3 className="mt-2 text-lg font-black text-white">{entry.label}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                        entry.isAvailable
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-rose-500/10 text-rose-300"
                      }`}>
                        {entry.isAvailable ? "Available" : "Sold out"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="text-xl font-black tracking-tight text-white">{entry.priceText}</p>
                      <p className="text-sm font-semibold text-slate-400">
                        {Number.isFinite(entry.remaining) ? `${Math.max(0, entry.remaining)} left` : "Ready"}
                      </p>
                    </div>

                    {entry.attributes.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.attributes.slice(0, 2).map(([key, value]) => (
                          <VariantAttributeDisplay
                            key={`${entry.id}-${key}`}
                            name={key}
                            value={value}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

export default ProductDetailContent;
