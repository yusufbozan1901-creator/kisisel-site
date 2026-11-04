import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export default function NotFound() {
  return (
    <Container className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-6">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        404 - Sayfa Bulunamadı
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground text-base">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild variant="default">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    </Container>
  );
}

