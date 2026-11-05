'use client';

import * as React from 'react';
import { Share2, Check, Link2 } from 'lucide-react';
import {
  TwitterIcon,
  WhatsAppIcon,
  LinkedInIcon,
  FacebookIcon,
} from '@/components/common/icons';
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
  text,
  className,
  align = 'right',
}: ShareButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

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

  const handleShareClick = async () => {
    const shareUrl = getFullUrl();

    // Check if Web Share API is available (primarily mobile devices)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text: text || title,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        // If user cancelled or share failed, fallback to dropdown
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    // Toggle popover menu on desktop or when Web Share API is unavailable
    setOpen((prev) => !prev);
  };

  const handleCopy = async () => {
    const shareUrl = getFullUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Close on click outside or escape key
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const shareUrl = getFullUrl();
  const shareText = encodeURIComponent(`${title}`);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: <TwitterIcon className="h-3.5 w-3.5" />,
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon className="h-3.5 w-3.5" />,
      href: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon className="h-3.5 w-3.5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <FacebookIcon className="h-3.5 w-3.5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  return (
    <div ref={menuRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={handleShareClick}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors rounded-md border border-zinc-200 dark:border-zinc-800 px-2.5 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Paylaş"
        aria-expanded={open}
      >
        <Share2 className="h-3.5 w-3.5" />
        Paylaş
      </button>

      {open && (
        <div
          className={cn(
            'absolute bottom-full mb-2 z-50 w-48 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background/95 backdrop-blur-md p-1.5 shadow-xl text-xs space-y-0.5',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          role="menu"
        >
          {shareLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors"
              role="menuitem"
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}

          <div className="my-1 border-t border-zinc-200 dark:border-zinc-800" />

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors text-left"
            role="menuitem"
          >
            <span className="flex items-center gap-2">
              <Link2 className="h-3.5 w-3.5" />
              <span>Bağlantıyı Kopyala</span>
            </span>
            {copied && <Check className="h-3.5 w-3.5 text-foreground" />}
          </button>
        </div>
      )}
    </div>
  );
}
