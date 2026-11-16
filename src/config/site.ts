import type { NavItem, SocialLink } from '@/types';

export const SITE_CONFIG = {
  name: 'Yusuf Bozan',
  title: 'Yusuf Bozan | Kişisel Dijital Bahçe & Arşiv',
  description: 'Tasarım sistemleri, minimal yazılım mimarileri ve editoryal estetik üzerine çalışan bağımsız ürün tasarımcısı ve yazılımcı.',
  url: 'https://kisisel-site-cyan.vercel.app',
  author: 'Yusuf Bozan',
  ogImage: 'https://kisisel-site-cyan.vercel.app/og-image.png',
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
