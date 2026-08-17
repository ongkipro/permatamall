import React, { useState, useRef, useEffect } from 'react';
import { resolveGallerySelectionIndex } from '../../lib/storefront-media';

interface ProductImageSliderProps {
  images: string[];
  productName: string;
  badgeText?: string;
  discountPercentage?: number;
}

export default function ProductImageSlider({
  images,
  productName,
  badgeText,
  discountPercentage = 0,
}: ProductImageSliderProps) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const validImages = Array.from(
    new Set((images && images.length > 0 ? images : []).filter((img) => !failedImages.has(img))),
  );
  const gallery = validImages.length > 0 ? validImages : ['/images/logo.webp'];

  const [activeImageUrl, setActiveImageUrl] = useState(
    () => images[0] || '/images/logo.webp',
  );
  const activeIndex = resolveGallerySelectionIndex(gallery, images, activeImageUrl);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const activeImage = gallery[activeIndex] || gallery[0];

  useEffect(() => {
    if (activeIndex === 0) return;
    const el = thumbnailRefs.current[activeIndex];
    if (el) {
      requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
        });
      });
    }
  }, [activeIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const previousIndex = activeIndex === 0 ? gallery.length - 1 : activeIndex - 1;
    setActiveImageUrl(gallery[previousIndex]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextIndex = activeIndex === gallery.length - 1 ? 0 : activeIndex + 1;
    setActiveImageUrl(gallery[nextIndex]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Minimum swipe threshold of 35px
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const handleImageError = (imgUrl: string) => {
    setFailedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(imgUrl);
      return newSet;
    });
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
                key={imgUrl}
                ref={(el) => { thumbnailRefs.current[idx] = el; }}
                type="button"
                aria-label={`Lihat foto ${idx + 1} dari ${gallery.length}`}
                aria-pressed={isActive}
                onClick={() => setActiveImageUrl(imgUrl)}
                className={`group relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-none border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F593F] focus-visible:ring-offset-1 ${
                  isActive
                    ? 'border-[#6F593F] ring-1 ring-[#6F593F] opacity-100 shadow-sm'
                    : 'border-[#E5E5E5] opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt=""
                  width={64}
                  height={85}
                  sizes="(max-width: 480px) 64px, 80px"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  loading={idx < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={() => handleImageError(imgUrl)}
                />
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#C5A880]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Main product hero image (Right) - Touch Swipe Left/Right Support (No Pop-up) */}
      <div
        className="group relative flex flex-1 aspect-[3/4] items-center justify-center overflow-hidden rounded-none border border-[#E5E5E5] bg-[#F8F7F4] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null;
        }}
      >
        <img
          src={activeImage}
          alt={`${productName}, tampilan ${activeIndex + 1} dari ${gallery.length}`}
          width={480}
          height={640}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={() => handleImageError(activeImage)}
        />

        {/* Badge Overlay Top */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5 pointer-events-none">
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
        <div
          className="absolute bottom-3 right-3 z-10 pointer-events-none rounded-none border border-[#E5E5E5] bg-white/95 px-2 py-1 text-[10px] font-bold text-[#111111] shadow-xs backdrop-blur-xs"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {activeIndex + 1} / {gallery.length}
        </div>

        {/* Navigation Arrows */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto Sebelumnya"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-none border border-[#E5E5E5] bg-white/90 text-[#111111] shadow-xs transition hover:bg-[#111111] hover:text-[#F8F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F593F] active:scale-95 z-20 motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Foto Berikutnya"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-none border border-[#E5E5E5] bg-white/90 text-[#111111] shadow-xs transition hover:bg-[#111111] hover:text-[#F8F7F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F593F] active:scale-95 z-20 motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
