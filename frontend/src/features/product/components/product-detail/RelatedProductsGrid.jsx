import React from "react";
import { ArrowRight } from "lucide-react";
import { handleProductImageError } from "../../utils/image.utils";

function RelatedProductsGrid({ products, onProductClick }) {
  if (!Array.isArray(products) || products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-indigo-300">
            Curated pairings
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
            Complete your kit
          </h2>
        </div>
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
          View catalog <ArrowRight size={16} />
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onProductClick(product.id)}
            className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/60 text-left transition-all duration-300 hover:border-white/25 hover:bg-slate-900/80"
          >
            <div className="m-4 overflow-hidden rounded-[1.3rem] bg-slate-950">
              <div className="aspect-[4/5]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                  onError={handleProductImageError}
                />
              </div>
            </div>

            <div className="px-5 pb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Related product
              </p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold leading-6 text-white">{product.title}</h3>
                <p className="shrink-0 text-lg font-black tracking-tight text-white">{product.priceText}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default RelatedProductsGrid;
