'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Temayı Değiştir"
        className="opacity-0"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Açık temaya geç' : 'Karanlık temaya geç'}
      title={isDark ? 'Açık temaya geç' : 'Karanlık temaya geç'}
      className="relative text-muted-foreground hover:text-foreground transition-transform hover:scale-105"
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 transition-transform rotate-0 scale-100" />
      )}
      <span className="sr-only">Tema Değiştir</span>
    </Button>
  );
}

