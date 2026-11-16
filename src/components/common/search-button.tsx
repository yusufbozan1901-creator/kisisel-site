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
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-zinc-200 dark:border-[#27272A] bg-zinc-100/70 dark:bg-[#141414] text-zinc-600 dark:text-[#A1A1AA] rounded-md hover:border-zinc-400 dark:hover:border-[#3F3F46] hover:text-zinc-900 dark:hover:text-white transition-colors"
    >
      <Search className="w-3.5 h-3.5" />
      <kbd className="hidden sm:inline font-mono text-[10px] text-zinc-500 dark:text-[#71717A]">
        ⌘K
      </kbd>
    </button>
  );
}
