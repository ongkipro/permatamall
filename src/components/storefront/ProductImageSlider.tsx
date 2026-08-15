import React, { useState, useRef, useEffect } from 'react';

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
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeImage = gallery[activeIndex] || gallery[0];

  useEffect(() => {
    if (thumbnailRefs.current[activeIndex]) {
      thumbnailRefs.current[activeIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex w-full select-none flex-row gap-2.5 sm:gap-3">
      {/* Thumbnails Column (Left) - Synchronized Vertical Scroll */}
      {gallery.length > 1 && (
        <div className="no-scrollbar flex w-14 shrink-0 flex-col gap-2 overflow-y-auto max-h-[420px] sm:w-16 sm:max-h-[500px]">
          {gallery.map((imgUrl, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                ref={(el) => { thumbnailRefs.current[idx] = el; }}
                type="button"
                aria-label={`Lihat foto ${idx + 1} dari ${gallery.length}`}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(idx)}
                className={`group relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-none border transition-all duration-200 focus-visible:outline-none ${
                  isActive
                    ? 'border-[#C5A880] ring-1 ring-[#C5A880] opacity-100 shadow-sm'
                    : 'border-[#E5E5E5] opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C5A880]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main product hero image (Right) - 3:4 Perfect Aspect Ratio */}
      <div
        className="group relative flex flex-1 aspect-[3/4] cursor-zoom-in items-center justify-center overflow-hidden rounded-none border border-[#E5E5E5] bg-[#F8F7F4]"
        onClick={() => setIsFullscreen(true)}
      >
        <img
          src={activeImage}
          alt={`${productName} foto ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="eager"
          decoding="async"
        />

        {/* Badge Overlay Top */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {badgeText && (
            <span className="rounded-none bg-[#111111] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#F8F7F4] shadow-xs">
              {badgeText}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="rounded-none bg-[#C5A880] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#111111] shadow-xs">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Counter Badge Bottom Right */}
        <div className="absolute bottom-3 right-3 z-10 rounded-none border border-[#E5E5E5] bg-white/95 px-2 py-1 text-[10px] font-bold text-[#111111] shadow-xs backdrop-blur-xs">
          {activeIndex + 1} / {gallery.length}
        </div>

        {/* Navigation Arrows */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none border border-[#E5E5E5] bg-white/90 text-[#111111] shadow-xs transition hover:bg-[#111111] hover:text-[#F8F7F4] focus-visible:outline-none active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto Berikutnya"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none border border-[#E5E5E5] bg-white/90 text-[#111111] shadow-xs transition hover:bg-[#111111] hover:text-[#F8F7F4] focus-visible:outline-none active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/95 p-4 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 text-3xl font-light text-[#F8F7F4] transition-colors hover:text-[#C5A880]"
          >
            &times;
          </button>
          <img
            src={activeImage}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] rounded-none object-contain border border-[#C5A880]/30 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
