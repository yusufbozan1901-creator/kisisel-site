'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AudioPlayer } from './audio-player';

interface PostContentRendererProps {
  readonly htmlContent: string;
}

/**
 * Renders HTML content from Markdown, replacing native <audio> tags
 * with the custom AudioPlayer component and making images clickable
 * for the lightbox (via CSS cursor).
 */
export function PostContentRenderer({ htmlContent }: PostContentRendererProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [audioSources, setAudioSources] = React.useState<string[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Replace native <audio> elements with placeholder mounts
    const audioElements = container.querySelectorAll('audio');
    const sources: string[] = [];

    audioElements.forEach((audio, idx) => {
      const src = audio.getAttribute('src') || audio.querySelector('source')?.getAttribute('src');
      if (!src) return;

      const mountId = `audio-mount-${idx}`;
      sources.push(src);

      const placeholder = document.createElement('div');
      placeholder.id = mountId;
      placeholder.setAttribute('data-audio-src', src);
      placeholder.className = 'audio-player-mount';
      audio.parentNode?.replaceChild(placeholder, audio);
    });

    // Make images in content clickable (cursor hint for lightbox)
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      img.style.cursor = 'zoom-in';
    });

    setAudioSources(sources);
  }, [htmlContent]);

  return (
    <>
      <div
        ref={containerRef}
        className="prose prose-zinc dark:prose-invert prose-editorial pt-8 max-w-none text-foreground/90 prose-headings:font-bold prose-headings:tracking-tight prose-a:underline prose-a:underline-offset-4 prose-pre:border prose-pre:border-zinc-800 prose-pre:bg-zinc-950 prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm prose-blockquote:border-l-2 prose-blockquote:border-zinc-400 dark:prose-blockquote:border-zinc-700"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {mounted &&
        audioSources.map((src, idx) => (
          <AudioPlayerPortal key={`${src}-${idx}`} mountId={`audio-mount-${idx}`} src={src} />
        ))}
    </>
  );
}

function AudioPlayerPortal({
  mountId,
  src,
}: {
  readonly mountId: string;
  readonly src: string;
}) {
  const [target, setTarget] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = document.getElementById(mountId);
    if (el) {
      setTarget(el);
    }
  }, [mountId]);

  if (!target) return null;

  return createPortal(<AudioPlayer src={src} />, target);
}


