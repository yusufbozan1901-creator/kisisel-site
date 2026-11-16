import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { getAllThoughts } from '@/lib/thoughts';
import { AkisStreamClient } from '@/components/thoughts/akis-stream-client';
import { ImageLightbox } from '@/components/mdx/image-lightbox';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Akış — Dijital Bahçe & Mikro-Notlar',
  description: 'Yusuf Bozan — Filtrelenmemiş fikirler, sesli düşünceler, alıntılar ve çalışma anından canlı notlar.',
  openGraph: {
    title: `Akış | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan — Filtrelenmemiş fikirler, sesli düşünceler, alıntılar ve çalışma anından canlı notlar.',
    url: `${SITE_CONFIG.url}/akis`,
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `Akış | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Akış | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan — Filtrelenmemiş fikirler, sesli düşünceler, alıntılar ve çalışma anından canlı notlar.',
    images: [SITE_CONFIG.ogImage],
  },
};

export default async function AkisPage() {
  const thoughts = await getAllThoughts();

  return (
    <div className="w-full py-10 sm:py-16 pb-24">
      <ImageLightbox />
      <Container size="default">
        {/* Page Header */}
        <section className="max-w-2xl mb-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-[#71717A]">
              DİJİTAL BAHÇE / AKIŞ
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Düşünce Akışı & Mikro-Notlar
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
            Uzun yazılara dönüşmeyen anlık düşünceler, ses kayıtları, altını çizdiğim alıntılar ve zihnimden geçen günlük notlar.
          </p>
        </section>

        {/* Interactive Stream & Sticky Sidebar */}
        <AkisStreamClient thoughts={thoughts} />
      </Container>
    </div>
  );
}
