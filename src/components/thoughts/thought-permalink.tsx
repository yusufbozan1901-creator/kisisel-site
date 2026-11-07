'use client';

import * as React from 'react';
import { Link2, Check } from 'lucide-react';

interface ThoughtPermalinkProps {
  readonly slug: string;
  readonly className?: string;
}

/**
 * ThoughtPermalink - Client-side leaf component for deep-linking into specific thoughts.
 * Copies the anchor URL (origin + '/akis#' + slug) to clipboard and updates the
 * address bar via window.history.replaceState without reloading or cluttering history.
 */
export function ThoughtPermalink({ slug, className = '' }: ThoughtPermalinkProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const targetPath = `/akis#${slug}`;
      const fullUrl = `${window.location.origin}${targetPath}`;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(fullUrl);
        } else {
          // Fallback for non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = fullUrl;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }

        // Silently update browser address bar without reload or polluting history
        window.history.replaceState(null, '', targetPath);

        setCopied(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy permalink:', err);
      }
    },
    [slug]
  );

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Not bağlantısı panoya kopyalandı' : 'Notun doğrudan bağlantısını kopyala'}
      aria-live="polite"
      title="Doğrudan bağlantıyı kopyala"
      className={`inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-foreground transition-colors p-1 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span className="text-[11px] font-mono text-emerald-500">Kopyalandı</span>
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" />
          <span className="sr-only">Bağlantıyı kopyala</span>
        </>
      )}
    </button>
  );
}
