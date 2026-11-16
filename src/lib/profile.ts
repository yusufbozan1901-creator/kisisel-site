import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { ProfileSchema } from './schemas';

export interface SocialPlatformConfig {
  readonly active?: boolean;
  readonly url?: string;
}

export interface CustomSocialLink {
  readonly title?: string;
  readonly url?: string;
  readonly active?: boolean;
}

export interface SocialLinksObject {
  readonly twitter?: SocialPlatformConfig | string;
  readonly instagram?: SocialPlatformConfig | string;
  readonly youtube?: SocialPlatformConfig | string;
  readonly facebook?: SocialPlatformConfig | string;
  readonly github?: SocialPlatformConfig | string;
  readonly linkedin?: SocialPlatformConfig | string;
  readonly telegram?: SocialPlatformConfig | string;
  readonly [key: string]: SocialPlatformConfig | string | undefined;
}

export interface ActiveSocialLink {
  readonly name: string;
  readonly url: string;
  readonly platform: 'x' | 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'telegram' | 'github' | 'custom';
}

export interface ProfileData {
  readonly title: string;
  readonly location?: string;
  readonly avatar?: string;
  readonly bio: string;
  readonly bioHtml?: string;
  readonly social?: SocialLinksObject;
  readonly customLinks?: readonly CustomSocialLink[];
}

const DEFAULT_PROFILE: ProfileData = {
  title: 'Hakkımda',
  location: '',
  avatar: '',
  bio: 'Merhaba, ben Yusuf. Kişisel sayfama hoş geldiniz.\n\nBurası internetin bitmek bilmeyen telaşından ve gürültüsünden biraz olsun uzaklaşmak, zihnimi toparlamak ve zaman içinde biriktirdiğim notları sade bir düzende saklamak için açtığım kişisel bir alan.\n\nEski internetin o iddiasız ama samimi kişisel sayfalarını her zaman çok kıymetli buldum. Gösterişli unvanlar, algoritmaların peşinden koşan başlıklar ya da dikkat çekme yarışının olmadığı; insanların yalnızca merak ettikleri şeyleri kendi ritimlerinde yazdığı o dingin atmosferi burada da yaşatmaya çalışıyorum.\n\n### Bu Köşede Neler Var?\nHayatı biraz daha yalınlaştırma arayışı, teknolojinin düşüncelerimiz ve alışkanlıklarımız üzerindeki sessiz etkileri, okuduğum kitaplardan altını çizdiğim satırlar ve zaman zaman kaydettiğim ses notları... Kısacası kalıcı olmasını dilediğim düşünce kırıntıları.\n\n### Bir Not Bırakmak İsterseniz\nBuradaki yazılarla ilgili aklınıza takılan bir düşünceyi paylaşmak, bir kitap tavsiyesi vermek veya yalnızca selam iletmek isterseniz her zaman memnuniyetle okurum.',
  social: {
    twitter: { active: false, url: '' },
    instagram: { active: false, url: '' },
    youtube: { active: false, url: '' },
    facebook: { active: false, url: '' },
    github: { active: false, url: '' },
    linkedin: { active: false, url: '' },
  },
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

    const parsed = JSON.parse(raw);
    const validated = ProfileSchema.safeParse(parsed);
    const data = validated.success ? validated.data : (parsed as Partial<ProfileData>);

    const title = data.title?.trim() || DEFAULT_PROFILE.title;
    const location = (data as { location?: string }).location?.trim() || undefined;
    const avatar = data.avatar?.trim() || undefined;
    const bio = data.bio?.trim() || DEFAULT_PROFILE.bio;

    // Configure marked for safe HTML conversion of bio
    marked.use({ gfm: true, breaks: true });
    const bioHtml = await marked.parse(bio);

    return {
      title,
      location,
      avatar,
      bio,
      bioHtml,
      social: (data.social as SocialLinksObject) || DEFAULT_PROFILE.social,
      customLinks: (data.customLinks as CustomSocialLink[]) || [],
    };
  } catch (error) {
    console.error('Failed to read profil.json:', error);
    return DEFAULT_PROFILE;
  }
}

/**
 * Returns only the active social links whose toggle is enabled and URLs are non-empty strings.
 * Supports both predefined platforms and custom repeater links.
 */
export function getActiveSocialLinks(profile: ProfileData): ActiveSocialLink[] {
  const active: ActiveSocialLink[] = [];
  const addedUrls = new Set<string>();

  const addLink = (
    platform: ActiveSocialLink['platform'],
    name: string,
    config?: SocialPlatformConfig | string
  ) => {
    if (!config) return;

    let isEnabled = false;
    let url = '';

    if (typeof config === 'string') {
      url = config.trim();
      isEnabled = url.length > 0;
    } else if (typeof config === 'object') {
      isEnabled = config.active === true;
      url = (config.url || '').trim();
    }

    if (isEnabled && url.length > 0 && !addedUrls.has(url)) {
      addedUrls.add(url);
      active.push({
        platform,
        name,
        url,
      });
    }
  };

  // 1. Predefined standard platforms
  if (profile.social) {
    addLink('x', 'X (Twitter)', profile.social.twitter);
    addLink('instagram', 'Instagram', profile.social.instagram);
    addLink('youtube', 'YouTube', profile.social.youtube);
    addLink('facebook', 'Facebook', profile.social.facebook);
    addLink('github', 'GitHub', profile.social.github);
    addLink('linkedin', 'LinkedIn', profile.social.linkedin);
    addLink('telegram', 'Telegram', profile.social.telegram);
  }

  // 2. Custom repeater links
  if (Array.isArray(profile.customLinks)) {
    profile.customLinks.forEach((item) => {
      if (item && item.active === true && typeof item.url === 'string') {
        const url = item.url.trim();
        if (url.length > 0 && !addedUrls.has(url)) {
          addedUrls.add(url);
          active.push({
            platform: 'custom',
            name: item.title?.trim() || 'Bağlantı',
            url,
          });
        }
      }
    });
  }

  return active;
}
