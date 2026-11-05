'use client';

import * as React from 'react';
import { X, Copy, Check } from 'lucide-react';
import {
  WhatsAppIcon,
  TwitterIcon,
  TelegramIcon,
  LinkedInIcon,
  FacebookIcon,
  RedditIcon,
} from '@/components/common/icons';

export interface ShareModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly url: string;
}

export function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Close on ESC key and lock background scroll
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      color: '#25D366',
      border: 'border-transparent',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: <WhatsAppIcon className="h-5 w-5" />,
    },
    {
      name: 'X',
      color: '#000000',
      border: 'border border-zinc-700',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: <TwitterIcon className="h-5 w-5" />,
    },
    {
      name: 'Telegram',
      color: '#26A5E4',
      border: 'border-transparent',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <TelegramIcon className="h-5 w-5" />,
    },
    {
      name: 'LinkedIn',
      color: '#0A66C2',
      border: 'border-transparent',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <LinkedInIcon className="h-5 w-5" />,
    },
    {
      name: 'Facebook',
      color: '#1877F2',
      border: 'border-transparent',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <FacebookIcon className="h-5 w-5" />,
    },
    {
      name: 'Reddit',
      color: '#FF4500',
      border: 'border-transparent',
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: <RedditIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#18181b] border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-2xl text-zinc-100 relative"
      >
        {/* Üst Kısım: Başlık & Kapatma Butonu */}
        <div className="flex items-center justify-between gap-3 pb-2">
          <h3
            id="share-modal-title"
            className="text-base font-semibold text-white tracking-tight"
          >
            Paylaşılabilir herkese açık bağlantı
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Orta Kısım: Bağlantı Kapsülü */}
        <div className="mt-3 bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3">
          <span
            className="text-xs text-zinc-300 font-mono underline underline-offset-4 truncate select-all"
            title={url}
          >
            {url}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Kopyalandı ✓</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Bağlantıyı kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* Bilgilendirme Satırı */}
        <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">
          Bu bağlantıyı kopyalayarak veya aşağıdaki platformlar üzerinden doğrudan paylaşabilirsiniz.
        </p>

        {/* Yatay Ayırıcı Çizgi */}
        <div className="my-4 border-t border-zinc-800" />

        {/* Alt Kısım: Dairesel Sosyal Medya İkonları */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 pt-1">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-lg p-0.5"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-transform duration-200 group-hover:scale-110 active:scale-95 ${platform.border}`}
                style={{ backgroundColor: platform.color }}
                aria-hidden="true"
              >
                {platform.icon}
              </div>
              <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {platform.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
