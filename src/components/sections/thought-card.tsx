'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Thought } from '@/lib/thoughts';
import { AudioPlayer } from '@/components/mdx/audio-player';
import { ShareButton } from '@/components/common/share-button';
import { ThoughtPermalink } from '@/components/thoughts/thought-permalink';
import { Sparkles, Star, Mic, Terminal, Quote, Copy, Check } from 'lucide-react';

interface ThoughtCardProps {
  readonly thought: Thought;
}

function formatEpisodeBadge(season?: string, episode?: string): string | null {
  const s = season?.trim();
  const e = episode?.trim();

  if (s && e) {
    const sFormatted = /^\d+$/.test(s) ? `S${s.padStart(2, '0')}` : `S${s}`;
    const eFormatted = /^\d+$/.test(e) ? `B${e.padStart(2, '0')}` : `B${e}`;
    return `${sFormatted} • ${eFormatted}`;
  }
  if (s) {
    return /^\d+$/.test(s) ? `S${s.padStart(2, '0')}` : `S${s}`;
  }
  if (e) {
    return /^\d+$/.test(e) ? `B${e.padStart(2, '0')}` : `B${e}`;
  }
  return null;
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  const [copiedMarkdown, setCopiedMarkdown] = React.useState(false);
  const episodeBadge = formatEpisodeBadge(thought.season, thought.episode);

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(thought.content);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch {
      // Clipboard copy failed
    }
  };

  const getThoughtIcon = () => {
    if (thought.audio || thought.type === 'audio') {
      return <Mic className="w-3.5 h-3.5 text-muted-foreground" />;
    }
    if (thought.type === 'code') {
      return <Terminal className="w-3.5 h-3.5 text-muted-foreground" />;
    }
    if (thought.type === 'quote') {
      return <Quote className="w-3.5 h-3.5 text-muted-foreground" />;
    }
    return <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <article
      id={thought.slug}
      className="relative pl-6 sm:pl-8 group scroll-mt-28"
    >
      {/* Timeline Indicator Node */}
      <span
        aria-hidden="true"
        className="absolute -left-[17px] sm:-left-[21px] top-6 w-3 h-3 rounded-full bg-background border-2 border-foreground ring-2 ring-border transition-transform group-hover:scale-110"
      />

      {/* Main Card Container */}
      <div className="relative flex flex-col bg-card border border-border p-5 sm:p-6 rounded-xl hover:border-foreground/30 transition-colors shadow-sm space-y-4">
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {getThoughtIcon()}
            <time
              dateTime={thought.date}
              className="text-xs font-mono text-muted-foreground"
            >
              {thought.formattedDate}
            </time>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {thought.tags && thought.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {thought.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {episodeBadge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border border-border bg-muted text-foreground">
                {episodeBadge}
              </span>
            )}
            {thought.rating && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400">
                <Star className="h-2.5 w-2.5 fill-current" />
                <span>{thought.rating}</span>
              </span>
            )}
          </div>
        </div>

        {/* Optional Title */}
        {thought.title && (
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            {thought.title}
          </h2>
        )}

        {/* Thought Body Content */}
        <div
          className="prose prose-zinc dark:prose-invert max-w-none text-foreground text-sm leading-relaxed prose-p:my-1.5 prose-a:underline prose-a:underline-offset-4"
          dangerouslySetInnerHTML={{ __html: thought.htmlContent }}
        />

        {/* Optional Waveform Audio Player */}
        {thought.audio && (
          <div className="pt-1">
            <AudioPlayer src={thought.audio} />
          </div>
        )}

        {/* Optional Image */}
        {thought.image && (
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={thought.image}
              alt="Akış görseli"
              width={720}
              height={480}
              unoptimized={thought.image.startsWith('http')}
              className="w-full max-h-96 object-cover cursor-zoom-in hover:opacity-95 transition-opacity"
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <ThoughtPermalink slug={thought.slug} />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyMarkdown}
              className="hover:text-foreground transition-colors flex items-center gap-1 px-2 py-1 rounded bg-muted border border-border text-[11px] font-mono"
              title="Markdown Kopyala"
            >
              {copiedMarkdown ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Kopyala</span>
                </>
              )}
            </button>

            <ShareButton
              title={`Yusuf Bozan — Akış (${thought.formattedDate})`}
              text={thought.content.slice(0, 140)}
              url={`/akis#${thought.slug}`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
