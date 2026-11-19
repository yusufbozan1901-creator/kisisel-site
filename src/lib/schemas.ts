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
  mediaDetails: z
    .object({
      season: z.union([z.string(), z.number()]).transform(String).optional(),
      episode: z.union([z.string(), z.number()]).transform(String).optional(),
      rating: z.union([z.string(), z.number()]).transform(String).optional(),
    })
    .optional(),
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
    title: z.string().trim().default(''),
    description: z.string().trim().default(''),
    status: z.string().trim().default(''),
    updatedAt: z.string().trim().default(''),
  }).default({
    title: '',
    description: '',
    status: '',
    updatedAt: '',
  }),
  shelf: z.object({
    itemTitle: z.string().trim().default(''),
    itemType: z.string().trim().default(''),
    itemMeta: z.string().trim().default(''),
    status: z.string().trim().default(''),
    secondaryTitle: z.string().trim().optional().default(''),
    secondaryType: z.string().trim().optional().default(''),
    secondaryMeta: z.string().trim().optional().default(''),
    secondaryStatus: z.string().trim().optional().default(''),
    subItemTitle: z.string().trim().optional().default(''),
    subItemType: z.string().trim().optional().default(''),
    subItemMeta: z.string().trim().optional().default(''),
    subItemStatus: z.string().trim().optional().default(''),
  }).default({
    itemTitle: '',
    itemType: '',
    itemMeta: '',
    status: '',
    secondaryTitle: '',
    secondaryType: '',
    secondaryMeta: '',
    secondaryStatus: '',
    subItemTitle: '',
    subItemType: '',
    subItemMeta: '',
    subItemStatus: '',
  }),
  thought: z.object({
    quote: z.string().trim().default(''),
    context: z.string().trim().default(''),
    label: z.string().trim().default(''),
    thoughtDate: z.string().trim().optional().default(''),
    date: z.string().trim().optional().default(''),
  }).default({
    quote: '',
    context: '',
    label: '',
    thoughtDate: '',
    date: '',
  }),
});

export type NowState = z.infer<typeof NowStateSchema>;

/**
 * Zod schema for Rafım (Culture Shelf: Movies, Series, Books)
 */
export const ShelfItemSchema = z.object({
  slug: z.string().min(1, 'Slug zorunludur'),
  title: z.string().trim().min(1, 'Eser başlığı zorunludur'),
  type: z
    .string()
    .trim()
    .min(1, 'Eser türü zorunludur')
    .transform((val) => {
      const lower = val.toLowerCase().trim();
      if (lower.includes('film') || lower === 'movie') return 'movie';
      if (lower.includes('kitap') || lower === 'book') return 'book';
      if (lower.includes('dizi') || lower === 'series') return 'series';
      return 'invalid_type';
    })
    .pipe(z.enum(['movie', 'series', 'book'])),
  category: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => {
      if (Array.isArray(val)) return val.filter(Boolean).join(', ');
      return val.trim() || 'Genel';
    })
    .optional()
    .default('Genel'),
  rating: z.string().trim().optional().default(''),
  status: z
    .string()
    .trim()
    .min(1, 'Eser durumu zorunludur')
    .transform((val) => {
      const lower = val.toLowerCase().trim();
      if (lower.includes('tamam') || lower === 'completed') return 'completed';
      if (lower.includes('okun') || lower === 'reading') return 'reading';
      if (lower.includes('bas') || lower.includes('başyapıt') || lower === 'masterpiece') return 'masterpiece';
      if (lower.includes('izle') || lower === 'watching') return 'watching';
      return 'invalid_status';
    })
    .pipe(z.enum(['completed', 'reading', 'masterpiece', 'watching'])),
  badge: z.string().trim().optional().default(''),
  progress: z.string().trim().optional().default(''),
  details: z
    .object({
      badge: z.string().trim().optional().default(''),
      progress: z.string().trim().optional().default(''),
    })
    .optional(),
  poster: z.string().trim().optional().default(''),
  description: z.string().trim().default(''),
  year: z.union([z.string(), z.number()]).transform(String).optional().default('2026'),
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
  duration: z.string().trim().optional().default(''),
  category: z.string().trim().optional().default(''),
  date: z.union([z.string(), z.date()]).optional(),
  formattedDate: z.string().default('Bugün'),
  description: z.string().trim().default(''),
  isUnlisted: z.boolean().optional().default(false),
  quality: z.string().trim().optional().default(''),
  content: z.string().default(''),
  htmlContent: z.string().default(''),
});

export type VideoItem = z.infer<typeof VideoItemSchema>;

/**
 * Zod schema for Profile & Social settings
 */
export const ProfileSchema = z.object({
  heroTitle: z.string().trim().optional().default('Dijital bahçem ve kişisel arşivim.'),
  heroDescription: z
    .string()
    .trim()
    .optional()
    .default(
      'Burası internetin telaşından ve gürültüsünden uzakta; zihnimi toparlamak, editoryal notlar tutmak ve zamanla biriktirdiğim düşünce kırıntılarını paylaşmak için açtığım sakin bir köşe.'
    ),
  title: z.string().trim().default('Hakkımda'),
  location: z.string().trim().optional().default(''),
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
