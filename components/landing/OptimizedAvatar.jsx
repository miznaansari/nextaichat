"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import manifest from "@/public/avatars/compressed/manifest.json";

export default function OptimizedAvatar({
  src,
  alt = "AI Persona Avatar",
  className = "",
  style = {},
  priority = false,
  fetchPriority,
  sizes,
  onError: customOnError,
  ...props
}) {
  const [isInView, setIsInView] = useState(priority);
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const containerRef = useRef(null);
  const highResRef = useRef(null);

  // Compute multi-res high WebP (350w), small WebP (150w), low 180p preview & original fallback
  const { highWebpSrc, smWebpSrc, lowWebpSrc, blurDataUrl, originalSrc } = useMemo(() => {
    if (!src || typeof src !== "string" || src.includes("unsplash.com")) {
      const fallbackEntry = manifest["tutor_ananya"] || manifest["kota_verma_teacher"] || {};
      return {
        highWebpSrc: fallbackEntry.webp || "/avatars/compressed/tutor_ananya.webp",
        smWebpSrc: fallbackEntry.sm || "/avatars/compressed/tutor_ananya-sm.webp",
        lowWebpSrc: fallbackEntry.low || "/avatars/compressed/tutor_ananya-low.webp",
        blurDataUrl: fallbackEntry.blur || null,
        originalSrc: fallbackEntry.original || "/avatars/tutor_ananya.png",
      };
    }

    const matches = src.match(/\/avatars\/([^/.]+)\.(png|jpg|jpeg|webp)$/i);
    if (matches && matches[1]) {
      const baseName = matches[1];
      const entry = manifest[baseName];
      if (entry) {
        return {
          highWebpSrc: entry.webp,
          smWebpSrc: entry.sm || entry.webp,
          lowWebpSrc: entry.low || entry.webp,
          blurDataUrl: entry.blur || null,
          originalSrc: entry.original || src,
        };
      }
      return {
        highWebpSrc: `/avatars/compressed/${baseName}.webp`,
        smWebpSrc: `/avatars/compressed/${baseName}-sm.webp`,
        lowWebpSrc: `/avatars/compressed/${baseName}-low.webp`,
        blurDataUrl: null,
        originalSrc: src,
      };
    }

    return {
      highWebpSrc: src,
      smWebpSrc: src,
      lowWebpSrc: src,
      blurDataUrl: null,
      originalSrc: src,
    };
  }, [src]);

  const activeHighSrc = hasError ? originalSrc : highWebpSrc;
  const activeSmSrc = hasError ? originalSrc : smWebpSrc;

  // IntersectionObserver: Trigger HQ image download only when scrolled near element
  useEffect(() => {
    if (priority || isInView) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Instant check for cached images to prevent any transition delay
  useEffect(() => {
    if (isInView && highResRef.current && highResRef.current.complete && highResRef.current.naturalWidth > 0) {
      setHighResLoaded(true);
    }
  }, [isInView, activeHighSrc]);

  const handleImageError = (e) => {
    if (!hasError && activeHighSrc !== originalSrc) {
      setHasError(true);
    }
    if (customOnError) {
      customOnError(e);
    }
  };

  const responsiveSrcSet = hasError
    ? undefined
    : `${activeSmSrc} 150w, ${activeHighSrc} 350w`;

  const responsiveSizes = sizes || "(max-width: 640px) 150px, (max-width: 1024px) 280px, 350px";

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-neutral-900/60 ${className}`}
      style={style}
    >
      {/* 1. Low-Res 180p Blurred Preview (Instant rendering ~0.8 KiB) */}
      <img
        src={lowWebpSrc}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover filter blur-md scale-105 transition-opacity duration-300 pointer-events-none ${
          highResLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={blurDataUrl ? { backgroundImage: `url("${blurDataUrl}")`, backgroundSize: "cover" } : {}}
      />

      {/* 2. Responsive WebP Image (Automatically serves 150px ~5KiB image for small dimensions) */}
      {isInView && (
        <img
          ref={(node) => {
            highResRef.current = node;
            if (node && node.complete && node.naturalWidth > 0 && !highResLoaded) {
              setHighResLoaded(true);
            }
          }}
          src={activeHighSrc}
          srcSet={responsiveSrcSet}
          sizes={responsiveSizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(fetchPriority ? { fetchPriority } : priority ? { fetchPriority: "high" } : {})}
          onLoad={() => setHighResLoaded(true)}
          onError={handleImageError}
          className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ease-out ${
            highResLoaded ? "opacity-100" : "opacity-0"
          }`}
          {...props}
        />
      )}
    </div>
  );
}
