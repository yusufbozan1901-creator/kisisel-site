'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function GlobalError({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  React.useEffect(() => {
    // In production, log to an error reporting service
  }, [error]);

  return (
    <Container className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Beklenmedik Bir Hata Oluştu
      </h2>
      <p className="mt-3 max-w-md text-muted-foreground text-sm">
        İşlem sırasında teknik bir aksaklık yaşandı. Sayfayı yeniden yüklemeyi deneyebilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} variant="default" className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Yeniden Dene
        </Button>
        <Button asChild variant="outline">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Ana Sayfa
          </Link>
        </Button>
      </div>
    </Container>
  );
}

