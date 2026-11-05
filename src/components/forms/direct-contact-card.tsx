'use client';

import * as React from 'react';
import { Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export function DirectContactCard() {
  const [copied, setCopied] = React.useState(false);
  const email = SITE_CONFIG.privateEmail;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-card p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background text-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Doğrudan E-posta
            </div>
            <div className="text-sm font-semibold text-foreground font-mono">
              {email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="E-posta adresini kopyala"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Kopyalandı
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Adresi Kopyala
              </>
            )}
          </button>

          <a
            href={`mailto:${email}?subject=Merhaba%20Yusuf`}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            E-posta Gönder
          </a>
        </div>
      </div>
    </div>
  );
}
