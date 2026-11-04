'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS, SITE_CONFIG } from '@/config/site';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 dark:border-zinc-850 dark:border-zinc-900/80 bg-background/85 backdrop-blur-md">
      <Container size="narrow">
        <div className="flex h-16 items-center justify-between">
          {/* Typographic Logo & Name */}
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity"
          >
            {SITE_CONFIG.name}
          </Link>

          {/* Desktop Nav Links */}
          <nav
            aria-label="Ana Menü"
            className="hidden md:flex items-center gap-6 text-sm font-normal"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'transition-colors py-1',
                    isActive
                      ? 'text-foreground font-medium underline underline-offset-8 decoration-1 decoration-foreground/40'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Action Items */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200/60 dark:border-zinc-900 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-sm transition-colors rounded-md',
                    isActive
                      ? 'text-foreground font-medium bg-muted/40'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </header>
  );
}
