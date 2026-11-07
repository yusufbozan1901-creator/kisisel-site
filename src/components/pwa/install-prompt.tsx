'use client';

import * as React from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'yb_pwa_prompt_dismissed';

/**
 * InstallPrompt - Lightweight PWA installation banner.
 * Captures beforeinstallprompt and displays an unobtrusive, minimalist prompt
 * at the bottom of the screen with local storage persistence.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Check if dismissed before
    const isDismissed = typeof window !== 'undefined' && localStorage.getItem(DISMISSED_KEY) === 'true';
    if (isDismissed) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem(DISMISSED_KEY, 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        localStorage.setItem(DISMISSED_KEY, 'true');
      }
    } catch (err) {
      console.error('Install prompt failed:', err);
    } finally {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISSED_KEY, 'true');
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Uygulama yükleme bildirimi"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-background/95 backdrop-blur-md shadow-2xl text-foreground">
        {/* App Icon Monogram Badge */}
        <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-inner select-none">
          YB
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="text-xs font-semibold tracking-tight text-foreground truncate">
            Uygulamayı Yükle
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 truncate">
            Yusuf Bozan&apos;ı ana ekranınıza ekleyin
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="h-3 w-3" />
            <span>Yükle</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Kapat"
            className="p-1 rounded-full text-zinc-400 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

