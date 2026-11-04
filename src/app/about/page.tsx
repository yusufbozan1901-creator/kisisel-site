import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Hakkımda',
  description: 'Yusuf Bozan hakkında — Kişisel notlar, ilgi alanları ve bu köşenin ortaya çıkış hikayesi.',
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
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.
          </p>
        </div>

        {/* Narrative Essay */}
        <div className="max-w-none text-base sm:text-lg text-foreground/90 leading-[1.85] space-y-8">
          <p>
            Burası zihnimi kurcalayan konuları, hayata dair gözlemlerimi ve zamanla biriktirdiğim notları derli toplu bir şekilde paylaşmak için oluşturduğum sade bir alan.
          </p>

          <p>
            İnternetin ilk dönemlerindeki kişisel web sitelerinin samimiyetini her zaman sevdim. Gösterişten, büyük iddialardan ve sürekli dikkat çekme çabasından uzak; insanların kendi meraklarını, okumalarını ve düşüncelerini kendi ritimlerinde paylaştığı o sakin havayı burada da korumaya çalışıyorum.
          </p>

          <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-900/80 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Neler Üzerine Düşünüyorum?
            </h2>
            <p className="text-muted-foreground">
              Genellikle hayatımızdaki fazlalıkları eleyerek öz olanı bulma arayışı (sadelik), teknolojinin ve dijital araçların düşünme biçimimiz üzerindeki etkileri ve düzenli not tutarak kendi bilgi havuzunu oluşturma süreçleri üzerine kafa yoruyorum.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-200/60 dark:border-zinc-900/80 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              İletişim
            </h2>
            <p className="text-muted-foreground">
              Buradaki notlarla ilgili bir düşüncenizi paylaşmak, bir soru sormak ya da sadece bir merhaba demek isterseniz her zaman memnuniyetle okurum.
            </p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
              >
                İletişim Formuna Git
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
