import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG, NAV_ITEMS } from '@/config/site';
import { getProfileData, getActiveSocialLinks } from '@/lib/profile';
import { SocialLinks } from '@/components/common/social-links';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const profile = await getProfileData();
  const activeSocialLinks = getActiveSocialLinks(profile);

  return (
    <footer className="mt-auto border-t border-zinc-200/70 dark:border-zinc-900/80 py-10">
      <Container size="narrow">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          {/* Copyright & Social */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p>© {currentYear} {SITE_CONFIG.name}. Tüm hakları saklıdır.</p>
            {activeSocialLinks.length > 0 && (
              <SocialLinks links={activeSocialLinks} iconSize="sm" />
            )}
          </div>

          {/* Quick minimal nav */}
          <div className="flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
