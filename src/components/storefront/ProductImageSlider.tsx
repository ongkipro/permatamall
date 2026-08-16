import React, { useEffect, useRef, useState } from 'react';

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
  const gallery = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchOffset, setTouchOffset] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(() => new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(() => new Set());
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(gallery.length - 1, 0)));
  }, [gallery.length]);

  useEffect(() => {
    const thumbnail = thumbnailRefs.current[activeIndex];
    if (!thumbnail) return;
    requestAnimationFrame(() => {
      thumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    });
  }, [activeIndex]);

  const selectImage = (index: number, focusThumbnail = false) => {
    setActiveIndex(index);
    if (focusThumbnail) {
      requestAnimationFrame(() => thumbnailRefs.current[index]?.focus());
    }
  };

  const showPrevious = () => {
    if (gallery.length < 2) return;
    setActiveIndex((current) =>
      current === 0 ? gallery.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    if (gallery.length < 2) return;
    setActiveIndex((current) =>
      current === gallery.length - 1 ? 0 : current + 1,
    );
  };

  const handleThumbnailKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = index === 0 ? gallery.length - 1 : index - 1;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = index === gallery.length - 1 ? 0 : index + 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = gallery.length - 1;
    }
    if (nextIndex === null) return;
    event.preventDefault();
    selectImage(nextIndex, true);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setTouchOffset(0);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setTouchOffset((event.touches[0]?.clientX ?? touchStartX.current) - touchStartX.current);
  };

  const handleTouchEnd = () => {
    if (touchOffset <= -35) showNext();
    if (touchOffset >= 35) showPrevious();
    touchStartX.current = null;
    setTouchOffset(0);
  };

  return (
    <div className="relative flex w-full select-none flex-col gap-2.5 md:flex-row md:gap-3">
      {gallery.length > 1 && (
        <div
          role="tablist"
          aria-label="Pilih foto produk"
          aria-orientation="horizontal"
          className="no-scrollbar order-2 flex w-full gap-2 overflow-x-auto md:order-1 md:max-h-[500px] md:w-16 md:shrink-0 md:flex-col md:overflow-y-auto md:overflow-x-hidden"
        >
          {gallery.map((imageUrl, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={`${imageUrl}-${index}`}
                ref={(element) => {
                  thumbnailRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls="product-gallery-panel"
                aria-label={`Lihat foto ${index + 1} dari ${gallery.length}`}
                onClick={() => selectImage(index)}
                onKeyDown={(event) => handleThumbnailKeyDown(event, index)}
                className={`group relative aspect-[3/4] w-14 shrink-0 overflow-hidden border transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] md:w-full ${
                  isActive
                    ? 'border-[#C5A880] opacity-100 ring-1 ring-[#C5A880]'
                    : 'border-[#E5E5E5] opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={imageUrl}
                  alt=""
                  width={64}
                  height={85}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </button>
            );
          })}
        </div>
      )}

      <div
        id="product-gallery-panel"
        role="region"
        aria-roledescription="carousel"
        aria-label={`Galeri foto ${productName}`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPrevious();
          } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            showNext();
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="group relative order-1 flex aspect-[3/4] w-full items-center justify-center overflow-hidden border border-[#E5E5E5] bg-[#F8F7F4] touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] md:order-2"
      >
        {gallery.length > 0 ? (
          <div
            className={`flex h-full w-full ${
              touchStartX.current === null
                ? 'transition-transform duration-300 ease-out'
                : ''
            }`}
            style={{
              transform: `translate3d(calc(${-activeIndex * 100}% + ${touchOffset}px), 0, 0)`,
            }}
          >
            {gallery.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-slide-${index}`}
                className="relative h-full w-full shrink-0"
                aria-hidden={activeIndex !== index}
              >
                {!loadedImages.has(index) && !failedImages.has(index) && (
                  <div className="absolute inset-0 animate-pulse bg-slate-100" />
                )}
                {failedImages.has(index) ? (
                  <div className="flex h-full items-center justify-center px-6 text-center text-xs font-semibold text-slate-500">
                    Foto tidak dapat dimuat
                  </div>
                ) : (
                  <img
                    src={imageUrl}
                    alt={`${productName} foto ${index + 1}`}
                    width={480}
                    height={640}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    onLoad={() =>
                      setLoadedImages((current) => new Set(current).add(index))
                    }
                    onError={() =>
                      setFailedImages((current) => new Set(current).add(index))
                    }
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center text-slate-500">
            <svg
              aria-hidden="true"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m3 16 5-5 4 4 2-2 7 7M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              />
            </svg>
            <span className="text-xs font-semibold">Foto produk belum tersedia</span>
          </div>
        )}

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {badgeText && (
            <span className="bg-[#111111] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#F8F7F4] shadow-xs">
              {badgeText}
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-[#C5A880] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#111111] shadow-xs">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {gallery.length > 0 && (
          <div className="pointer-events-none absolute bottom-3 right-3 z-10 border border-[#E5E5E5] bg-white/95 px-2 py-1 text-[10px] font-bold text-[#111111] shadow-xs backdrop-blur-xs">
            {activeIndex + 1} / {gallery.length}
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#E5E5E5] bg-white/90 text-[#111111] shadow-xs transition hover:bg-[#111111] hover:text-[#F8F7F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-[#E5E5E5] bg-white/90 text-[#111111] shadow-xs transition hover:bg-[#111111] hover:text-[#F8F7F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
