'use client';

import * as React from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  readonly src: string;
  readonly className?: string;
}

export function AudioPlayer({ src, className }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackRate, setPlaybackRate] = React.useState(1);

  const RATES = [1, 1.5, 2] as const;

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const cycleRate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const currentIndex = RATES.indexOf(playbackRate as typeof RATES[number]);
    const nextIndex = (currentIndex + 1) % RATES.length;
    const nextRate = RATES[nextIndex]!;
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressRef.current;
    if (!audio || !bar || duration === 0) return;

    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    audio.currentTime = ratio * duration;
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 my-6',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Skip Back */}
      <button
        type="button"
        onClick={() => skip(-15)}
        className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="15 saniye geri"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>

      {/* Play / Pause */}
      <button
        type="button"
        onClick={togglePlay}
        className="flex items-center justify-center h-9 w-9 rounded-full border border-zinc-300 dark:border-zinc-700 bg-background text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </button>

      {/* Skip Forward */}
      <button
        type="button"
        onClick={() => skip(15)}
        className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="15 saniye ileri"
      >
        <RotateCw className="h-3.5 w-3.5" />
      </button>

      {/* Time */}
      <span className="text-[11px] font-mono text-muted-foreground tabular-nums min-w-[36px]">
        {formatTime(currentTime)}
      </span>

      {/* Progress Bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        className="flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 cursor-pointer relative group"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-foreground transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      {/* Duration */}
      <span className="text-[11px] font-mono text-muted-foreground tabular-nums min-w-[36px]">
        {formatTime(duration)}
      </span>

      {/* Playback Rate */}
      <button
        type="button"
        onClick={cycleRate}
        className="text-[11px] font-mono font-medium text-muted-foreground hover:text-foreground min-w-[32px] text-center rounded px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Oynatma hızı: ${playbackRate}x`}
      >
        {playbackRate}x
      </button>
    </div>
  );
}

