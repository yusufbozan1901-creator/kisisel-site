'use client';

import * as React from 'react';
import type { Thought } from '@/lib/thoughts';
import { AudioPlayer } from '@/components/mdx/audio-player';
import { ShareButton } from '@/components/common/share-button';
import { Sparkles } from 'lucide-react';

interface ThoughtCardProps {
  readonly thought: Thought;
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  return (
    <article
      id={thought.slug}
      className="relative pl-6 sm:pl-8 group scroll-mt-24"
    >
      {/* Timeline Node */}
      <div
        className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-background bg-zinc-300 dark:bg-zinc-700 group-hover:bg-foreground transition-colors"
        aria-hidden="true"
      />

      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-850 dark:border-zinc-800/80 bg-card p-5 sm:p-6 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-650">
        {/* Meta / Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <time
            dateTime={thought.date}
            className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-muted-foreground/60" />
            {thought.formattedDate}
          </time>

          <ShareButton
            title={`Yusuf Bozan — Akış (${thought.formattedDate})`}
            text={thought.content.slice(0, 140)}
            url={`/akis#${thought.slug}`}
          />
        </div>

        {/* Optional Title */}
        {thought.title && (
          <h2 className="text-base font-bold text-foreground mb-2 tracking-tight">
            {thought.title}
          </h2>
        )}

        {/* Thought Body */}
        <div
          className="prose prose-zinc dark:prose-invert max-w-none text-foreground/90 text-sm sm:text-base leading-relaxed prose-p:my-1.5 prose-a:underline prose-a:underline-offset-4"
          dangerouslySetInnerHTML={{ __html: thought.htmlContent }}
        />

        {/* Optional Image */}
        {thought.image && (
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thought.image}
              alt="Akış görseli"
              className="w-full max-h-96 object-cover cursor-zoom-in hover:opacity-95 transition-opacity"
            />
          </div>
        )}

        {/* Optional Audio Player */}
        {thought.audio && (
          <div className="mt-3">
            <AudioPlayer src={thought.audio} />
          </div>
        )}
      </div>
    </article>
  );
}
