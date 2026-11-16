import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { getAllShelfItems } from '@/lib/shelf';
import { ShelfGridClient } from '@/components/shelf/shelf-grid-client';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Rafım — Yusuf Bozan',
  description: 'İzlenen filmler, diziler ve okunan kitaplardan oluşan kişisel kültür arşivi.',
  openGraph: {
    title: `Rafım | ${SITE_CONFIG.name}`,
    description: 'İzlenen filmler, diziler ve okunan kitaplardan oluşan kişisel kültür arşivi.',
    url: `${SITE_CONFIG.url}/rafim`,
    type: 'website',
  },
};

export default async function RafimPage() {
  const items = await getAllShelfItems();

  return (
    <div className="w-full py-10 sm:py-16 pb-24">
      <Container size="default">
        {/* Header */}
        <section className="max-w-2xl mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Rafım / Film, Dizi & Kitaplar
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
            İzlediğim filmler, takip ettiğim diziler ve okuduğum kitaplar üzerine tuttuğum kişisel kayıtlar, notlar ve puanlar.
          </p>
        </section>

        {/* Shelf Grid */}
        <ShelfGridClient items={items} />
      </Container>
    </div>
  );
}
