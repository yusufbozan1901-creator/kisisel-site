import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export interface SocialPlatform {
  readonly enabled?: boolean;
  readonly url?: string;
}

export interface CustomLink {
  readonly name: string;
  readonly url: string;
  readonly enabled?: boolean;
}

export interface ProfileData {
  readonly title: string;
  readonly bio: string;
  readonly bioHtml?: string;
  readonly x?: SocialPlatform;
  readonly instagram?: SocialPlatform;
  readonly youtube?: SocialPlatform;
  readonly facebook?: SocialPlatform;
  readonly github?: SocialPlatform;
  readonly linkedin?: SocialPlatform;
  readonly customLinks?: readonly CustomLink[];
}

export interface ActiveSocialLink {
  readonly name: string;
  readonly url: string;
  readonly platform: 'x' | 'instagram' | 'youtube' | 'facebook' | 'github' | 'linkedin' | 'custom';
}

const DEFAULT_PROFILE: ProfileData = {
  title: 'Hakkımda',
  bio: 'Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.\n\nBurası internetin telaşından uzakta, kendi kendime düşündüğüm şeyleri not etmek için oluşturduğum sade bir köşe.',
  x: { enabled: false, url: '' },
  instagram: { enabled: false, url: '' },
  youtube: { enabled: false, url: '' },
  facebook: { enabled: false, url: '' },
  github: { enabled: false, url: '' },
  linkedin: { enabled: false, url: '' },
  customLinks: [],
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
      x: parsed.x || DEFAULT_PROFILE.x,
      instagram: parsed.instagram || DEFAULT_PROFILE.instagram,
      youtube: parsed.youtube || DEFAULT_PROFILE.youtube,
      facebook: parsed.facebook || DEFAULT_PROFILE.facebook,
      github: parsed.github || DEFAULT_PROFILE.github,
      linkedin: parsed.linkedin || DEFAULT_PROFILE.linkedin,
      customLinks: Array.isArray(parsed.customLinks) ? parsed.customLinks : [],
    };
  } catch (error) {
    console.error('Failed to read profil.json:', error);
    return DEFAULT_PROFILE;
  }
}

/**
 * Returns only the active and valid social links.
 */
export function getActiveSocialLinks(profile: ProfileData): ActiveSocialLink[] {
  const active: ActiveSocialLink[] = [];

  const checkPlatform = (
    platform: 'x' | 'instagram' | 'youtube' | 'facebook' | 'github' | 'linkedin',
    name: string,
    data?: SocialPlatform
  ) => {
    if (data?.enabled && data.url && data.url.trim().length > 0) {
      active.push({
        platform,
        name,
        url: data.url.trim(),
      });
    }
  };

  checkPlatform('x', 'X (Twitter)', profile.x);
  checkPlatform('instagram', 'Instagram', profile.instagram);
  checkPlatform('youtube', 'YouTube', profile.youtube);
  checkPlatform('facebook', 'Facebook', profile.facebook);
  checkPlatform('github', 'GitHub', profile.github);
  checkPlatform('linkedin', 'LinkedIn', profile.linkedin);

  if (Array.isArray(profile.customLinks)) {
    profile.customLinks.forEach((item) => {
      if (item.enabled && item.url && item.url.trim().length > 0 && item.name?.trim().length > 0) {
        active.push({
          platform: 'custom',
          name: item.name.trim(),
          url: item.url.trim(),
        });
      }
    });
  }

  return active;
}
