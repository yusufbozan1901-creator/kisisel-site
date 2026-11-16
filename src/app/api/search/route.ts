import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { getAllThoughts } from '@/lib/thoughts';
import { getAllShelfItems } from '@/lib/shelf';
import { getAllVideos } from '@/lib/videos';

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: 'Sayfalar' | 'Yazılar' | 'Akış' | 'Kültür';
  date?: string;
}

export async function GET() {
  try {
    const posts = getAllPosts();
    const thoughts = await getAllThoughts();
    const shelfItems = await getAllShelfItems();
    const videos = await getAllVideos();

    const items: SearchResultItem[] = [
      // Standard Pages
      { id: 'nav-home', title: 'Ana Sayfa', description: 'Giriş ve dijital bahçe vitrini', url: '/', category: 'Sayfalar' },
      { id: 'nav-blog', title: 'Yazılar', description: 'Uzun soluklu teknik ve editoryal yazılar', url: '/blog', category: 'Sayfalar' },
      { id: 'nav-akis', title: 'Akış (Mikro-Notlar)', description: 'Zaman çizelgesi ve anlık düşünceler', url: '/akis', category: 'Sayfalar' },
      { id: 'nav-rafim', title: 'Rafım (Kültür Arşivi)', description: 'Film, dizi ve kitap kayıtları', url: '/rafim', category: 'Sayfalar' },
      { id: 'nav-videolar', title: 'Videolar', description: 'Ekran kayıtları ve liste dışı videolar', url: '/videolar', category: 'Sayfalar' },
      { id: 'nav-about', title: 'Hakkımda & Özgeçmiş', description: 'Kişisel profil ve biyografi', url: '/about', category: 'Sayfalar' },
      { id: 'nav-contact', title: 'İletişim', description: 'Bana doğrudan mesaj gönderin', url: '/contact', category: 'Sayfalar' },

      // Blog posts
      ...posts.map((post) => ({
        id: `post-${post.slug}`,
        title: post.title,
        description: post.description || `${post.readingTime} okuma`,
        url: `/blog/${post.slug}`,
        category: 'Yazılar' as const,
        date: post.publishedAt,
      })),

      // Thoughts
      ...thoughts.map((thought) => ({
        id: `thought-${thought.slug}`,
        title: thought.title || thought.content.slice(0, 60) + '...',
        description: thought.formattedDate,
        url: `/akis#${thought.slug}`,
        category: 'Akış' as const,
        date: thought.date,
      })),

      // Shelf items
      ...shelfItems.map((item) => ({
        id: `shelf-${item.slug}`,
        title: item.title,
        description: `${item.type} • ${item.rating} • ${item.category}`,
        url: `/rafim`,
        category: 'Kültür' as const,
      })),

      // Videos
      ...videos.map((video) => ({
        id: `video-${video.slug}`,
        title: video.title,
        description: `${video.category} • ${video.duration}`,
        url: `/videolar`,
        category: 'Kültür' as const,
      })),
    ];

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Search index generation error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
