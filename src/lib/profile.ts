import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export interface SocialLinksObject {
  readonly twitter?: string;
  readonly instagram?: string;
  readonly youtube?: string;
  readonly facebook?: string;
  readonly linkedin?: string;
  readonly telegram?: string;
  readonly [key: string]: string | undefined;
}

export interface ActiveSocialLink {
  readonly name: string;
  readonly url: string;
  readonly platform: 'x' | 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'telegram' | 'github' | 'custom';
}

export interface ProfileData {
  readonly title: string;
  readonly bio: string;
  readonly bioHtml?: string;
  readonly social?: SocialLinksObject;
  // Backward compatibility with previous structures
  readonly socialLinks?: unknown;
  readonly x?: { enabled?: boolean; url?: string };
  readonly github?: { enabled?: boolean; url?: string };
}

const DEFAULT_PROFILE: ProfileData = {
  title: 'Hakkımda',
  bio: 'Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.\n\nBurası internetin telaşından uzakta, kendi kendime düşündüğüm şeyleri not etmek için oluşturduğum sade bir köşe.',
  social: {
    twitter: '',
    instagram: '',
    youtube: '',
    facebook: '',
    linkedin: '',
    telegram: '',
  },
};

const PROFILE_FILE_PATH = path.join(process.cwd(), 'src', 'content', 'profil.json');

/**
 * Safely retrieves profile data from src/content/profil.json with fallback.
 */
export async function getProfileData(): Promise<ProfileData> {
  try {
    if (!fs.existsSync(PROFILE_FILE_PATH)) {
      return DEFAULT_PROFILE;
    }

    const raw = fs.readFileSync(PROFILE_FILE_PATH, 'utf8');
    if (!raw.trim()) {
      return DEFAULT_PROFILE;
    }

    const parsed = JSON.parse(raw) as Partial<ProfileData>;

    const title = parsed.title?.trim() || DEFAULT_PROFILE.title;
    const bio = parsed.bio?.trim() || DEFAULT_PROFILE.bio;

    // Configure marked for safe HTML conversion of bio
    marked.use({ gfm: true, breaks: true });
    const bioHtml = await marked.parse(bio);

    return {
      title,
      bio,
      bioHtml,
      social: parsed.social || DEFAULT_PROFILE.social,
      socialLinks: parsed.socialLinks,
      x: parsed.x,
      github: parsed.github,
    };
  } catch (error) {
    console.error('Failed to read profil.json:', error);
    return DEFAULT_PROFILE;
  }
}

/**
 * Returns only the active social links whose URLs are non-empty strings.
 * If URL is present and filled, it is automatically displayed.
 */
export function getActiveSocialLinks(profile: ProfileData): ActiveSocialLink[] {
  const active: ActiveSocialLink[] = [];
  const addedUrls = new Set<string>();

  const addLink = (
    platform: ActiveSocialLink['platform'],
    name: string,
    urlCandidate?: string
  ) => {
    if (typeof urlCandidate === 'string' && urlCandidate.trim().length > 0) {
      const trimmed = urlCandidate.trim();
      if (!addedUrls.has(trimmed)) {
        addedUrls.add(trimmed);
        active.push({
          platform,
          name,
          url: trimmed,
        });
      }
    }
  };

  // 1. Primary: Single 'social' object (twitter, instagram, youtube, facebook, linkedin, telegram)
  if (profile.social) {
    addLink('x', 'X (Twitter)', profile.social.twitter);
    addLink('instagram', 'Instagram', profile.social.instagram);
    addLink('youtube', 'YouTube', profile.social.youtube);
    addLink('facebook', 'Facebook', profile.social.facebook);
    addLink('linkedin', 'LinkedIn', profile.social.linkedin);
    addLink('telegram', 'Telegram', profile.social.telegram);

    // Support any custom or additional keys in social object
    Object.entries(profile.social).forEach(([key, val]) => {
      if (!['twitter', 'instagram', 'youtube', 'facebook', 'linkedin', 'telegram'].includes(key)) {
        if (key === 'github') {
          addLink('github', 'GitHub', val);
        } else {
          addLink('custom', key.charAt(0).toUpperCase() + key.slice(1), val);
        }
      }
    });
  }

  // 2. Fallback: Array-based socialLinks if user previously saved as list
  if (Array.isArray(profile.socialLinks)) {
    profile.socialLinks.forEach((item: { platform?: string; name?: string; url?: string; enabled?: boolean }) => {
      if (item && item.url && item.url.trim().length > 0 && item.enabled !== false) {
        const p = (item.platform || 'custom').toLowerCase();
        let plat: ActiveSocialLink['platform'] = 'custom';
        let defaultName = item.name || 'Bağlantı';

        if (p === 'x' || p === 'twitter') {
          plat = 'x';
          defaultName = item.name || 'X (Twitter)';
        } else if (p === 'instagram') {
          plat = 'instagram';
          defaultName = item.name || 'Instagram';
        } else if (p === 'youtube') {
          plat = 'youtube';
          defaultName = item.name || 'YouTube';
        } else if (p === 'facebook') {
          plat = 'facebook';
          defaultName = item.name || 'Facebook';
        } else if (p === 'linkedin') {
          plat = 'linkedin';
          defaultName = item.name || 'LinkedIn';
        } else if (p === 'telegram') {
          plat = 'telegram';
          defaultName = item.name || 'Telegram';
        } else if (p === 'github') {
          plat = 'github';
          defaultName = item.name || 'GitHub';
        }

        addLink(plat, defaultName, item.url);
      }
    });
  }

  // 3. Fallback: Legacy top-level keys
  if (profile.x?.url) {
    addLink('x', 'X (Twitter)', profile.x.url);
  }
  if (profile.github?.url) {
    addLink('github', 'GitHub', profile.github.url);
  }

  return active;
}
