'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Thought } from '@/lib/thoughts';
import { ThoughtCard } from '@/components/sections/thought-card';
import { Rss, Code2, Sparkles, X, Calendar, Tag, ArrowUpRight } from 'lucide-react';

interface AkisStreamClientProps {
  readonly thoughts: readonly Thought[];
}

export function AkisStreamClient({ thoughts }: AkisStreamClientProps) {
  const [activeTab, setActiveTab] = React.useState<'all' | 'audio' | 'code' | 'quote'>('all');
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);

  // Compute dynamic stats
  const audioCount = React.useMemo(() => thoughts.filter((t) => t.audio || t.type === 'audio').length, [thoughts]);
  const codeCount = React.useMemo(() => thoughts.filter((t) => t.type === 'code').length, [thoughts]);
  const quoteCount = React.useMemo(() => thoughts.filter((t) => t.type === 'quote').length, [thoughts]);

  // Compute tag frequencies
  const tagCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    thoughts.forEach((t) => {
      (t.tags || []).forEach((tag) => {
        map.set(tag, (map.get(tag) || 0) + 1);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [thoughts]);

  // Compute monthly archive frequencies
  const monthCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    thoughts.forEach((t) => {
      try {
        const d = new Date(t.date);
        if (!isNaN(d.getTime())) {
          const monthYear = new Intl.DateTimeFormat('tr-TR', {
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/Istanbul',
          }).format(d);
          map.set(monthYear, (map.get(monthYear) || 0) + 1);
        }
      } catch {
        // Ignore date parse error
      }
    });
    return Array.from(map.entries());
  }, [thoughts]);

  // Filter thoughts based on active filters
  const filteredThoughts = React.useMemo(() => {
    return thoughts.filter((t) => {
      // 1. Tab filter
      if (activeTab === 'audio' && !t.audio && t.type !== 'audio') return false;
      if (activeTab === 'code' && t.type !== 'code') return false;
      if (activeTab === 'quote' && t.type !== 'quote') return false;

      // 2. Tag filter
      if (selectedTag) {
        if (!t.tags || !t.tags.includes(selectedTag)) return false;
      }

      // 3. Month filter
      if (selectedMonth) {
        try {
          const d = new Date(t.date);
          const monthYear = new Intl.DateTimeFormat('tr-TR', {
            month: 'long',
            year: 'numeric',
            timeZone: 'Europe/Istanbul',
          }).format(d);
          if (monthYear !== selectedMonth) return false;
        } catch {
          return false;
        }
      }

      return true;
    });
  }, [thoughts, activeTab, selectedTag, selectedMonth]);

  const clearAllFilters = () => {
    setActiveTab('all');
    setSelectedTag(null);
    setSelectedMonth(null);
  };

  const hasActiveFilter = activeTab !== 'all' || selectedTag !== null || selectedMonth !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* LEFT COLUMN: Main Stream (Approx 70% width on Desktop) */}
      <div className="lg:col-span-8 flex flex-col space-y-8">
        {/* Filter Controls Bar */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-2 sm:p-2.5 bg-zinc-100/80 dark:bg-[#141414] border border-zinc-200 dark:border-[#1F1F1F] rounded-xl">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Tüm Notlar ({thoughts.length})
            </button>

            {audioCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('audio')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'audio'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Sesli Düşünceler ({audioCount})
              </button>
            )}

            {quoteCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('quote')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'quote'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Alıntılar ({quoteCount})
              </button>
            )}

            {codeCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'code'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-white dark:bg-[#0A0A0A] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Kod & Notlar ({codeCount})
              </button>
            )}
          </div>

          {/* Quick Feeds Trigger */}
          <div className="flex items-center gap-1.5 ml-auto">
            <Link
              href="/feed.xml"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-zinc-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A0A] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white transition-colors"
              title="RSS Akışı (XML)"
            >
              <Rss className="w-3.5 h-3.5" />
              <span>RSS</span>
            </Link>
          </div>
        </section>

        {/* Active Filter Pill Bar */}
        {hasActiveFilter && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100 dark:bg-[#141414] border border-zinc-200 dark:border-[#1F1F1F] text-xs text-zinc-600 dark:text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <span>Aktif Filtre:</span>
              {selectedTag && (
                <span className="font-mono font-medium text-zinc-900 dark:text-white">
                  #{selectedTag}
                </span>
              )}
              {selectedMonth && (
                <span className="font-medium text-zinc-900 dark:text-white">
                  {selectedMonth}
                </span>
              )}
              {activeTab !== 'all' && (
                <span className="font-medium text-zinc-900 dark:text-white">
                  {activeTab === 'audio' ? 'Sesli Düşünceler' : activeTab === 'quote' ? 'Alıntılar' : 'Kod & Notlar'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              <X className="w-3 h-3" />
              <span>Filtreleri Temizle</span>
            </button>
          </div>
        )}

        {/* Timeline Feed Container */}
        {filteredThoughts.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-xl border border-dashed border-zinc-300 dark:border-[#27272A] bg-zinc-50/50 dark:bg-[#0A0A0A] text-zinc-500 text-xs">
            Seçilen kriterlere uygun akış notu bulunamadı.
          </div>
        ) : (
          <div className="relative flex flex-col space-y-8 pl-4 sm:pl-6 my-2">
            {/* Connecting Vertical Timeline Spine */}
            <div
              className="absolute left-[9px] sm:left-[13px] top-6 bottom-6 w-px bg-zinc-200 dark:bg-[#1F1F1F]"
              aria-hidden="true"
            />

            {filteredThoughts.map((thought) => (
              <ThoughtCard key={thought.slug} thought={thought} />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Sticky Archival Sidebar (Approx 30% width on Desktop) */}
      <aside className="lg:col-span-4 flex flex-col space-y-6 lg:sticky lg:top-24">
        {/* Box 1: Topic Taxonomy */}
        {tagCounts.length > 0 && (
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] p-5 sm:p-6 rounded-xl flex flex-col space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-medium text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-zinc-400" />
                <span>KONU ETİKETLERİ</span>
              </h2>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-[#71717A]">
                {tagCounts.length} Etiket
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tagCounts.map(([tag, count]) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold'
                        : 'bg-zinc-100 dark:bg-[#141414] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-[#1F1F1F]'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Box 2: Time Archive */}
        {monthCounts.length > 0 && (
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] p-5 sm:p-6 rounded-xl flex flex-col space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-medium text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-zinc-400" />
                <span>ZAMAN ARŞİVİ</span>
              </h2>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-[#71717A]">
                {thoughts.length} Not
              </span>
            </div>
            <ul className="space-y-1 pt-1">
              {monthCounts.map(([month, count]) => {
                const isSelected = selectedMonth === month;
                return (
                  <li key={month}>
                    <button
                      type="button"
                      onClick={() => setSelectedMonth(isSelected ? null : month)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors text-left ${
                        isSelected
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-medium'
                          : 'hover:bg-zinc-100 dark:hover:bg-[#141414] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{month}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-[#141414] text-zinc-500 dark:text-[#71717A]">
                        {count} not
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Box 3: IndieWeb & Sync Protocols */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] p-5 sm:p-6 rounded-xl flex flex-col space-y-3.5 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xs font-mono font-medium text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-zinc-400" />
              <span>İNDİEWEB & BESLEME</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-[#71717A] leading-relaxed">
              Bu akış açık web standartlarını ve otomatik RSS/JSON feed protokollerini destekler.
            </p>
          </div>

          <div className="flex flex-col space-y-1.5 pt-1 text-xs">
            <Link
              href="/feed.xml"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100/70 dark:bg-[#141414] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2 font-mono">
                <Rss className="w-3.5 h-3.5 text-zinc-400" />
                <span>RSS Beslemesi (Tümü)</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              href="/rss.xml"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100/70 dark:bg-[#141414] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2 font-mono">
                <Rss className="w-3.5 h-3.5 text-zinc-400" />
                <span>Yazılar RSS</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              href="/manifest.json"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-100/70 dark:bg-[#141414] hover:bg-zinc-200 dark:hover:bg-[#1F1F1F] text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2 font-mono">
                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>PWA Manifest</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
