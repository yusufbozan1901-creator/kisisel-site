import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PostNavigationProps {
  readonly previousPost: { readonly slug: string; readonly title: string } | null;
  readonly nextPost: { readonly slug: string; readonly title: string } | null;
}

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) return null;

  return (
    <nav
      className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
      aria-label="Yazı gezintisi"
    >
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="group flex flex-col gap-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            <ArrowLeft className="h-3 w-3" />
            Önceki Yazı
          </span>
          <span className="text-sm font-medium text-foreground group-hover:underline underline-offset-4 decoration-1 line-clamp-2">
            {previousPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group flex flex-col items-end gap-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors text-right"
        >
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Sonraki Yazı
            <ArrowRight className="h-3 w-3" />
          </span>
          <span className="text-sm font-medium text-foreground group-hover:underline underline-offset-4 decoration-1 line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

