import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { SITE_CONFIG, NAV_ITEMS } from '@/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200/70 dark:border-zinc-900/80 py-12">
      <Container size="narrow">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          {/* Copyright */}
          <div>
            <p>© {currentYear} {SITE_CONFIG.name}. Tüm hakları saklıdır.</p>
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
