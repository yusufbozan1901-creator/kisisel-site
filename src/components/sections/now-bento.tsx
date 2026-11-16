import React from 'react';
import { Bookmark, Quote, Sparkles } from 'lucide-react';
import type { NowState } from '@/lib/schemas';

interface NowBentoProps {
  readonly now: NowState;
}

export function NowBento({ now }: NowBentoProps) {
  const { focus, shelf, thought } = now;

  const hasFocus = Boolean(focus?.title?.trim());
  const hasShelf = Boolean(shelf?.itemTitle?.trim());
  const hasThought = Boolean(thought?.quote?.trim());

  if (!hasFocus && !hasShelf && !hasThought) {
    return null;
  }

  const activeCount = (hasFocus ? 1 : 0) + (hasShelf ? 1 : 0) + (hasThought ? 1 : 0);
  const gridColsClass =
    activeCount === 3
      ? 'grid-cols-1 md:grid-cols-3'
      : activeCount === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 max-w-xl mx-auto';

  return (
    <section className="w-full pt-4">
      <div className={`grid ${gridColsClass} gap-4`}>
        {/* Card 1: Üzerinde Çalıştığım */}
        {hasFocus && (
          <div className="p-4 bg-zinc-50 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] rounded-xl flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#333333] transition-colors min-h-[12rem]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500 dark:text-[#71717A] tracking-wider uppercase font-semibold">
                  ÜZERİNDE ÇALIŞTIĞIM
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-white animate-pulse" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {focus.title}
              </h3>
              {focus.description && (
                <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] leading-relaxed line-clamp-2">
                  {focus.description}
                </p>
              )}
            </div>
            {(focus.status || focus.updatedAt) && (
              <div className="pt-3 border-t border-zinc-200 dark:border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-[#71717A]">
                <span>{focus.status ? `Durum: ${focus.status}` : ''}</span>
                <span>{focus.updatedAt}</span>
              </div>
            )}
          </div>
        )}

        {/* Card 2: Şu An Rafta */}
        {hasShelf && (
          <div className="p-4 bg-zinc-50 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] rounded-xl flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#333333] transition-colors min-h-[12rem]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500 dark:text-[#71717A] tracking-wider uppercase font-semibold">
                  ŞU AN RAFTA
                </span>
                <Bookmark className="w-3.5 h-3.5 text-zinc-400 dark:text-[#71717A]" />
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-1">
                  <div className="truncate font-medium text-zinc-900 dark:text-white">
                    {shelf.itemTitle}
                  </div>
                  {shelf.itemMeta && (
                    <span className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-[#141414] border border-zinc-300 dark:border-[#27272A] text-[10px] font-mono text-zinc-700 dark:text-[#A1A1AA] shrink-0">
                      {shelf.itemType ? `${shelf.itemType} • ` : ''}{shelf.itemMeta}
                    </span>
                  )}
                </div>
                {shelf.subItemTitle && (
                  <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-zinc-200 dark:border-[#1F1F1F]">
                    <div className="truncate text-zinc-600 dark:text-[#A1A1AA]">
                      {shelf.subItemTitle}
                    </div>
                    {shelf.subItemMeta && (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-[#141414] border border-zinc-300 dark:border-[#27272A] text-[10px] font-mono text-zinc-700 dark:text-[#A1A1AA] shrink-0">
                        {shelf.subItemType ? `${shelf.subItemType} • ` : ''}{shelf.subItemMeta}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-200 dark:border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-[#71717A]">
              <span>{shelf.status || 'Aktif'}</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Aktif
              </span>
            </div>
          </div>
        )}

        {/* Card 3: Son Düşünce */}
        {hasThought && (
          <div className="p-4 bg-zinc-50 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] rounded-xl flex flex-col justify-between hover:border-zinc-400 dark:hover:border-[#333333] transition-colors min-h-[12rem]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500 dark:text-[#71717A] tracking-wider uppercase font-semibold">
                  SON DÜŞÜNCE
                </span>
                <Quote className="w-3.5 h-3.5 text-zinc-400 dark:text-[#71717A]" />
              </div>
              <h3 className="text-xs font-medium text-zinc-900 dark:text-white italic leading-snug">
                &ldquo;{thought.quote}&rdquo;
              </h3>
              {thought.context && (
                <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] leading-relaxed line-clamp-2">
                  {thought.context}
                </p>
              )}
            </div>
            {(thought.label || thought.date) && (
              <div className="pt-3 border-t border-zinc-200 dark:border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-[#71717A]">
                <span>{thought.label}</span>
                <span>{thought.date}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
