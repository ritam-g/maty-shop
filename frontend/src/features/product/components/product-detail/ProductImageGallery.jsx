import React from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { handleProductImageError } from "../../utils/image.utils";

const IMAGE_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };

function ProductImageGallery({ title, images, activeImage, onImageSelect }) {
  const galleryImages = Array.isArray(images) && images.length > 0 ? images : [];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-[0_30px_80px_rgba(2,6,23,0.45)] md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row-reverse">
        <div className="group relative min-h-[22rem] flex-1 overflow-hidden rounded-[1.5rem] bg-[#0b1018] sm:min-h-[28rem] lg:min-h-[36rem]">
          <AnimatePresence mode="wait">
            <Motion.img
              key={activeImage}
              src={activeImage}
              alt={title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={IMAGE_TRANSITION}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={handleProductImageError}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.05),rgba(2,6,23,0.5))]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>Hover to zoom</span>
            <span>{galleryImages.length} views</span>
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto lg:w-24 lg:flex-col">
            {galleryImages.map((image, index) => {
              const isActive = image === activeImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => onImageSelect(image)}
                  className={`group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border bg-slate-950/80 transition-all duration-300 lg:h-24 lg:w-24 ${
                    isActive
                      ? "border-indigo-400 shadow-[0_0_0_1px_rgba(129,140,248,0.35)]"
                      : "border-white/10 hover:border-white/30"
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${title} thumbnail ${index + 1}`}
                    className={`h-full w-full object-cover transition duration-300 ${
                      isActive ? "scale-95" : "opacity-70 group-hover:opacity-100"
                    }`}
                    onError={handleProductImageError}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductImageGallery;
