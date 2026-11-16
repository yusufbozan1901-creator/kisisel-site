import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
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
      <HeroSection socialLinks={activeSocialLinks} />

      {/* 2. "Şu Sıralar" Now Bento Strip */}
      <Container size="default">
        <NowBento now={now} />
      </Container>

      {/* 3. Son Yazılar / Düşünce Notları */}
      {recentPosts.length > 0 && (
        <section className="pt-6 border-t border-zinc-200/80 dark:border-[#1F1F1F]" id="yazilar">
          <Container size="default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-900 dark:text-white font-mono">
                  SON YAZILAR / DÜŞÜNCE NOTLARI
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] text-zinc-600 dark:text-[#71717A] font-mono">
                  {posts.length} Yazı
                </span>
              </div>
              <Link
                href="/blog"
                className="text-xs text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Tüm Yazılar</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <div className="divide-y divide-zinc-200/80 dark:divide-[#1F1F1F] border-y border-zinc-200/80 dark:border-[#1F1F1F]">
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="py-4 group flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-[#0A0A0A]/60 px-3 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base font-medium text-zinc-900 dark:text-white group-hover:text-foreground transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-[#71717A] font-mono">
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-zinc-500 dark:text-[#71717A]">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#141414] border border-zinc-200 dark:border-[#1F1F1F] text-zinc-700 dark:text-[#A1A1AA] text-[11px]">
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

      {/* 4. Akış / Mikro-Notlar */}
      {recentThoughts.length > 0 && (
        <section className="pt-6 border-t border-zinc-200/80 dark:border-[#1F1F1F]" id="akis">
          <Container size="default">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-900 dark:text-white font-mono">
                  AKIŞ / MİKRO-NOTLAR
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] text-[11px] font-mono text-zinc-600 dark:text-[#71717A]">
                  İndieWeb Standart
                </span>
              </div>
              <Link
                href="/akis"
                className="text-xs text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Tüm Akış</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <div className="space-y-4">
              {recentThoughts.map((thought) => {
                const episodeBadge = formatEpisodeBadge(thought.season, thought.episode);
                return (
                  <div
                    key={thought.slug}
                    id={thought.slug}
                    className="scroll-mt-24 rounded-xl border border-zinc-200/80 dark:border-[#1F1F1F] bg-white dark:bg-[#0A0A0A] p-4 sm:p-5 transition-all duration-200 hover:border-zinc-400 dark:hover:border-[#333333]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                      <time dateTime={thought.date}>
                        {thought.formattedDate}
                      </time>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {episodeBadge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border border-zinc-200 dark:border-[#27272A] bg-zinc-100/90 dark:bg-[#141414] text-zinc-800 dark:text-zinc-200">
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
                      className="prose prose-zinc dark:prose-invert max-w-none text-zinc-900 dark:text-[#E5E2E1] text-sm leading-relaxed prose-p:my-1"
                      dangerouslySetInnerHTML={{ __html: thought.htmlContent }}
                    />

                    {thought.audio && (
                      <div className="pt-2">
                        <AudioPlayer src={thought.audio} />
                      </div>
                    )}

                    {thought.image && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-[#1F1F1F]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thought.image}
                          alt="Akış görseli"
                          className="w-full max-h-72 object-cover cursor-zoom-in"
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

      {/* 5. Rafım / Film, Dizi & Kitaplar Showcase */}
      {recentShelfItems.length > 0 && (
        <section className="pt-6 border-t border-zinc-200/80 dark:border-[#1F1F1F]" id="rafim">
          <Container size="default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-900 dark:text-white font-mono">
                  RAFIM / FİLM, DİZİ & KİTAPLAR
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] text-zinc-600 dark:text-[#71717A] font-mono">
                  {shelfItems.length} Kayıt
                </span>
              </div>
              <Link
                href="/rafim"
                className="text-xs text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Tüm Rafım</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentShelfItems.map((item) => (
                <Link
                  key={item.slug}
                  href="/rafim"
                  className="group bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] rounded-xl overflow-hidden flex flex-col hover:border-zinc-400 dark:hover:border-[#333333] transition-colors shadow-sm text-left"
                >
                  <div className="relative w-full aspect-[2/3] bg-zinc-100 dark:bg-[#141414] overflow-hidden">
                    {item.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-zinc-400">
                        <span className="text-xs font-mono font-medium">{item.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    {item.badge && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] text-[10px] font-mono font-medium text-white">
                          {item.badge}
                        </span>
                      </div>
                    )}
                    {item.rating && (
                      <div className="absolute bottom-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#27272A] font-mono text-xs text-white">
                          {item.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-[#71717A] tracking-wider uppercase font-semibold">
                        {item.type} • {item.year || item.category}
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mt-0.5 truncate">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 6. Videolar Showcase */}
      {recentVideos.length > 0 && (
        <section className="pt-6 border-t border-zinc-200/80 dark:border-[#1F1F1F]" id="videolar">
          <Container size="default">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-zinc-900 dark:text-white font-mono">
                  VİDEOLAR / ÖZEL & LİSTE DIŞI KAYITLAR
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#1F1F1F] text-zinc-600 dark:text-[#71717A] font-mono">
                  {videos.length} Video
                </span>
              </div>
              <Link
                href="/videolar"
                className="text-xs text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Tüm Videolar</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentVideos.map((video) => (
                <div
                  key={video.slug}
                  className="group bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] rounded-xl overflow-hidden hover:border-zinc-400 dark:hover:border-[#333333] transition-colors flex flex-col shadow-sm"
                >
                  <LiteYouTubeEmbed
                    youtubeId={video.youtubeId}
                    title={video.title}
                    duration={video.duration}
                    isUnlisted={video.isUnlisted}
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-[#71717A] font-mono mb-1">
                        <span>{video.category}</span>
                        <span>{video.formattedDate}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] line-clamp-2 mt-1 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>
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
