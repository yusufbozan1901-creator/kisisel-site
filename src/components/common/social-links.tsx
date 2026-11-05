import * as React from 'react';
import { Globe } from 'lucide-react';
import {
  TwitterIcon,
  InstagramIcon,
  YouTubeIcon,
  FacebookIcon,
  GitHubIcon,
  LinkedInIcon,
  TelegramIcon,
} from '@/components/common/icons';
import type { ActiveSocialLink } from '@/lib/profile';
import { cn } from '@/lib/utils';

interface SocialLinksProps {
  readonly links: readonly ActiveSocialLink[];
  readonly className?: string;
  readonly iconSize?: 'sm' | 'default';
}

function getPlatformIcon(platform: ActiveSocialLink['platform']) {
  switch (platform) {
    case 'x':
      return <TwitterIcon className="h-4 w-4" />;
    case 'instagram':
      return <InstagramIcon className="h-4 w-4" />;
    case 'youtube':
      return <YouTubeIcon className="h-4 w-4" />;
    case 'facebook':
      return <FacebookIcon className="h-4 w-4" />;
    case 'github':
      return <GitHubIcon className="h-4 w-4" />;
    case 'linkedin':
      return <LinkedInIcon className="h-4 w-4" />;
    case 'telegram':
      return <TelegramIcon className="h-4 w-4" />;
    case 'custom':
    default:
      return <Globe className="h-4 w-4" />;
  }
}

export function SocialLinks({ links, className, iconSize = 'default' }: SocialLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const sizeClass = iconSize === 'sm' ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm';

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      aria-label="Sosyal Medya Bağlantıları"
    >
      {links.map((link) => (
        <a
          key={`${link.platform}-${link.url}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            sizeClass
          )}
          aria-label={link.name}
          title={link.name}
        >
          {getPlatformIcon(link.platform)}
        </a>
      ))}
    </div>
  );
}
