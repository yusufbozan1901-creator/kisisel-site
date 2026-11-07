import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { getPostBySlug, getAllPostSlugs, getAdjacentPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/config/site';
import { ReadingProgressBar } from '@/components/mdx/reading-progress-bar';
import { ImageLightbox } from '@/components/mdx/image-lightbox';
import { PostContentRenderer } from '@/components/mdx/post-content-renderer';
import { AudioPlayer } from '@/components/mdx/audio-player';
import { ShareButton } from '@/components/common/share-button';
import { SocialLinks } from '@/components/common/social-links';
import { PostNavigation } from '@/components/mdx/post-navigation';
import { TableOfContents } from '@/components/mdx/table-of-contents';
import { getProfileData, getActiveSocialLinks } from '@/lib/profile';

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

  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const ogImageUrl = post.image
    ? post.image.startsWith('http')
      ? post.image
      : `${SITE_CONFIG.url}${post.image.startsWith('/') ? '' : '/'}${post.image}`
    : `${SITE_CONFIG.url}/blog/${post.slug}/opengraph-image`;

  return {
    title: `${post.title} | ${SITE_CONFIG.name}`,
    description: post.description,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [SITE_CONFIG.author],
      tags: [...post.tags],
      images: [
        {
          url: ogImageUrl,
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
      images: [ogImageUrl],
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

  const adjacent = getAdjacentPosts(slug);
  const profile = await getProfileData();
  const activeSocialLinks = getActiveSocialLinks(profile);
  const hasToc = Boolean(post.toc && post.toc.length >= 2);

  return (
    <>
      <ReadingProgressBar />
      <ImageLightbox />

      <article className="py-20 sm:py-28">
        <Container size={hasToc ? 'default' : 'narrow'}>
          {/* Back Link */}
          <div className="mb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Yazılara Dön
            </Link>
          </div>

          <div className={hasToc ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12 relative items-start' : ''}>
            <div className="min-w-0">
              {/* Article Header */}
              <header className="space-y-4 pb-8 border-b border-zinc-200/70 dark:border-zinc-900/80">
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
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

                <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed pt-1">
                  {post.description}
                </p>

                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Mobile Accordion TOC (Guard clause: >= 2 headings, closed by default) */}
              {hasToc && (
                <div className="lg:hidden mt-6 mb-2">
                  <TableOfContents items={post.toc!} variant="mobile" />
                </div>
              )}

              {/* Auto Top Audio Player if audio field is selected in Pages CMS */}
              {post.audio && (
                <div className="mt-8 mb-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                    Yazı Ses Kaydı
                  </div>
                  <AudioPlayer src={post.audio} />
                </div>
              )}

              {/* Optional Top Cover Image if image field is selected in Pages CMS */}
              {post.image && (
                <div className="my-8 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full max-h-[500px] object-cover cursor-zoom-in"
                  />
                </div>
              )}

              {/* Rendered HTML Content with custom AudioPlayer & Lightbox integration */}
              <PostContentRenderer htmlContent={post.htmlContent || ''} />

              {/* Quiet Sign-off & Interaction */}
              <div className="mt-16 pt-8 border-t border-zinc-200/70 dark:border-zinc-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground">{SITE_CONFIG.author}</span>
                  <SocialLinks links={activeSocialLinks} iconSize="sm" />
                </div>

                <div className="flex items-center gap-3">
                  <ShareButton
                    title={post.title}
                    text={post.description}
                    url={`/blog/${post.slug}`}
                  />
                  <Link href="/contact" className="hover:text-foreground transition-colors underline underline-offset-4">
                    Düşünce Paylaş
                  </Link>
                </div>
              </div>

              {/* Adjacent Posts Navigation */}
              <PostNavigation previousPost={adjacent.previous} nextPost={adjacent.next} />
            </div>

            {/* Desktop Sticky Sidebar TOC (Guard clause: >= 2 headings) */}
            {hasToc && (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <TableOfContents items={post.toc!} variant="desktop" />
                </div>
              </aside>
            )}
          </div>
        </Container>
      </article>
    </>
  );
}
