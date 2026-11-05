import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG } from '@/config/site';
import { SocialLinks } from '@/components/common/social-links';
import type { ActiveSocialLink } from '@/lib/profile';

interface HeroSectionProps {
  readonly socialLinks?: readonly ActiveSocialLink[];
}

export function HeroSection({ socialLinks }: HeroSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <Container size="narrow">
        <div className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {SITE_CONFIG.name}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.
            </p>
          </div>

          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-loose">
            Burası internetin telaşından ve gürültüsünden uzakta, kendi kendime düşündüğüm şeyleri not etmek, zihnimi toparlamak ve zamanla biriktireceğim yazıları paylaşmak için oluşturduğum sade bir köşe.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-5 text-sm">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-foreground font-medium underline underline-offset-4 decoration-1 decoration-foreground/30 hover:decoration-foreground transition-colors"
            >
              Yazıları Oku
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/akis"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Akış
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Hakkımda
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              İletişim
            </Link>
          </div>

          {socialLinks && socialLinks.length > 0 && (
            <div className="pt-2">
              <SocialLinks links={socialLinks} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
