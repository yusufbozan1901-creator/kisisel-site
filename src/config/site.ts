import type { NavItem, SocialLink } from '@/types';

export const SITE_CONFIG = {
  name: 'Yusuf Bozan',
  title: 'Yusuf Bozan | Kişisel Blog',
  description: 'Merhaba ben Yusuf kişisel sayfama hoş geldiniz. Teknoloji, sade yaşam ve düşünceler üzerine kişisel notlar.',
  url: 'https://yusufbozan.com',
  author: 'Yusuf Bozan',
  ogImage: '/og-image.png',
  // E-posta adresi gizlidir, arayüzde gösterilmez, yalnızca API backend tarafından kullanılır
  privateEmail: 'iletisim@yusufbozan.com',
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { title: 'Ana Sayfa', href: '/' },
  { title: 'Yazılarım', href: '/blog' },
  { title: 'Hakkımda', href: '/about' },
  { title: 'İletişim', href: '/contact' },
] as const;

export const SOCIAL_LINKS: readonly SocialLink[] = [] as const;
