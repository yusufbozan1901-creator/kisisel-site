'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/config/site';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { SearchButton } from '@/components/common/search-button';
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <Container size="default">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Monogram */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-card border border-border flex items-center justify-center font-mono font-semibold text-xs text-foreground tracking-wider group-hover:border-foreground/40 transition-colors">
                YB
              </div>
              <span className="font-medium text-foreground text-sm tracking-tight">
                Yusuf Bozan
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav
            aria-label="Ana Menü"
            className="hidden md:flex items-center gap-1 whitespace-nowrap"
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
                    'text-xs font-medium rounded-md px-2.5 py-1 transition-colors',
                    isActive
                      ? 'text-foreground bg-muted border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <SearchButton />
            <ThemeToggle />
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground font-medium text-xs px-3.5 py-1.5 rounded-full hover:bg-primary/90 transition-colors shrink-0"
            >
              İletişim
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
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
          <div className="md:hidden border-t border-border py-3 space-y-1">
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
                    'block px-3 py-2 text-xs font-medium transition-colors rounded-md',
                    isActive
                      ? 'text-foreground bg-muted'
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
