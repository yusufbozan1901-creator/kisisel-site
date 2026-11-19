'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, ArrowRight, CornerDownLeft, X, FileText, Sparkles, Compass } from 'lucide-react';
import type { SearchResultItem } from '@/app/api/search/route';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [items, setItems] = React.useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const router = useRouter();

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, []);

  // Reset query and selectedIndex when palette opens
  const [prevOpen, setPrevOpen] = React.useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }

  // Fetch search index on open
  React.useEffect(() => {
    if (open && items.length === 0) {
      fetch('/api/search')
        .then((res) => res.json())
        .then((data: SearchResultItem[]) => setItems(data))
        .catch(() => {});
    }
  }, [open, items.length]);

  // Turkish-aware normalized filtering
  const filteredItems = React.useMemo(() => {
    if (!query.trim()) {
      return items.slice(0, 8);
    }

    const cleanQuery = query
      .toLowerCase()
      .replace(/i/g, 'i')
      .replace(/ı/g, 'i')
      .trim();

    return items
      .filter((item) => {
        const itemText = `${item.title} ${item.description || ''}`
          .toLowerCase()
          .replace(/i/g, 'i')
          .replace(/ı/g, 'i');
        return itemText.includes(cleanQuery);
      })
      .slice(0, 10);
  }, [items, query]);

  // Reset selected index when query changes
  const [prevQuery, setPrevQuery] = React.useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setSelectedIndex(0);
  }

  const selectItem = (item: SearchResultItem) => {
    setOpen(false);
    if (item.url.startsWith('/')) {
      router.push(item.url);
    } else {
      window.location.assign(item.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        selectItem(current);
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Yazılar':
        return <FileText className="w-4 h-4 text-zinc-400" />;
      case 'Akış':
        return <Sparkles className="w-4 h-4 text-zinc-400" />;
      default:
        return <Compass className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onKeyDown={handleKeyDown}
          className="fixed left-1/2 top-20 z-50 w-full max-w-xl -translate-x-1/2 rounded-xl border border-border bg-card p-0 shadow-2xl duration-200 overflow-hidden"
        >
          <Dialog.Title className="sr-only">Hızlı Arama ve Komut Paleti</Dialog.Title>
          <Dialog.Description className="sr-only">Sayfalarda, yazılarda ve akış notlarında arama yapın.</Dialog.Description>

          {/* Search Input Bar */}
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ara veya bir sayfaya git... (örn. Yazılar, Monolith)"
              className="w-full bg-transparent px-3 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
                aria-label="Aramayı Temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border border-border bg-muted text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Aramanızla eşleşen bir sonuç bulunamadı.
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getCategoryIcon(item.category)}
                      <div className="truncate">
                        <div className="font-medium text-foreground truncate">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-[11px] text-muted-foreground truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-border bg-muted text-muted-foreground">
                        {item.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer info bar */}
          <div className="px-4 py-2 border-t border-border bg-card flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <span>↑↓ Gezin • ↵ Seç</span>
            <span>⌘K ile her zaman aç</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
