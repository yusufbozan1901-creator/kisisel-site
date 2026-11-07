import { getAllPosts } from '@/lib/posts';
import { getAllThoughts } from '@/lib/thoughts';
import { SITE_CONFIG } from '@/config/site';

export const dynamic = 'force-static';

interface FeedItem {
  readonly title: string;
  readonly link: string;
  readonly guid: string;
  readonly description: string;
  readonly pubDate: string;
  readonly timestamp: number;
}

/**
 * GET - Generates a consolidated RSS 2.0 XML feed of all blog articles and akis thoughts.
 */
export async function GET(): Promise<Response> {
  const baseUrl = SITE_CONFIG.url;
  const posts = getAllPosts();
  const thoughts = await getAllThoughts();

  const feedItems: FeedItem[] = [];

  // 1. Articles (Blog posts)
  posts.forEach((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    const dateObj = new Date(post.publishedAt);
    const pubDate = isNaN(dateObj.getTime()) ? new Date().toUTCString() : dateObj.toUTCString();
    const timestamp = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();

    feedItems.push({
      title: post.title,
      link: postUrl,
      guid: postUrl,
      description: post.description || post.content.slice(0, 280),
      pubDate,
      timestamp,
    });
  });

  // 2. Timeline Notes (Akis thoughts)
  thoughts.forEach((thought) => {
    const thoughtUrl = `${baseUrl}/akis#${thought.slug}`;
    const dateObj = new Date(thought.date);
    const pubDate = isNaN(dateObj.getTime()) ? new Date().toUTCString() : dateObj.toUTCString();
    const timestamp = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();

    const title = thought.title
      ? `Akış: ${thought.title}`
      : `Akış Notu (${thought.formattedDate})`;

    feedItems.push({
      title,
      link: thoughtUrl,
      guid: thoughtUrl,
      description: thought.content,
      pubDate,
      timestamp,
    });
  });

  // Sort unified feed items descending by real date
  feedItems.sort((a, b) => b.timestamp - a.timestamp);

  const itemsXml = feedItems
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_CONFIG.title} — RSS Akışı]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${SITE_CONFIG.description} — Yazılar ve Anlık Düşünce Akışı]]></description>
    <language>tr-TR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

