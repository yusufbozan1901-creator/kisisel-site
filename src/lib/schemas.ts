import { z } from 'zod';

/**
 * Zod schema for Blog Post frontmatter and metadata.
 * Uses safe defaults to prevent SSG build crashes on missing optional fields.
 */
export const PostFrontmatterSchema = z.object({
  title: z.string().trim().min(1).default('İsimsiz Yazı'),
  date: z.union([z.string(), z.date()]).optional(),
  summary: z.string().trim().optional().default(''),
  description: z.string().trim().optional(),
  tags: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => str.split(',').map((s) => s.trim()).filter(Boolean)),
    ])
    .optional()
    .default([]),
  image: z.string().trim().optional(),
  audio: z.string().trim().optional(),
  readingTime: z.string().trim().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

/**
 * Zod schema for Akış (Timeline / Micro-notes) frontmatter.
 */
export const ThoughtFrontmatterSchema = z.object({
  title: z.string().trim().optional(),
  date: z.union([z.string(), z.date()]).optional(),
  image: z.string().trim().optional(),
  audio: z.string().trim().optional(),
  season: z.union([z.string(), z.number()]).transform(String).optional(),
  episode: z.union([z.string(), z.number()]).transform(String).optional(),
  rating: z.union([z.string(), z.number()]).transform(String).optional(),
  tags: z
    .union([
      z.array(z.string()),
      z.string().transform((str) => str.split(',').map((s) => s.trim()).filter(Boolean)),
    ])
    .optional()
    .default([]),
  type: z.enum(['all', 'audio', 'code', 'quote', 'note']).optional().default('note'),
});

export type ThoughtFrontmatter = z.infer<typeof ThoughtFrontmatterSchema>;

/**
 * Zod schema for "Şu Sıralar" (Now) Bento Card state.
 */
export const NowStateSchema = z.object({
  focus: z.object({
    title: z.string().trim().default('Monolith & Dijital Bahçe'),
    description: z.string().trim().default('Minimalist tipografi ve sakin yazılım mimarileri.'),
    status: z.string().trim().default('Aktif Geliştirme'),
    updatedAt: z.string().trim().default('Bugün'),
  }).default({
    title: 'Monolith & Dijital Bahçe',
    description: 'Minimalist tipografi ve sakin yazılım mimarileri.',
    status: 'Aktif Geliştirme',
    updatedAt: 'Bugün',
  }),
  shelf: z.object({
    itemTitle: z.string().trim().default('Severance (2. Sezon)'),
    itemType: z.string().trim().default('Dizi'),
    itemMeta: z.string().trim().default('S02 • B04'),
    subItemTitle: z.string().trim().optional().default(''),
    subItemType: z.string().trim().optional().default(''),
    subItemMeta: z.string().trim().optional().default(''),
    status: z.string().trim().default('Takip Ediliyor'),
  }).default({
    itemTitle: 'Severance (2. Sezon)',
    itemType: 'Dizi',
    itemMeta: 'S02 • B04',
    subItemTitle: 'Görme Biçimleri — J. Berger',
    subItemType: 'Kitap',
    subItemMeta: 's. 84 / 176',
    status: 'Takip Ediliyor',
  }),
  thought: z.object({
    quote: z.string().trim().default('Sadelik, azın fazlalığı değil; gereksizin yokluğudur.'),
    context: z.string().trim().default('Tipografik ritim ve arayüzde bilişsel yük üzerine notlar.'),
    label: z.string().trim().default('Mikro-Not Defteri'),
    date: z.string().trim().default('Bugün'),
  }).default({
    quote: 'Sadelik, azın fazlalığı değil; gereksizin yokluğudur.',
    context: 'Tipografik ritim ve arayüzde bilişsel yük üzerine notlar.',
    label: 'Mikro-Not Defteri',
    date: 'Bugün',
  }),
});

export type NowState = z.infer<typeof NowStateSchema>;

/**
 * Zod schema for Rafım (Culture Shelf: Movies, Series, Books)
 */
export const ShelfItemSchema = z.object({
  slug: z.string().default(''),
  title: z.string().trim().min(1).default('İsimsiz Eser'),
  type: z
    .string()
    .transform((val) => {
      const lower = val.toLowerCase().trim();
      if (lower.includes('film') || lower === 'movie') return 'movie';
      if (lower.includes('kitap') || lower === 'book') return 'book';
      return 'series';
    })
    .default('series'),
  category: z.string().trim().default('Genel'),
  rating: z.string().trim().default('★ 9.0'),
  status: z
    .string()
    .transform((val) => {
      const lower = val.toLowerCase().trim();
      if (lower.includes('tamam') || lower === 'completed') return 'completed';
      if (lower.includes('okun') || lower === 'reading') return 'reading';
      if (lower.includes('bas') || lower.includes('başyapıt') || lower === 'masterpiece') return 'masterpiece';
      return 'watching';
    })
    .default('watching'),
  badge: z.string().trim().optional().default(''),
  poster: z.string().trim().optional().default(''),
  description: z.string().trim().default(''),
  year: z.union([z.string(), z.number()]).transform(String).optional().default('2026'),
  progress: z.string().trim().optional().default(''),
  updatedAt: z.string().trim().default('Bugün'),
  content: z.string().default(''),
  htmlContent: z.string().default(''),
});

export type ShelfItem = z.infer<typeof ShelfItemSchema>;

/**
 * Zod schema for Videolar (Unlisted / Personal Archive)
 */
export const VideoItemSchema = z.object({
  slug: z.string().default(''),
  title: z.string().trim().min(1).default('İsimsiz Kayıt'),
  youtubeId: z.string().trim().default(''),
  duration: z.string().trim().default('10:00'),
  category: z.string().trim().default('Ekran Kaydı'),
  date: z.union([z.string(), z.date()]).optional(),
  formattedDate: z.string().default('Bugün'),
  description: z.string().trim().default(''),
  isUnlisted: z.boolean().default(true),
  quality: z.string().trim().default('1080p 60fps'),
  content: z.string().default(''),
  htmlContent: z.string().default(''),
});

export type VideoItem = z.infer<typeof VideoItemSchema>;

/**
 * Zod schema for Profile & Social settings
 */
export const ProfileSchema = z.object({
  title: z.string().trim().default('Hakkımda'),
  avatar: z.string().trim().optional().default(''),
  bio: z.string().default(''),
  social: z
    .object({
      twitter: z.union([z.object({ active: z.boolean().optional(), url: z.string().optional() }), z.string()]).optional(),
      instagram: z.union([z.object({ active: z.boolean().optional(), url: z.string().optional() }), z.string()]).optional(),
      youtube: z.union([z.object({ active: z.boolean().optional(), url: z.string().optional() }), z.string()]).optional(),
      facebook: z.union([z.object({ active: z.boolean().optional(), url: z.string().optional() }), z.string()]).optional(),
      github: z.union([z.object({ active: z.boolean().optional(), url: z.string().optional() }), z.string()]).optional(),
      linkedin: z.union([z.object({ active: z.boolean().optional(), url: z.string().optional() }), z.string()]).optional(),
    })
    .optional()
    .default({}),
  customLinks: z
    .array(
      z.object({
        title: z.string().optional(),
        url: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .optional()
    .default([]),
});

export type ValidatedProfile = z.infer<typeof ProfileSchema>;
