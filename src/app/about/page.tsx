import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Sparkles, Wrench } from 'lucide-react';
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

const TOOLKIT = [
  'TypeScript',
  'Next.js (App Router)',
  'React',
  'Tailwind CSS',
  'Markdown / MDX',
  'Git & GitHub',
  'Pages CMS',
  'Web Standartları',
] as const;

const FOCUS_AREAS = [
  {
    title: 'Minimalist Web Mimarisi',
    description: 'Gereksiz yüklerden arındırılmış, hafif ve sıfır gecikmeli modern web standartları.',
  },
  {
    title: 'Editoryal Tipografi',
    description: 'Okuma ritmini dinlendiren, ferah satır aralıkları ve sakin kontrast dengesi.',
  },
  {
    title: 'Bağımsız Dijital Bahçe',
    description: 'Algoritmaların hız yarışından uzak, kalıcı düşüncelerin biriktiği yaşayan kişisel arşiv.',
  },
] as const;

export default async function AboutPage() {
  const profile = await getProfileData();
  const activeSocialLinks = getActiveSocialLinks(profile);

  return (
    <div className="w-full py-10 sm:py-16 pb-24">
      <Container size="default">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Column: Sticky Profile Card (Approx 35% width) */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="p-5 sm:p-6 bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] rounded-xl flex flex-col gap-4 shadow-sm">
              {profile.avatar && (
                <div className="w-24 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-[#27272A] bg-zinc-100 dark:bg-[#141414]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatar}
                    alt={SITE_CONFIG.name}
                    className="w-full h-full object-cover grayscale contrast-125"
                  />
                </div>
              )}

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {SITE_CONFIG.name}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
                  Kişisel notlar, editoryal web ve sakin düşünceler.
                </p>
              </div>

              {/* Status & Location Meta */}
              <div className="flex flex-col gap-1.5 pt-3 text-xs text-zinc-500 dark:text-[#71717A] border-t border-zinc-100 dark:border-[#1F1F1F] font-mono">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>İstanbul, Türkiye (UTC+3)</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>İletişime & sohbete açık</span>
                </div>
              </div>

              {/* Social Links */}
              {activeSocialLinks.length > 0 && (
                <div className="pt-3 border-t border-zinc-100 dark:border-[#1F1F1F]">
                  <SocialLinks links={activeSocialLinks} />
                </div>
              )}

              {/* Quick Contact Button */}
              <Link
                href="/contact"
                className="w-full mt-1 py-2 px-3 rounded-lg border border-zinc-200 dark:border-[#27272A] bg-zinc-50 dark:bg-[#141414] text-zinc-900 dark:text-white text-xs font-medium flex items-center justify-center gap-2 hover:border-zinc-400 dark:hover:border-[#3F3F46] hover:bg-zinc-100 dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <span>İletişime Geç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>

          {/* Right Column: Detailed Narrative & Modules (Approx 65% width) */}
          <main className="w-full lg:w-2/3 flex flex-col space-y-10">
            {/* Header (No green-dot top label) */}
            <section className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {profile.title || 'Hakkımda'}
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
                İnternetin telaşından uzakta, zihnimi toparlamak ve zaman içinde biriktirdiğim notları paylaşmak için açtığım kişisel bir köşe.
              </p>
            </section>

            {/* Narrative Bio */}
            {profile.bioHtml && (
              <section className="pt-4 border-t border-zinc-200/80 dark:border-[#1F1F1F]">
                <div
                  className="prose prose-zinc dark:prose-invert prose-editorial max-w-none text-zinc-800 dark:text-[#E5E2E1] text-base leading-[1.85]"
                  dangerouslySetInnerHTML={{ __html: profile.bioHtml }}
                />
              </section>
            )}

            {/* Focus & Interests */}
            <section className="pt-6 border-t border-zinc-200/80 dark:border-[#1F1F1F] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-[#71717A] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>ODAK VE İLGİ ALANLARI</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FOCUS_AREAS.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] flex flex-col justify-between space-y-2 hover:border-zinc-400 dark:hover:border-[#333333] transition-colors shadow-sm"
                  >
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Toolkit / Kullandıklarım */}
            <section className="pt-6 border-t border-zinc-200/80 dark:border-[#1F1F1F] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-[#71717A] uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5 text-zinc-400" />
                <span>KULLANDIKLARIM / ARAÇ ÇANTASI</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {TOOLKIT.map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] text-xs font-mono text-zinc-700 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-[#27272A] transition-colors shadow-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </section>

            {/* Closing Invitation Box */}
            <section className="p-6 rounded-xl bg-zinc-50 dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] space-y-3">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Bir Not Bırakmak İsterseniz
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
                Buradaki yazılarla ilgili aklınıza takılan bir düşünceyi paylaşmak, bir kitap tavsiyesi vermek veya yalnızca selam iletmek isterseniz her zaman memnuniyetle okurum.
              </p>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 dark:text-white underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  <span>İletişim Formuna Git</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>
          </main>
        </div>
      </Container>
    </div>
  );
}
