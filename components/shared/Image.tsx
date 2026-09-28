import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ImageOff } from 'lucide-react';
import Modal from './modal/Modal';
import { dur } from '@/lib/motion';

type ImageProps = {
  src: string;
  alt: string;
  /** Only used if you explicitly want a real fallback image; otherwise a
   *  built-in "image unavailable" placeholder renders (no /images/no-image.png
   *  asset ships with the app, so a broken image used to fall back to
   *  ANOTHER broken image — the browser's native broken-image icon). */
  fallbackSrc?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  rounded?: boolean;
  border?: boolean;
  lazy?: boolean;
  width?: number | string;
  height?: number | string;
  srcSet?: string;
  sizes?: string;
  showLoader?: boolean;
  showImageInModalOnClick?: boolean
  onClick?: () => void
};

function ImageComponent({
  src,
  alt,
  fallbackSrc,
  className = '',
  objectFit = 'cover',
  rounded = false,
  border = false,
  lazy = true,
  width = '100%',
  height = 'auto',
  srcSet,
  sizes,
  showLoader = false,
  showImageInModalOnClick = false,
  onClick,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);

  // Without this, a component instance reused across a changing `src` (e.g.
  // stepping through a gallery) keeps whatever error/loaded state it last
  // had: once one image 404s, every later image reuses that same instance
  // and renders the fallback forever, even though its own src is fine.
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  const handleError = () => setError(true);
  const handleLoad = () => setLoaded(true);

  const hasIntrinsicSize = typeof width === 'number' && typeof height === 'number';
  const clickable = !!onClick || showImageInModalOnClick;

  const style = {
    objectFit,
    width: hasIntrinsicSize ? '100%' : width,
    height: hasIntrinsicSize ? 'auto' : height,
    maxWidth: hasIntrinsicSize ? width : undefined,
    aspectRatio: hasIntrinsicSize ? `${width} / ${height}` : undefined,
    transitionDuration: `${dur.slow * 1000}ms`,
  } as React.CSSProperties;

  const combinedClass = clsx(
    className,
    rounded && 'rounded-lg',
    border && 'border border-border',
    showLoader && !loaded && 'bg-muted animate-pulse',
    'transition-opacity ease-out',
    showLoader && (loaded ? 'opacity-100' : 'opacity-0'),
  );

  // Broken and no explicit fallback image given: render an intentional
  // "unavailable" placeholder instead of an <img src="..."> pointing at
  // another URL that can 404 too (which used to be a nonexistent local
  // asset — a broken image falling back to another broken image).
  if (error && !fallbackSrc) {
    return (
      <div
        role="img"
        aria-label={`${alt || 'Image'} unavailable`}
        style={style}
        className={clsx(
          combinedClass,
          'flex flex-col items-center justify-center gap-1 bg-muted text-muted-foreground',
        )}
      >
        <ImageOff className="h-5 w-5" />
        <span className="text-[10px] leading-tight">Unavailable</span>
      </div>
    );
  }

  return (
    <>
      {showImageInModalOnClick && (
        <Modal
          title='Image preview'
          size='sm'
          isOpen={openImageModal}
          onClose={() => setOpenImageModal(false)}
        >
          <img
            src={error ? fallbackSrc : src}
            alt={alt}
            onError={handleError}
            className="w-full h-full rounded-md"
            srcSet={srcSet}
            sizes={sizes}
          />
        </Modal>
      )}

      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
        className={clsx(combinedClass, clickable && 'cursor-pointer')}
        loading={lazy ? 'lazy' : 'eager'}
        srcSet={srcSet}
        sizes={sizes}
        onClick={clickable ? () => {
          if (onClick) {
            onClick();
            return;
          }
          setOpenImageModal(true)
        } : undefined}
      />
    </>
  );
}

export default ImageComponent;
