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

  const secTitle = shelf.secondaryTitle?.trim() || shelf.subItemTitle?.trim() || '';
  const secType = shelf.secondaryType?.trim() || shelf.subItemType?.trim() || '';
  const secMeta = shelf.secondaryMeta?.trim() || shelf.subItemMeta?.trim() || '';
  const secStatus = shelf.secondaryStatus?.trim() || shelf.subItemStatus?.trim() || '';

  const thoughtDate = thought.thoughtDate?.trim() || thought.date?.trim() || '';

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
          <div className="p-4 bg-card border border-border rounded-xl flex flex-col justify-between hover:border-foreground/30 transition-colors min-h-[12rem]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase font-semibold">
                  ÜZERİNDE ÇALIŞTIĞIM
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-white animate-pulse" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {focus.title}
              </h3>
              {focus.description && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {focus.description}
                </p>
              )}
            </div>
            {(focus.status || focus.updatedAt) && (
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{focus.status ? `Durum: ${focus.status}` : ''}</span>
                <span>{focus.updatedAt}</span>
              </div>
            )}
          </div>
        )}

        {/* Card 2: Şu An Rafta */}
        {hasShelf && (
          <div className="p-4 bg-card border border-border rounded-xl flex flex-col justify-between hover:border-foreground/30 transition-colors min-h-[12rem]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase font-semibold">
                  ŞU AN RAFTA
                </span>
                <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-xs">
                {/* Birincil Eser */}
                <div className="flex items-center justify-between gap-1">
                  <div className="truncate font-medium text-foreground">
                    {shelf.itemTitle}
                  </div>
                  {(shelf.itemType || shelf.itemMeta) && (
                    <span className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground shrink-0">
                      {shelf.itemType ? `${shelf.itemType} • ` : ''}{shelf.itemMeta}
                    </span>
                  )}
                </div>

                {/* İkincil Eser (Varsa) */}
                {secTitle && (
                  <div className="pt-2 border-t border-border space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <div className="truncate font-medium text-foreground">
                        {secTitle}
                      </div>
                      {(secType || secMeta) && (
                        <span className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono text-muted-foreground shrink-0">
                          {secType ? `${secType} • ` : ''}{secMeta}
                        </span>
                      )}
                    </div>
                    {secStatus && (
                      <div className="text-[10px] font-mono text-muted-foreground">
                        <span>Durum: {secStatus}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>{shelf.status || 'Aktif'}</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Rafta
              </span>
            </div>
          </div>
        )}

        {/* Card 3: Son Düşünce */}
        {hasThought && (
          <div className="p-4 bg-card border border-border rounded-xl flex flex-col justify-between hover:border-foreground/30 transition-colors min-h-[12rem]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase font-semibold">
                  SON DÜŞÜNCE
                </span>
                <Quote className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <h3 className="text-xs font-medium text-foreground italic leading-snug">
                &ldquo;{thought.quote}&rdquo;
              </h3>
              {thought.context && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {thought.context}
                </p>
              )}
            </div>
            {(thought.label || thoughtDate) && (
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>{thought.label || 'Düşünce'}</span>
                {thoughtDate && (
                  <span className="text-muted-foreground font-medium">
                    {thoughtDate}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
