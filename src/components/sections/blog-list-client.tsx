'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface PostItem {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly tags: readonly string[];
}

interface BlogListClientProps {
  readonly posts: readonly PostItem[];
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const [query, setQuery] = React.useState('');
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  // Collect all unique tags
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [posts]);

  // Filter posts
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const matchesQuery =
        query.trim() === '' ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase());

      const matchesTag = !activeTag || post.tags.includes(activeTag);

      return matchesQuery && matchesTag;
    });
  }, [posts, query, activeTag]);

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Yazılarda ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Yazılarda ara"
        />
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              activeTag === null
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-600'
            }`}
          >
            Tümü
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeTag === tag
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Aramanızla eşleşen yazı bulunamadı.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Card
              key={post.slug}
              className="group border border-zinc-200/80 dark:border-zinc-800/80 bg-card hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 rounded-lg p-1 sm:p-2"
            >
              <CardHeader className="p-6 pb-3">
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-mono">
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

                <CardDescription className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2">
                  {post.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="px-6 py-4 pt-1 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-2">
                <div className="flex items-center gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs text-zinc-500 dark:text-zinc-500 font-normal">
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
          ))
        )}
      </div>
    </>
  );
}

