'use client';

import * as React from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { Star, X, Bookmark } from 'lucide-react';
import type { ShelfItem } from '@/lib/schemas';

interface ShelfShowcaseProps {
  readonly items: readonly ShelfItem[];
}

export function ShelfShowcase({ items }: ShelfShowcaseProps) {
  const [selectedItem, setSelectedItem] = React.useState<ShelfItem | null>(null);

  const getStatusLabel = (status: ShelfItem['status']) => {
    switch (status) {
      case 'watching':
        return 'İzleniyor';
      case 'reading':
        return 'Okunuyor';
      case 'completed':
        return 'Tamamlandı';
      case 'masterpiece':
        return 'Başyapıt';
      default:
        return 'Arşivde';
    }
  };

  const getTypeLabel = (type: ShelfItem['type']) => {
    switch (type) {
      case 'movie':
        return 'Film';
      case 'book':
        return 'Kitap';
      case 'series':
      default:
        return 'Dizi';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.slug}
            onClick={() => setSelectedItem(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedItem(item);
              }
            }}
            className="group bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] rounded-xl overflow-hidden flex flex-col hover:border-zinc-400 dark:hover:border-[#333333] transition-colors shadow-sm text-left cursor-pointer select-none"
          >
            <div className="relative w-full aspect-[2/3] bg-zinc-100 dark:bg-[#141414] overflow-hidden">
              {item.poster ? (
                <Image
                  src={item.poster}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  unoptimized={item.poster.startsWith('http')}
                  className="object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-zinc-400">
                  <Bookmark className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-mono font-medium">{item.title}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              {item.badge && (
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] text-[10px] font-mono font-medium text-white">
                    {item.badge}
                  </span>
                </div>
              )}
              {item.rating && (
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] font-mono text-xs text-white flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current text-amber-400" />
                    <span>{item.rating.replace('★', '').trim()}</span>
                  </span>
                </div>
              )}
            </div>
            <div className="p-3.5 flex-1 flex flex-col justify-between gap-1.5">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-[#71717A] tracking-wider uppercase font-semibold">
                  {getTypeLabel(item.type)} • {item.year || item.category}
                </span>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5 truncate">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal / Drawer */}
      <Dialog.Root open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-zinc-200 dark:border-[#1F1F1F] bg-white dark:bg-[#0A0A0A] p-6 shadow-2xl duration-200 max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-zinc-500 dark:text-[#71717A] uppercase tracking-wider">
                      {getTypeLabel(selectedItem.type)} • {selectedItem.year} • {selectedItem.category}
                    </span>
                    <Dialog.Title className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                      {selectedItem.title}
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    aria-label="Kapat"
                    className="p-1 rounded-md text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Meta Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-[#141414] border border-zinc-200 dark:border-[#27272A] text-xs font-mono font-medium text-zinc-800 dark:text-white flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                    <span>{selectedItem.rating}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-[#141414] border border-zinc-200 dark:border-[#27272A] text-xs font-mono text-zinc-700 dark:text-zinc-300">
                    Durum: {getStatusLabel(selectedItem.status)}
                  </span>
                  {selectedItem.badge && (
                    <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-[#141414] border border-zinc-200 dark:border-[#27272A] text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      {selectedItem.badge}
                    </span>
                  )}
                  {selectedItem.progress && (
                    <span className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-[#141414] border border-zinc-200 dark:border-[#27272A] text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      {selectedItem.progress}
                    </span>
                  )}
                </div>

                {/* Review / Notes Body */}
                {selectedItem.htmlContent ? (
                  <div
                    className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed pt-2 border-t border-zinc-100 dark:border-[#1F1F1F]"
                    dangerouslySetInnerHTML={{ __html: selectedItem.htmlContent }}
                  />
                ) : selectedItem.description ? (
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pt-2 border-t border-zinc-100 dark:border-[#1F1F1F]">
                    {selectedItem.description}
                  </p>
                ) : null}

                <div className="pt-4 border-t border-zinc-100 dark:border-[#1F1F1F] flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-[#71717A]">
                  <span>Güncelleme: {selectedItem.updatedAt}</span>
                  <span>Kişisel Arşiv</span>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
