import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { getAllThoughts } from '@/lib/thoughts';
import { ThoughtCard } from '@/components/sections/thought-card';
import { ImageLightbox } from '@/components/mdx/image-lightbox';
import { ReadingProgressBar } from '@/components/mdx/reading-progress-bar';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Akış',
  description: 'Yusuf Bozan — Anlık düşünceler, mikro notlar ve kısa gözlemler.',
  openGraph: {
    title: `Akış | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan — Anlık düşünceler, mikro notlar ve kısa gözlemler.',
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
    description: 'Yusuf Bozan — Anlık düşünceler, mikro notlar ve kısa gözlemler.',
    images: [SITE_CONFIG.ogImage],
  },
};

export default async function AkisPage() {
  const thoughts = await getAllThoughts();

  return (
    <>
      <ReadingProgressBar />
      <ImageLightbox />

      <div className="py-20 sm:py-28">
        <Container size="narrow">
          {/* Header */}
          <div className="max-w-xl mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Canlı Düşünce Akışı
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Akış
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
              Uzun yazılara dönüşmeyen anlık düşünceler, altını çizdiğim kısa satırlar ve zihnimden geçen günlük notlar.
            </p>
          </div>

          {/* Timeline View */}
          {thoughts.length === 0 ? (
            <div className="text-center py-16 text-zinc-500 dark:text-zinc-400 text-sm">
              Henüz bir akış notu paylaşılmadı.
            </div>
          ) : (
            <div className="relative border-l-2 border-zinc-200/90 dark:border-zinc-800/90 ml-3 sm:ml-4 space-y-10 my-8">
              {thoughts.map((thought) => (
                <ThoughtCard key={thought.slug} thought={thought} />
              ))}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
