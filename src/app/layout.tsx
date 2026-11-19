import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SITE_CONFIG } from '@/config/site';
import { ThemeProvider } from '@/components/common/theme-provider';
import { Navbar } from '@/components/common/navbar';
import { Footer } from '@/components/common/footer';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { CommandPalette } from '@/components/common/command-palette';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'tr_TR',
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.url,
    types: {
      'application/rss+xml': [
        { url: `${SITE_CONFIG.url}/feed.xml`, title: `${SITE_CONFIG.name} — RSS Akışı (Tümü)` },
        { url: `${SITE_CONFIG.url}/rss.xml`, title: `${SITE_CONFIG.name} — Yazılar` },
      ],
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YB',
  },
  verification: {
    google: 'googlec0182533b61ea1a1',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background selection:bg-foreground selection:text-background">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-card focus:text-foreground focus:border focus:border-border focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-foreground text-sm font-medium"
            >
              İçeriğe Atla
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <InstallPrompt />
            <CommandPalette />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
