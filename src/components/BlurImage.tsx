import { useEffect, useRef, useState, type ReactNode } from "react";
import { cldBlurSrc } from "../lib/cloudinary";
import { cn } from "../lib/cn";

interface BlurImageProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  /** Layout classes for the wrapper (relative + overflow-hidden always apply). */
  className?: string;
  /** Extra classes for the full image (object-position, hover effects). */
  imgClassName?: string;
  /** Fade the full image in over the blur. Disable for above-the-fold/LCP images. */
  fade?: boolean;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  draggable?: boolean;
}

/**
 * Cloudinary blur-up image (pattern: cloudinary.com/guides/image-effects/
 * blur-image-loading). A ~300-byte `w_32,q_auto:low,e_blur:1000` transform
 * renders instantly beneath the full image, which crossfades in once decoded.
 * Fail-open: the full image is never hidden unless JS is live and it is still
 * loading. Non-Cloudinary srcs fall back to a plain image without the wrapper.
 */
export function BlurImage({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  className,
  imgClassName,
  fade = true,
  loading = "lazy",
  fetchPriority,
  draggable,
}: BlurImageProps): ReactNode {
  const [hidden, setHidden] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const blurSrc = cldBlurSrc(src);

  // Fail open: the full image is visible by default (SSR renders no
  // opacity-0), so it always shows without JS, on hydration failure, or when
  // it finishes before mount. JS hides it only while still in flight, then
  // onLoad/onError crossfades it back in over the blur placeholder.
  useEffect(() => {
    if (!fade) return;
    if (ref.current && !ref.current.complete) setHidden(true);
  }, [fade]);

  const full = (
    <img
      ref={ref}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      draggable={draggable}
      onLoad={() => {
        setHidden(false);
      }}
      onError={() => {
        setHidden(false);
      }}
      className={cn(
        // relative: positioned so it paints above the absolute blur
        // placeholder (DOM order decides among positioned siblings).
        "relative h-full w-full object-cover",
        imgClassName,
        fade && "transition-opacity duration-500",
        hidden && "opacity-0",
      )}
    />
  );

  if (!blurSrc) {
    return fade ? (
      <div className={cn("relative overflow-hidden", className)}>{full}</div>
    ) : (
      full
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        // Same alt as the full image + aria-hidden: the placeholder is the
        // visual twin of the image above it, so both carry descriptive text
        // while screen readers announce it only once.
        src={blurSrc}
        alt={alt}
        aria-hidden="true"
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />
      {full}
    </div>
  );
}
