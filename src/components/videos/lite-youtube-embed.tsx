'use client';

import * as React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiteYouTubeEmbedProps {
  readonly youtubeId: string;
  readonly title: string;
  readonly duration?: string;
  readonly quality?: string;
  readonly isUnlisted?: boolean;
  readonly className?: string;
}

export function LiteYouTubeEmbed({
  youtubeId,
  title,
  duration,
  quality,
  isUnlisted,
  className,
}: LiteYouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Fallback if no youtubeId is provided
  if (!youtubeId) {
    return (
      <div
        className={cn(
          'relative w-full aspect-video rounded-xl bg-zinc-100 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] flex items-center justify-center text-xs text-zinc-400 font-mono',
          className
        )}
      >
        <span>Video bağlantısı henüz girilmedi.</span>
      </div>
    );
  }

  const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  if (isLoaded) {
    return (
      <div
        className={cn(
          'relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-200 dark:border-[#1F1F1F] shadow-md',
          className
        )}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsLoaded(true)}
      role="button"
      tabIndex={0}
      aria-label={`${title} videosunu oynat`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsLoaded(true);
        }
      }}
      className={cn(
        'group relative w-full aspect-video rounded-xl overflow-hidden bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] hover:border-zinc-400 dark:hover:border-[#333333] transition-colors cursor-pointer shadow-sm select-none',
        className
      )}
    >
      {/* Poster Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
      />

      {/* Ambient Gradient */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

      {/* Top Left Badge: Liste Dışı */}
      {isUnlisted && (
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] text-[11px] font-mono text-[#A1A1AA] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Liste Dışı
          </span>
        </div>
      )}

      {/* Bottom Right Duration Badge */}
      {duration && (
        <div className="absolute bottom-3 right-3">
          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] font-mono text-xs text-white">
            {duration}
          </span>
        </div>
      )}

      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0A0A0A]/90 border border-[#27272A] flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all shadow-xl">
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
        </div>
      </div>
    </div>
  );
}
