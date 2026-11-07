import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG } from '@/config/site';
import { getProfileData, getActiveSocialLinks } from '@/lib/profile';
import { SocialLinks } from '@/components/common/social-links';

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

export default async function AboutPage() {
  const profile = await getProfileData();
  const activeSocialLinks = getActiveSocialLinks(profile);

  return (
    <div className="py-20 sm:py-28">
      <Container size="narrow">
        {/* Header with optional Avatar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12">
          {profile.avatar && (
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt={profile.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="space-y-3 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {profile.title}
            </h1>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.
            </p>
          </div>
        </div>

        {/* Narrative Essay from profil.json */}
        <div className="space-y-8">
          <div
            className="prose prose-zinc dark:prose-invert prose-editorial max-w-none text-foreground/90 text-base sm:text-lg leading-[1.85]"
            dangerouslySetInnerHTML={{ __html: profile.bioHtml || '' }}
          />

          {/* Social Links if active */}
          {activeSocialLinks.length > 0 && (
            <div className="pt-6 border-t border-zinc-200/70 dark:border-zinc-800/80 space-y-3">
              <h2 className="text-xs uppercase tracking-widest font-mono text-zinc-500 dark:text-zinc-400">
                Sosyal Medya & Bağlantılar
              </h2>
              <SocialLinks links={activeSocialLinks} />
            </div>
          )}

          {/* Contact Section */}
          <div className="pt-6 border-t border-zinc-200/70 dark:border-zinc-800/80 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              İletişim
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
              Buradaki notlarla ilgili bir düşüncenizi paylaşmak, bir soru sormak ya da sadece bir merhaba demek isterseniz her zaman memnuniyetle okurum.
            </p>

            <div className="pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
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
