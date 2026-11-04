import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/config/site';

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
    };
  }

  return {
    title: `${post.title} | ${SITE_CONFIG.name}`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [SITE_CONFIG.author],
      tags: [...post.tags],
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [SITE_CONFIG.ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-20 sm:py-28">
      <Container size="narrow">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Yazılara Dön
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pb-10 border-b border-zinc-200/70 dark:border-zinc-900/80">
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.publishedAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed pt-1">
            {post.description}
          </p>

          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Rendered HTML Content with Tailwind Typography (prose) and Book layout */}
        <div
          className="prose prose-zinc dark:prose-invert prose-editorial pt-8 max-w-none text-foreground/90 prose-headings:font-bold prose-headings:tracking-tight prose-a:underline prose-a:underline-offset-4 prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-950 prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm prose-blockquote:border-l-2 prose-blockquote:border-zinc-400 dark:prose-blockquote:border-zinc-700"
          dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
        />

        {/* Quiet Sign-off */}
        <div className="mt-16 pt-8 border-t border-zinc-200/70 dark:border-zinc-900/80 flex items-center justify-between text-xs text-muted-foreground">
          <span>{SITE_CONFIG.author}</span>
          <Link href="/contact" className="hover:text-foreground transition-colors underline underline-offset-4">
            Düşünce Paylaş
          </Link>
        </div>
      </Container>
    </article>
  );
}
