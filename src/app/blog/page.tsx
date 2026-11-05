import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { BlogListClient } from '@/components/sections/blog-list-client';
import { getAllPosts } from '@/lib/posts';
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
        <div className="max-w-xl mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Yazılarım
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
            Burada zihnimi kurcalayan konuları, hayata dair gözlemlerimi ve kişisel notlarımı biriktiriyorum.
          </p>
        </div>

        <BlogListClient posts={posts} />
      </Container>
    </div>
  );
}
