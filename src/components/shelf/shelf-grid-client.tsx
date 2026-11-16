'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Star, X, Bookmark, Search, ArrowUpDown, Sparkles } from 'lucide-react';
import type { ShelfItem } from '@/lib/schemas';

interface ShelfGridClientProps {
  readonly items: readonly ShelfItem[];
}

export function ShelfGridClient({ items }: ShelfGridClientProps) {
  const [activeType, setActiveType] = React.useState<'all' | 'movie' | 'series' | 'book'>('all');
  const [activeStatus, setActiveStatus] = React.useState<'all' | 'active' | 'completed' | 'masterpiece'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'latest' | 'rating' | 'year'>('latest');
  const [selectedItem, setSelectedItem] = React.useState<ShelfItem | null>(null);

  // Counts
  const movieCount = React.useMemo(() => items.filter((i) => i.type === 'movie').length, [items]);
  const seriesCount = React.useMemo(() => items.filter((i) => i.type === 'series').length, [items]);
  const bookCount = React.useMemo(() => items.filter((i) => i.type === 'book').length, [items]);

  // Filtered & Sorted items
  const filteredItems = React.useMemo(() => {
    let result = items.filter((item) => {
      // Type filter
      if (activeType !== 'all' && item.type !== activeType) return false;

      // Status filter
      if (activeStatus === 'active') {
        if (item.status !== 'watching' && item.status !== 'reading') return false;
      } else if (activeStatus === 'completed') {
        if (item.status !== 'completed') return false;
      } else if (activeStatus === 'masterpiece') {
        if (item.status !== 'masterpiece' && !item.rating.includes('9.')) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${item.title} ${item.description} ${item.category}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'rating') {
        const ratingA = parseFloat(a.rating.replace(/[^0-9.]/g, '')) || 0;
        const ratingB = parseFloat(b.rating.replace(/[^0-9.]/g, '')) || 0;
        return ratingB - ratingA;
      }
      if (sortBy === 'year') {
        return (parseInt(b.year || '0', 10) || 0) - (parseInt(a.year || '0', 10) || 0);
      }
      return 0; // default order from filesystem
    });

    return result;
  }, [items, activeType, activeStatus, searchQuery, sortBy]);

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
    <div className="space-y-8">
      {/* Controls Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-zinc-100/80 dark:bg-[#141414] border border-zinc-200 dark:border-[#1F1F1F] rounded-xl">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => setActiveType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeType === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Tümü ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveType('series')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeType === 'series'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Diziler ({seriesCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveType('movie')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeType === 'movie'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Filmler ({movieCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveType('book')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeType === 'book'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Kitaplar ({bookCount})
          </button>
        </div>

        {/* Right Search & Sort */}
        <div className="flex items-center gap-2">
          {/* Live Search */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rafta ara..."
              className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#27272A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-white w-36 sm:w-44"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#27272A] rounded-lg px-2 py-1 text-xs">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white dark:bg-[#0A0A0A] text-xs text-zinc-700 dark:text-[#A1A1AA] focus:outline-none cursor-pointer border-0"
            >
              <option value="latest" className="bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-white">
                En Yeni
              </option>
              <option value="rating" className="bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-white">
                En Yüksek Puan
              </option>
              <option value="year" className="bg-white dark:bg-[#0A0A0A] text-zinc-900 dark:text-white">
                Yıla Göre
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid View */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-xl border border-dashed border-zinc-300 dark:border-[#27272A] bg-zinc-50/50 dark:bg-[#0A0A0A] text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-zinc-100 dark:bg-[#141414] text-zinc-500">
            <Bookmark className="w-5 h-5" />
          </div>
          <p className="text-sm text-zinc-500 dark:text-[#71717A]">
            Henüz kayıt yok.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.slug}
              onClick={() => setSelectedItem(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedItem(item);
              }}
              className="group bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] rounded-xl overflow-hidden flex flex-col hover:border-zinc-400 dark:hover:border-[#333333] transition-colors cursor-pointer shadow-sm text-left"
            >
              {/* Poster 2:3 Aspect Ratio Container */}
              <div className="relative w-full aspect-[2/3] bg-zinc-100 dark:bg-[#141414] overflow-hidden">
                {item.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-zinc-400">
                    <Bookmark className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-mono font-medium">{item.title}</span>
                  </div>
                )}

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {/* Top Left Badge */}
                {item.badge && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] text-[10px] font-mono font-medium text-white">
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Top Right Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] text-[10px] font-medium text-white">
                    {getStatusLabel(item.status)}
                  </span>
                </div>

                {/* Bottom Right Rating */}
                {item.rating && (
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] font-mono text-xs text-white flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-amber-400" />
                      <span>{item.rating.replace('★', '').trim()}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Card Meta Content (Fixed heights to prevent CLS) */}
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-[#71717A] tracking-wider uppercase font-semibold">
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

                <div className="pt-2 border-t border-zinc-100 dark:border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-[#71717A]">
                  <span>{item.progress ? `İlerleme: ${item.progress}` : 'Kayıt'}</span>
                  <span>{item.updatedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
}
