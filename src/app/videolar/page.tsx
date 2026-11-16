import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getAllVideos } from '@/lib/videos';
import { LiteYouTubeEmbed } from '@/components/videos/lite-youtube-embed';
import { Video } from 'lucide-react';
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
        <section className="max-w-2xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Videolarım
          </h1>
        </section>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="p-12 rounded-xl border border-dashed border-zinc-300 dark:border-[#27272A] bg-zinc-50/50 dark:bg-[#0A0A0A] text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-zinc-100 dark:bg-[#141414] text-zinc-500">
              <Video className="w-5 h-5" />
            </div>
            <p className="text-sm text-zinc-500 dark:text-[#71717A]">
              Henüz kayıt yok.
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
                />

                {/* Video Info Body */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-foreground transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-zinc-600 dark:text-[#A1A1AA] leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  {video.formattedDate && (
                    <div className="pt-2 border-t border-zinc-100 dark:border-[#1F1F1F] flex items-center justify-end text-xs">
                      <span className="font-mono text-[11px] text-zinc-500 dark:text-[#71717A]">
                        {video.formattedDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
