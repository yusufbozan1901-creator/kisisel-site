import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export interface SocialLinkItem {
  readonly platform: 'x' | 'instagram' | 'youtube' | 'facebook' | 'github' | 'linkedin' | 'custom' | string;
  readonly name?: string;
  readonly url: string;
  readonly enabled?: boolean;
}

export interface LegacySocialPlatform {
  readonly enabled?: boolean;
  readonly url?: string;
}

export interface ProfileData {
  readonly title: string;
  readonly bio: string;
  readonly bioHtml?: string;
  readonly socialLinks?: readonly SocialLinkItem[];
  // Legacy fields for backward compatibility
  readonly x?: LegacySocialPlatform;
  readonly instagram?: LegacySocialPlatform;
  readonly youtube?: LegacySocialPlatform;
  readonly facebook?: LegacySocialPlatform;
  readonly github?: LegacySocialPlatform;
  readonly linkedin?: LegacySocialPlatform;
  readonly customLinks?: readonly { name: string; url: string; enabled?: boolean }[];
}

export interface ActiveSocialLink {
  readonly name: string;
  readonly url: string;
  readonly platform: 'x' | 'instagram' | 'youtube' | 'facebook' | 'github' | 'linkedin' | 'custom';
}

const DEFAULT_PROFILE: ProfileData = {
  title: 'Hakkımda',
  bio: 'Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.\n\nBurası internetin telaşından uzakta, kendi kendime düşündüğüm şeyleri not etmek için oluşturduğum sade bir köşe.',
  socialLinks: [],
};

const PROFILE_FILE_PATH = path.join(process.cwd(), 'src', 'content', 'profil.json');

const DEFAULT_PLATFORM_NAMES: Record<string, string> = {
  x: 'X (Twitter)',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  custom: 'Web',
};

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
      socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : [],
      x: parsed.x,
      instagram: parsed.instagram,
      youtube: parsed.youtube,
      facebook: parsed.facebook,
      github: parsed.github,
      linkedin: parsed.linkedin,
      customLinks: Array.isArray(parsed.customLinks) ? parsed.customLinks : [],
    };
  } catch (error) {
    console.error('Failed to read profil.json:', error);
    return DEFAULT_PROFILE;
  }
}

/**
 * Normalizes platform string to a known platform type.
 */
function normalizePlatform(platform: string): ActiveSocialLink['platform'] {
  const p = platform.toLowerCase().trim();
  if (['x', 'twitter'].includes(p)) return 'x';
  if (['instagram', 'ig'].includes(p)) return 'instagram';
  if (['youtube', 'yt'].includes(p)) return 'youtube';
  if (['facebook', 'fb'].includes(p)) return 'facebook';
  if (['github', 'gh'].includes(p)) return 'github';
  if (['linkedin', 'in'].includes(p)) return 'linkedin';
  return 'custom';
}

/**
 * Returns only the active and valid social links from both new socialLinks list and legacy fields.
 */
export function getActiveSocialLinks(profile: ProfileData): ActiveSocialLink[] {
  const active: ActiveSocialLink[] = [];
  const addedUrls = new Set<string>();

  // 1. Process new compact socialLinks array
  if (Array.isArray(profile.socialLinks)) {
    profile.socialLinks.forEach((item) => {
      if (item && item.enabled && item.url && item.url.trim().length > 0) {
        const trimmedUrl = item.url.trim();
        if (!addedUrls.has(trimmedUrl)) {
          addedUrls.add(trimmedUrl);
          const platform = normalizePlatform(item.platform || 'custom');
          const name = item.name?.trim() || DEFAULT_PLATFORM_NAMES[platform] || 'Bağlantı';
          active.push({
            platform,
            name,
            url: trimmedUrl,
          });
        }
      }
    });
  }

  // 2. Fallback to legacy object keys if present and not already added
  const checkLegacy = (
    platform: 'x' | 'instagram' | 'youtube' | 'facebook' | 'github' | 'linkedin',
    defaultName: string,
    data?: LegacySocialPlatform
  ) => {
    if (data?.enabled && data.url && data.url.trim().length > 0) {
      const trimmedUrl = data.url.trim();
      if (!addedUrls.has(trimmedUrl)) {
        addedUrls.add(trimmedUrl);
        active.push({
          platform,
          name: defaultName,
          url: trimmedUrl,
        });
      }
    }
  };

  checkLegacy('x', 'X (Twitter)', profile.x);
  checkLegacy('instagram', 'Instagram', profile.instagram);
  checkLegacy('youtube', 'YouTube', profile.youtube);
  checkLegacy('facebook', 'Facebook', profile.facebook);
  checkLegacy('github', 'GitHub', profile.github);
  checkLegacy('linkedin', 'LinkedIn', profile.linkedin);

  if (Array.isArray(profile.customLinks)) {
    profile.customLinks.forEach((item) => {
      if (item.enabled && item.url && item.url.trim().length > 0) {
        const trimmedUrl = item.url.trim();
        if (!addedUrls.has(trimmedUrl)) {
          addedUrls.add(trimmedUrl);
          active.push({
            platform: 'custom',
            name: item.name?.trim() || 'Bağlantı',
            url: trimmedUrl,
          });
        }
      }
    });
  }

  return active;
}
