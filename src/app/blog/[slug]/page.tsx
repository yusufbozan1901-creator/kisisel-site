import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { BLOG_POSTS } from '@/data/posts';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/config/site';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
    };
  }

  return {
    title: `${post.title} | ${SITE_CONFIG.name}`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

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

          <div className="flex items-center gap-2 pt-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground font-mono">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Editorial Essay Content */}
        <div className="pt-10 max-w-none text-base sm:text-lg text-foreground/90 leading-[1.85] space-y-6">
          {post.content.trim().split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg sm:text-xl font-bold tracking-tight text-foreground pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-6">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            return (
              <p key={index} className="text-foreground/90 leading-[1.85]">
                {paragraph}
              </p>
            );
          })}
        </div>

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
