import Link from 'next/link';
import { ArrowRight, Clock, Calendar, Sparkles, Star } from 'lucide-react';
import { HeroSection } from '@/components/sections/hero-section';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getAllPosts } from '@/lib/posts';
import { getAllThoughts } from '@/lib/thoughts';
import { formatDate } from '@/lib/utils';
import { getProfileData, getActiveSocialLinks } from '@/lib/profile';
import { ShareButton } from '@/components/common/share-button';
import { ThoughtPermalink } from '@/components/thoughts/thought-permalink';
import { ImageLightbox } from '@/components/mdx/image-lightbox';

function formatEpisodeBadge(season?: string, episode?: string): string | null {
  const s = season?.trim();
  const e = episode?.trim();

  if (s && e) {
    const sFormatted = /^\d+$/.test(s) ? `S${s.padStart(2, '0')}` : `S${s}`;
    const eFormatted = /^\d+$/.test(e) ? `B${e.padStart(2, '0')}` : `B${e}`;
    return `${sFormatted} • ${eFormatted}`;
  }
  if (s) {
    return /^\d+$/.test(s) ? `S${s.padStart(2, '0')}` : `S${s}`;
  }
  if (e) {
    return /^\d+$/.test(e) ? `B${e.padStart(2, '0')}` : `B${e}`;
  }
  return null;
}

export default async function HomePage() {
  const posts = getAllPosts();
  const thoughts = await getAllThoughts();
  const profile = await getProfileData();
  const activeSocialLinks = getActiveSocialLinks(profile);

  const recentThoughts = thoughts.slice(0, 3);
  const recentPosts = posts.slice(0, 3);

  return (
    <>
      <ImageLightbox />
      <HeroSection socialLinks={activeSocialLinks} />

      {/* Akış (Mikro-Blog / Anlık Düşünceler) Section */}
      {recentThoughts.length > 0 && (
        <section className="pb-16 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/80">
          <Container size="narrow">
            <div className="flex items-baseline justify-between mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                <h2 className="text-xs uppercase tracking-widest font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
                  Son Akış Notları
                </h2>
              </div>
              <Link
                href="/akis"
                className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors group"
              >
                <span>Tüm Akışı Gör</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentThoughts.map((thought) => {
                const episodeBadge = formatEpisodeBadge(thought.season, thought.episode);
                return (
                  <div
                    key={thought.slug}
                    className="rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 bg-card p-4 sm:p-5 transition-all duration-200 hover:border-zinc-400 dark:hover:border-zinc-650"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      <time dateTime={thought.date}>
                        {thought.formattedDate}
                      </time>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {episodeBadge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200">
                            {episodeBadge}
                          </span>
                        )}
                        {thought.rating && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400">
                            <Star className="h-2.5 w-2.5 fill-current" />
                            <span>{thought.rating}</span>
                          </span>
                        )}
                        <ThoughtPermalink slug={thought.slug} />
                        <ShareButton
                          title={`Yusuf Bozan — Akış (${thought.formattedDate})`}
                          text={thought.content.slice(0, 140)}
                          url={`/akis#${thought.slug}`}
                        />
                      </div>
                    </div>

                  <div
                    className="prose prose-zinc dark:prose-invert max-w-none text-foreground/90 text-sm leading-relaxed prose-p:my-1"
                    dangerouslySetInnerHTML={{ __html: thought.htmlContent }}
                  />

                  {thought.image && (
                    <div className="mt-3 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thought.image}
                        alt="Akış görseli"
                        className="w-full max-h-60 object-cover cursor-zoom-in"
                      />
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Featured Articles Section */}
      <section className="pb-24 pt-8 border-t border-zinc-200/60 dark:border-zinc-900/80">
        <Container size="narrow">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-zinc-600 dark:text-zinc-400 font-mono">
              Son Yazılar
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors group"
            >
              <span>Tüm Yazılar ({posts.length})</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6">
            {recentPosts.map((post) => (
              <Card
                key={post.slug}
                className="group border border-zinc-200/80 dark:border-zinc-800/80 bg-card hover:border-zinc-400 dark:hover:border-zinc-650 transition-all duration-200 rounded-lg p-1 sm:p-2"
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
                      <span
                        key={tag}
                        className="text-xs text-zinc-500 dark:text-zinc-400 font-normal"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <ShareButton
                      title={post.title}
                      text={post.description}
                      url={`/blog/${post.slug}`}
                    />
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline underline-offset-4"
                    >
                      Yazıyı Oku
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
