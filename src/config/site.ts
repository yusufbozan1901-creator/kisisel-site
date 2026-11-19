import type { NavItem, SocialLink } from '@/types';

export const SITE_CONFIG = {
  name: 'Yusuf Bozan',
  title: 'Yusuf Bozan | Kişisel Dijital Bahçe & Arşiv',
  // TODO: Yusuf Bozan tarafından güncellenecek
  description: 'Yusuf Bozan\'ın kişisel dijital bahçesi; yazılar, anlık düşünce akışı, kültürel tüketim arşivi ve görsel notlar.',
  url: 'https://yusufbozan.com.tr',
  author: 'Yusuf Bozan',
  ogImage: 'https://yusufbozan.com.tr/og-image.png',
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { title: 'Ana Sayfa', href: '/' },
  { title: 'Yazılar', href: '/blog' },
  { title: 'Akış', href: '/akis' },
  { title: 'Rafım', href: '/rafim' },
  { title: 'Videolar', href: '/videolar' },
  { title: 'Hakkımda', href: '/about' },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [] as const;
