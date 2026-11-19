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
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Videolarım
          </h1>
        </section>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="p-12 rounded-xl border border-dashed border-border bg-card text-center space-y-3 shadow-sm">
            <div className="inline-flex p-3 rounded-full bg-muted text-muted-foreground mx-auto">
              <Video className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Henüz bir video kaydı bulunmuyor.
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Canlı kodlama, arayüz prototipleri ve ekran kayıtları eklendiğinde burada yer alacaktır.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <div
                key={video.slug}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/30 transition-colors flex flex-col shadow-sm"
              >
                {/* 16:9 Lite Embed Container */}
                <LiteYouTubeEmbed
                  youtubeId={video.youtubeId}
                  title={video.title}
                />

                {/* Video Info Body */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
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
        )}
      </Container>
    </div>
  );
}
