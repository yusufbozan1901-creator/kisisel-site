import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Hakkımda',
  description: 'Yusuf Bozan hakkında — Kişisel notlar, ilgi alanları ve bu köşenin ortaya çıkış hikayesi.',
  openGraph: {
    title: `Hakkımda | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan hakkında — Kişisel notlar, ilgi alanları ve bu köşenin ortaya çıkış hikayesi.',
    url: `${SITE_CONFIG.url}/about`,
    type: 'profile',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `Hakkımda | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Hakkımda | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan hakkında — Kişisel notlar, ilgi alanları ve bu köşenin ortaya çıkış hikayesi.',
    images: [SITE_CONFIG.ogImage],
  },
};

export default function AboutPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container size="narrow">
        {/* Header */}
        <div className="space-y-4 mb-14 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Hakkımda
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.
          </p>
        </div>

        {/* Narrative Essay */}
        <div className="max-w-none text-base sm:text-lg text-foreground/90 leading-[1.85] space-y-8">
          <p>
            Burası internetin bitmek bilmeyen telaşından ve gürültüsünden biraz olsun uzaklaşmak, zihnimi toparlamak ve zaman içinde biriktirdiğim notları sade bir düzende saklamak için açtığım kişisel bir alan.
          </p>

          <p>
            Eski internetin o iddiasız ama samimi kişisel sayfalarını her zaman çok kıymetli buldum. Gösterişli unvanlar, algoritmaların peşinden koşan başlıklar ya da dikkat çekme yarışının olmadığı; insanların yalnızca merak ettikleri şeyleri kendi ritimlerinde yazdığı o dingin atmosferi burada da yaşatmaya çalışıyorum.
          </p>

          <div className="pt-4 border-t border-zinc-200/70 dark:border-zinc-800/80 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Bu Köşede Neler Var?
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Hayatı biraz daha yalınlaştırma arayışı, teknolojinin düşüncelerimiz ve alışkanlıklarımız üzerindeki sessiz etkileri, okuduğum kitaplardan altını çizdiğim satırlar ve zaman zaman kaydettiğim ses notları... Kısacası kalıcı olmasını dilediğim düşünce kırıntıları.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-200/70 dark:border-zinc-800/80 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Bir Not Bırakmak İsterseniz
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300">
              Buradaki yazılarla ilgili aklınıza takılan bir düşünceyi paylaşmak, bir kitap tavsiyesi vermek veya yalnızca selam iletmek isterseniz her zaman memnuniyetle okurum.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-85 transition-opacity"
              >
                İletişim Sayfasına Geçin
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
