import type { MetadataRoute } from 'next';
import { SITE_CONFIG, NAV_ITEMS } from '@/config/site';
import { BLOG_POSTS } from '@/data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = NAV_ITEMS.map((item) => ({
    url: `${SITE_CONFIG.url}${item.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: item.href === '/' ? 1.0 : 0.8,
  }));

  const postRoutes = BLOG_POSTS.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
