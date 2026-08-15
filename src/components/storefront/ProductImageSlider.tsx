import React, { useState } from 'react';

interface ProductImageSliderProps {
  images: string[];
  productName: string;
  badgeText?: string;
  discountPercentage?: number;
}

export default function ProductImageSlider({
  images,
  productName,
  badgeText = 'Bestseller',
  discountPercentage = 0,
}: ProductImageSliderProps) {
  const gallery = images && images.length > 0 ? images : ['/images/logo.webp'];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeImage = gallery[activeIndex] || gallery[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full select-none bg-slate-900/5 sm:rounded-2xl sm:overflow-hidden sm:border sm:border-slate-200/80">
      {/* Main Image Frame - Dynamic Contain with Aspect Transition */}
      <div
        className="group relative flex w-full items-center justify-center bg-slate-100/90 transition-all duration-300 min-h-[320px] max-h-[560px] cursor-zoom-in"
        onClick={() => setIsFullscreen(true)}
      >
        <img
          src={activeImage}
          alt={`${productName} foto ${activeIndex + 1}`}
          className="h-auto max-h-[560px] w-full object-contain transition-transform duration-300 group-hover:scale-102"
          loading="eager"
          decoding="async"
        />

        {/* Badge Overlay Top */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {badgeText && (
            <span className="rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-xs">
              {badgeText}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-xs">
              Hemat {discountPercentage}%
            </span>
          )}
        </div>

        {/* Counter Badge Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          {activeIndex + 1} / {gallery.length}
        </div>

        {/* Navigation Arrows */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-md backdrop-blur-xs transition hover:bg-white active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto Berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-md backdrop-blur-xs transition hover:bg-white active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {gallery.length > 1 && (
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto p-3 bg-white border-t border-slate-100">
          {gallery.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                activeIndex === idx
                  ? 'border-emerald-600 ring-2 ring-emerald-600/30 scale-105'
                  : 'border-slate-200 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={imgUrl} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-slate-300 text-3xl font-bold"
          >
            &times;
          </button>
          <img
            src={activeImage}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
