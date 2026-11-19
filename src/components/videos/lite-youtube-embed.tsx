'use client';

import * as React from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiteYouTubeEmbedProps {
  readonly youtubeId: string;
  readonly title: string;
  readonly className?: string;
}

export function LiteYouTubeEmbed({
  youtubeId,
  title,
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
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
      />

      {/* Ambient Gradient */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0A0A0A]/90 border border-[#27272A] flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all shadow-xl">
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
        </div>
      </div>
    </div>
  );
}
