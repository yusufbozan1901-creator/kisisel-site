import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/sections/hero-section';
import { NowBento } from '@/components/sections/now-bento';
import { Container } from '@/components/ui/container';
import { getAllPosts } from '@/lib/posts';
import { getAllThoughts } from '@/lib/thoughts';
import { getAllShelfItems } from '@/lib/shelf';
import { getAllVideos } from '@/lib/videos';
import { getProfileData, getActiveSocialLinks } from '@/lib/profile';
import { getNowData } from '@/lib/now';
import { formatDate } from '@/lib/utils';
import { ShareButton } from '@/components/common/share-button';
import { ThoughtPermalink } from '@/components/thoughts/thought-permalink';
import { ImageLightbox } from '@/components/mdx/image-lightbox';
import { AudioPlayer } from '@/components/mdx/audio-player';
import { LiteYouTubeEmbed } from '@/components/videos/lite-youtube-embed';
import { ShelfShowcase } from '@/components/shelf/shelf-showcase';

export default async function HomePage() {
  const posts = getAllPosts();
  const thoughts = await getAllThoughts();
  const shelfItems = await getAllShelfItems();
  const videos = await getAllVideos();
  const profile = await getProfileData();
  const now = await getNowData();
  const activeSocialLinks = getActiveSocialLinks(profile);

  const recentPosts = posts.slice(0, 3);
  const recentThoughts = thoughts.slice(0, 3);
  const recentShelfItems = shelfItems.slice(0, 4);
  const recentVideos = videos.slice(0, 2);

  return (
    <div className="w-full pb-20 space-y-12">
      <ImageLightbox />

      {/* 1. Hero Section */}
      <HeroSection
        heroTitle={profile.heroTitle}
        heroDescription={profile.heroDescription}
        socialLinks={activeSocialLinks}
      />

      {/* 2. "Şu Sıralar" Now Bento Strip */}
      <Container size="default">
        <NowBento now={now} />
      </Container>

      {/* 3. Akış */}
      {recentThoughts.length > 0 && (
        <section className="pt-6 border-t border-border" id="akis">
          <Container size="default">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground font-mono">
                  AKIŞ
                </h2>
              </div>
              <Link
                href="/akis"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <span>Tüm Akış</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <div className="space-y-4">
              {recentThoughts.map((thought) => (
                <div
                  key={thought.slug}
                  id={thought.slug}
                  className="scroll-mt-24 rounded-xl border border-border bg-card p-4 sm:p-5 transition-all duration-200 hover:border-foreground/30"
                >
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono text-muted-foreground">
                    <time dateTime={thought.date}>
                      {thought.formattedDate}
                    </time>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <ThoughtPermalink slug={thought.slug} />
                      <ShareButton
                        title={`Yusuf Bozan — Akış (${thought.formattedDate})`}
                        text={thought.content.slice(0, 140)}
                        url={`/akis#${thought.slug}`}
                      />
                    </div>
                  </div>

                    <div
                      className="prose prose-zinc dark:prose-invert max-w-none text-foreground text-sm leading-relaxed prose-p:my-1"
                      dangerouslySetInnerHTML={{ __html: thought.htmlContent }}
                    />

                    {thought.audio && (
                      <div className="pt-2">
                        <AudioPlayer src={thought.audio} />
                      </div>
                    )}

                    {thought.image && (
                      <div className="relative mt-3 overflow-hidden rounded-lg border border-border">
                        <Image
                          src={thought.image}
                          alt="Akış görseli"
                          width={720}
                          height={480}
                          unoptimized={thought.image.startsWith('http')}
                          className="w-full max-h-72 object-cover cursor-zoom-in"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </Container>
        </section>
      )}

      {/* 4. Son Yazılar */}
      {recentPosts.length > 0 && (
        <section className="pt-6 border-t border-border" id="yazilar">
          <Container size="default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground font-mono">
                  SON YAZILAR
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground font-mono">
                  {posts.length} Yazı
                </span>
              </div>
              <Link
                href="/blog"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <span>Tüm Yazılar</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="py-4 group flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-accent/40 px-3 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base font-medium text-foreground group-hover:text-foreground transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground text-[11px]">
                      {post.readingTime}
                    </span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 5. Rafım / Film, Dizi & Kitaplar Showcase */}
      {recentShelfItems.length > 0 && (
        <section className="pt-6 border-t border-border" id="rafim">
          <Container size="default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground font-mono">
                  RAFIM
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground font-mono">
                  {shelfItems.length} Kayıt
                </span>
              </div>
              <Link
                href="/rafim"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <span>Tüm Rafım</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <ShelfShowcase items={recentShelfItems} />
          </Container>
        </section>
      )}

      {/* 6. Videolar Showcase */}
      {recentVideos.length > 0 && (
        <section className="pt-6 border-t border-border" id="videolar">
          <Container size="default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground font-mono">
                  VİDEOLAR
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground font-mono">
                  {videos.length} Video
                </span>
              </div>
              <Link
                href="/videolar"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <span>Tüm Videolar</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentVideos.map((video) => (
                <div
                  key={video.slug}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/30 transition-colors flex flex-col shadow-sm"
                >
                  <LiteYouTubeEmbed
                    youtubeId={video.youtubeId}
                    title={video.title}
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-foreground">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {video.description}
                        </p>
                      )}
                    </div>
                    {video.formattedDate && (
                      <div className="pt-2 border-t border-border flex items-center justify-end text-xs">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {video.formattedDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
