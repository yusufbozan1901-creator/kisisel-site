export type ThemeMode = 'light' | 'dark' | 'system';

export interface NavItem {
  readonly title: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface SocialLink {
  readonly name: string;
  readonly href: string;
  readonly icon: string;
}

export interface BlogPostMeta {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly tags: readonly string[];
  readonly coverImage?: string;
  readonly audio?: string;
}

export interface ThoughtMeta {
  readonly slug: string;
  readonly date: string;
  readonly content: string;
  readonly image?: string;
  readonly audio?: string;
}

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  readonly website?: string;
}
