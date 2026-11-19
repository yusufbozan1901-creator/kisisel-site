'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

export function SearchButton() {
  const triggerPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <button
      type="button"
      onClick={triggerPalette}
      aria-label="Arama ve Komut Paleti (⌘K)"
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border bg-muted text-muted-foreground rounded-md hover:border-foreground/30 hover:text-foreground transition-colors"
    >
      <Search className="w-3.5 h-3.5" />
      <kbd className="hidden sm:inline font-mono text-[10px] text-muted-foreground/80">
        ⌘K
      </kbd>
    </button>
  );
}
