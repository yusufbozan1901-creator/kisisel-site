'use client';

import * as React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  readonly src: string;
  readonly title?: string;
  readonly className?: string;
}

const WAVEFORM_HEIGHTS = [
  35, 55, 25, 70, 90, 45, 65, 80, 40, 60, 85, 30, 75, 95, 50, 65, 40, 80,
  55, 70, 35, 60, 90, 45, 65, 80, 40, 55, 75, 30, 85, 60, 40, 70, 35, 50,
];

export function AudioPlayer({ src, title, className }: AudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const waveformRef = React.useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [playbackRate, setPlaybackRate] = React.useState(1);

  const RATES = [1, 1.5, 2] as const;

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration || 0);
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
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = Math.max(0, Math.min(audio.currentTime + seconds, duration || audio.duration || 0));
    audio.currentTime = target;
    setCurrentTime(target);
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

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = waveformRef.current;
    if (!audio || !bar) return;

    const currentDuration = duration || audio.duration || 0;
    if (currentDuration === 0) return;

    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const target = ratio * currentDuration;
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      className={cn(
        'p-3.5 sm:p-4 rounded-xl bg-zinc-100/90 dark:bg-[#141414] border border-zinc-200 dark:border-[#1F1F1F] flex flex-col space-y-3 transition-colors',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Top Header & Controls */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
            className="w-9 h-9 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-zinc-900 dark:text-white truncate">
              {title || 'Sesli Düşünce'}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-[#71717A]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => skip(-15)}
            className="px-2 py-1 bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#71717A] hover:text-zinc-900 dark:hover:text-white rounded text-[11px] font-mono transition-colors"
            title="15 Saniye Geri"
          >
            -15s
          </button>
          <button
            type="button"
            onClick={() => skip(15)}
            className="px-2 py-1 bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#71717A] hover:text-zinc-900 dark:hover:text-white rounded text-[11px] font-mono transition-colors"
            title="15 Saniye İleri"
          >
            +15s
          </button>
          <button
            type="button"
            onClick={cycleRate}
            className="px-2 py-1 bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#71717A] hover:text-zinc-900 dark:hover:text-white rounded text-[11px] font-mono transition-colors"
            title="Oynatma Hızı"
          >
            {playbackRate.toFixed(1)}x
          </button>
        </div>
      </div>

      {/* Interactive Waveform Visualizer */}
      <div
        ref={waveformRef}
        onClick={handleWaveformClick}
        role="slider"
        aria-label="Ses dalgası kaydırıcı"
        aria-valuenow={Math.round(progressRatio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className="w-full flex items-center h-8 gap-[2.5px] px-1 py-1 cursor-pointer group"
      >
        {WAVEFORM_HEIGHTS.map((height, i) => {
          const barProgress = (i + 1) / WAVEFORM_HEIGHTS.length;
          const isPassed = progressRatio >= barProgress;

          return (
            <div
              key={i}
              style={{ height: `${Math.max(15, height)}%` }}
              className={cn(
                'flex-1 min-w-[2px] max-w-[4px] rounded-full transition-colors duration-100',
                isPassed
                  ? 'bg-zinc-900 dark:bg-white'
                  : 'bg-zinc-300 dark:bg-[#27272A] group-hover:bg-zinc-400 dark:group-hover:bg-[#3F3F46]'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
