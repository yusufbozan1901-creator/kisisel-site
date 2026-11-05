'use client';

import * as React from 'react';
import { Share2 } from 'lucide-react';
import { ShareModal } from '@/components/common/share-modal';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  readonly title: string;
  readonly url?: string;
  readonly text?: string;
  readonly className?: string;
  readonly align?: 'left' | 'right';
}

export function ShareButton({
  title,
  url,
  className,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getFullUrl = React.useCallback(() => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      return url;
    }
    if (typeof window !== 'undefined') {
      if (url) {
        return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      return window.location.href;
    }
    return '';
  }, [url]);

  const [fullUrl, setFullUrl] = React.useState('');

  React.useEffect(() => {
    setFullUrl(getFullUrl());
  }, [getFullUrl]);

  const handleOpen = () => {
    setFullUrl(getFullUrl());
    setIsOpen(true);
  };

  return (
    <>
      <div className={cn('relative inline-block text-left', className)}>
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors rounded-md border border-zinc-200 dark:border-zinc-800 px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Paylaş"
        >
          <Share2 className="h-3.5 w-3.5" />
          Paylaş
        </button>
      </div>

      <ShareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        url={fullUrl}
      />
    </>
  );
}
