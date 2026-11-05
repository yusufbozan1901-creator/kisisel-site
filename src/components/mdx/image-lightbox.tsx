'use client';

import * as React from 'react';
import { X } from 'lucide-react';

export function ImageLightbox() {
  const [src, setSrc] = React.useState<string | null>(null);
  const [alt, setAlt] = React.useState('');

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'IMG' &&
        target.closest('.prose-editorial')
      ) {
        const img = target as HTMLImageElement;
        setSrc(img.src);
        setAlt(img.alt || '');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSrc(null);
    };

    if (src) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [src]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
      onClick={() => setSrc(null)}
      role="dialog"
      aria-modal="true"
      aria-label="Görsel önizleme"
    >
      <button
        type="button"
        onClick={() => setSrc(null)}
        className="absolute top-4 right-4 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        aria-label="Kapat"
      >
        <X className="h-5 w-5" />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg select-none"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

