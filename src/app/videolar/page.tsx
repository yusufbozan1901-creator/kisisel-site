import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getAllVideos } from '@/lib/videos';
import { LiteYouTubeEmbed } from '@/components/videos/lite-youtube-embed';
import { Video, ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'Videolar — Yusuf Bozan',
  description: 'Canlı kodlama, arayüz prototipleri ve liste dışı ekran kayıtları.',
  openGraph: {
    title: `Videolar | ${SITE_CONFIG.name}`,
    description: 'Canlı kodlama, arayüz prototipleri ve liste dışı ekran kayıtları.',
    url: `${SITE_CONFIG.url}/videolar`,
    type: 'website',
  },
};

export default async function VideolarPage() {
  const videos = await getAllVideos();

  return (
    <div className="w-full py-10 sm:py-16 pb-24">
      <Container size="default">
        {/* Header */}
        <section className="max-w-2xl mb-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-[#71717A]">
              ÖZEL & LİSTE DIŞI VİDEO ARŞİVİ
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Videolar / Ekran Kayıtları
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
            Ürün prototipleri, canlı kodlama seansları, arayüz denemeleri ve liste dışı özel video kayıtları.
          </p>
        </section>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="p-12 rounded-xl border border-dashed border-zinc-300 dark:border-[#27272A] bg-zinc-50/50 dark:bg-[#0A0A0A] text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-zinc-100 dark:bg-[#141414] text-zinc-500">
              <Video className="w-5 h-5" />
            </div>
            <h2 className="text-base font-medium text-zinc-900 dark:text-white">
              Henüz Video Eklenmedi
            </h2>
            <p className="text-xs text-zinc-500 dark:text-[#71717A] max-w-sm mx-auto">
              Pages CMS üzerinden &quot;Videolar&quot; sekmesine girerek YouTube video bağlantılarını veya ID&apos;lerini eklediğinde burada sıfır gecikmeli Lite Embed olarak yayınlanacaktır.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div
                key={video.slug}
                className="group bg-white dark:bg-[#0A0A0A] border border-zinc-200/80 dark:border-[#1F1F1F] rounded-xl overflow-hidden hover:border-zinc-400 dark:hover:border-[#333333] transition-colors flex flex-col shadow-sm"
              >
                {/* 16:9 Lite Embed Container */}
                <LiteYouTubeEmbed
                  youtubeId={video.youtubeId}
                  title={video.title}
                  duration={video.duration}
                  isUnlisted={video.isUnlisted}
                  quality={video.quality}
                />

                {/* Video Info Body */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-[#71717A] font-mono">
                      <span>{video.category}</span>
                      <span>{video.formattedDate}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-foreground transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] leading-relaxed line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-[#1F1F1F] flex items-center justify-between text-xs">
                    {video.youtubeId ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 dark:text-[#A1A1AA] hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>YouTube&apos;da Aç</span>
                      </a>
                    ) : (
                      <span className="text-zinc-400">Özel Kayıt</span>
                    )}
                    <span className="font-mono text-[11px] text-zinc-500 dark:text-[#71717A]">
                      {video.quality}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
