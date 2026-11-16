import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { ShelfItemSchema, type ShelfItem } from './schemas';

const SHELF_DIRECTORY = path.join(process.cwd(), 'raf');

function ensureDirectoryExists() {
  if (!fs.existsSync(SHELF_DIRECTORY)) {
    fs.mkdirSync(SHELF_DIRECTORY, { recursive: true });
  }
}

/**
 * Retrieves all items from the raf directory.
 * If empty or directory does not exist, safely returns empty array [].
 */
export async function getAllShelfItems(): Promise<ShelfItem[]> {
  try {
    ensureDirectoryExists();

    const fileNames = fs.readdirSync(SHELF_DIRECTORY);
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

    if (markdownFiles.length === 0) {
      return [];
    }

    marked.use({ gfm: true, breaks: true });

    const items: ShelfItem[] = await Promise.all(
      markdownFiles.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(SHELF_DIRECTORY, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);
        const htmlContent = content ? await marked.parse(content) : '';
        const badge = String(data.details?.badge || data.badge || '').trim();
        const progress = String(data.details?.progress || data.progress || '').trim();

        const parsed = ShelfItemSchema.safeParse({
          ...data,
          badge,
          progress,
          slug,
          content,
          htmlContent,
        });

        if (parsed.success) {
          return {
            ...parsed.data,
            badge: parsed.data.details?.badge || parsed.data.badge || badge,
            progress: parsed.data.details?.progress || parsed.data.progress || progress,
          };
        }

        console.warn(`Shelf item ${slug} validation warning:`, parsed.error);
        return {
          slug,
          title: String(data.title || slug),
          type: 'series' as const,
          category: 'Genel',
          rating: '★ 9.0',
          status: 'watching' as const,
          badge,
          poster: '',
          description: String(data.description || ''),
          year: '2026',
          progress,
          updatedAt: 'Bugün',
          content,
          htmlContent,
        };
      })
    );

    return items;
  } catch (error) {
    console.error('Failed to read shelf items:', error);
    return [];
  }
}

export async function getShelfItemBySlug(slug: string): Promise<ShelfItem | null> {
  const items = await getAllShelfItems();
  return items.find((item) => item.slug === slug) || null;
}
