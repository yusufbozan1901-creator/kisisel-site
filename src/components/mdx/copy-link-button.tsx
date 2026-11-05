'use client';

import * as React from 'react';
import { Link2, Check } from 'lucide-react';

export function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Bağlantıyı kopyala"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          Kopyalandı
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" />
          Bağlantıyı Kopyala
        </>
      )}
    </button>
  );
}

