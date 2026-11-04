import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Yazılarım',
  description: 'Yusuf Bozan — Kişisel notlar, yazılar ve düşünceler.',
  openGraph: {
    title: `Yazılarım | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan — Kişisel notlar, yazılar ve düşünceler.',
    url: `${SITE_CONFIG.url}/blog`,
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `Yazılarım | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Yazılarım | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan — Kişisel notlar, yazılar ve düşünceler.',
    images: [SITE_CONFIG.ogImage],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="py-20 sm:py-28">
      <Container size="narrow">
        <div className="max-w-xl mb-14 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Yazılarım
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Burada zihnimi kurcalayan konuları, hayata dair gözlemlerimi ve kişisel notlarımı biriktiriyorum.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group border border-zinc-200/80 dark:border-zinc-800/80 bg-card hover:border-zinc-400 dark:hover:border-zinc-750 transition-all duration-200 rounded-lg p-1 sm:p-2"
            >
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
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

                <CardTitle className="text-xl sm:text-2xl font-bold group-hover:underline underline-offset-4 decoration-1 transition-all">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>

                <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
                  {post.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="px-6 py-4 pt-1 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-2">
                <div className="flex items-center gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground/80 font-normal">
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline underline-offset-4"
                >
                  Yazıyı Oku
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
