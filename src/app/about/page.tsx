import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG } from '@/config/site';
import { getProfileData, getActiveSocialLinks } from '@/lib/profile';
import { SocialLinks } from '@/components/common/social-links';

export const metadata: Metadata = {
  title: 'Hakkımda — Yusuf Bozan',
  description: 'Yusuf Bozan hakkında — Kişisel notlar, ilgi alanları ve bu köşenin ortaya çıkış hikayesi.',
  openGraph: {
    title: `Hakkımda | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan hakkında — Kişisel notlar, ilgi alanları ve bu köşenin ortaya çıkış hikayesi.',
    url: `${SITE_CONFIG.url}/about`,
    type: 'profile',
  },
};

export default async function AboutPage() {
  const profile = await getProfileData();
  const activeSocialLinks = getActiveSocialLinks(profile);

  return (
    <div className="w-full py-10 sm:py-16 pb-24">
      <Container size="default">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Column: Sticky Profile Card (Approx 35% width) */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="p-5 sm:p-6 bg-card border border-border rounded-xl flex flex-col gap-4 shadow-sm">
              {profile.avatar && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-border bg-muted">
                  <Image
                    src={profile.avatar}
                    alt={SITE_CONFIG.name}
                    width={96}
                    height={96}
                    unoptimized={profile.avatar.startsWith('http')}
                    className="w-full h-full object-cover grayscale contrast-125"
                    priority
                  />
                </div>
              )}

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                  {SITE_CONFIG.name}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kişisel notlar, editoryal web ve sakin düşünceler.
                </p>
              </div>

              {/* Location Meta (Only shown if filled in Pages CMS / profil.json) */}
              {profile.location && (
                <div className="flex items-center gap-1.5 pt-3 text-xs text-muted-foreground border-t border-border font-mono">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/80" />
                  <span>{profile.location}</span>
                </div>
              )}

              {/* Social Links */}
              {activeSocialLinks.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <SocialLinks links={activeSocialLinks} />
                </div>
              )}

              {/* Quick Contact Button */}
              <Link
                href="/contact"
                className="w-full mt-1 py-2 px-3 rounded-lg border border-border bg-muted text-foreground text-xs font-medium flex items-center justify-center gap-2 hover:bg-accent hover:border-foreground/20 transition-colors"
              >
                <span>İletişime Geç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Right Column: Narrative (Approx 65% width) */}
          <main className="w-full lg:w-2/3 flex flex-col space-y-8">
            {/* Header */}
            <section className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                {profile.title || 'Hakkımda'}
              </h1>
            </section>

            {/* Narrative Bio */}
            {profile.bioHtml && (
              <section className="pt-4 border-t border-border">
                <div
                  className="prose prose-zinc dark:prose-invert prose-editorial max-w-none text-foreground/90 text-base leading-[1.85]"
                  dangerouslySetInnerHTML={{ __html: profile.bioHtml }}
                />
              </section>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
