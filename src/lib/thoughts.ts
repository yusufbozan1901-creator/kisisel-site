import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { resolveTurkeyTimestamp } from './date-resolver';
import { ThoughtFrontmatterSchema, type ThoughtFrontmatter } from './schemas';

const AKIS_DIRECTORY = path.join(process.cwd(), 'akis');

export interface Thought {
  readonly slug: string;
  readonly date: string;
  readonly formattedDate: string;
  readonly content: string;
  readonly htmlContent: string;
  readonly title?: string;
  readonly image?: string;
  readonly audio?: string;
  readonly season?: string;
  readonly episode?: string;
  readonly rating?: string;
  readonly tags?: readonly string[];
  readonly type?: 'all' | 'audio' | 'code' | 'quote' | 'note';
}

/**
 * Formats date/datetime to a clean Turkish string in Europe/Istanbul timezone.
 * e.g., "5 Kasım 2026 • 20:30" or "5 Kasım 2026"
 */
export function formatThoughtDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return dateString;
    }

    const hasTime = dateString.includes('T') || dateString.includes(':');

    const dateFormatted = new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Istanbul',
    }).format(d);

    if (hasTime) {
      const timeFormatted = new Intl.DateTimeFormat('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Istanbul',
      }).format(d);

      // Do not display midnight as an explicit time
      if (timeFormatted !== '00:00') {
        return `${dateFormatted} • ${timeFormatted}`;
      }
    }

    return dateFormatted;
  } catch {
    return dateString;
  }
}

/**
 * Ensures the akis directory exists.
 */
function ensureDirectoryExists() {
  if (!fs.existsSync(AKIS_DIRECTORY)) {
    fs.mkdirSync(AKIS_DIRECTORY, { recursive: true });
  }
}

/**
 * Retrieves all thoughts from the akis directory sorted by date descending.
 */
export async function getAllThoughts(): Promise<Thought[]> {
  try {
    ensureDirectoryExists();

    const fileNames = fs.readdirSync(AKIS_DIRECTORY);
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

    marked.use({
      gfm: true,
      breaks: true,
    });

    const thoughts: Thought[] = await Promise.all(
      markdownFiles.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(AKIS_DIRECTORY, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);
        const parsed = ThoughtFrontmatterSchema.safeParse(data);
        const valid: Partial<ThoughtFrontmatter> = parsed.success ? parsed.data : {};

        const date = resolveTurkeyTimestamp(data.date, fullPath);
        const formattedDate = formatThoughtDate(date);
        const htmlContent = await marked.parse(content);

        // Infer type if not specified in frontmatter
        let inferredType: 'all' | 'audio' | 'code' | 'quote' | 'note' = valid.type || 'note';
        if (!valid.type || valid.type === 'note') {
          if (valid.audio) {
            inferredType = 'audio';
          } else if (content.includes('```') || content.includes('<code>')) {
            inferredType = 'code';
          } else if (content.trim().startsWith('>') || content.includes('“') || content.includes('”')) {
            inferredType = 'quote';
          }
        }

        // Extract inline #tags if no explicit tags exist
        const explicitTags = Array.isArray(valid.tags) ? valid.tags : [];
        const inlineTags = (content.match(/#([\w\u00C0-\u017F-]+)/g) || []).map((t) => t.replace('#', ''));
        const mergedTags = Array.from(new Set([...explicitTags, ...inlineTags]));

        const season =
          valid.mediaDetails?.season?.trim() ||
          valid.season?.trim() ||
          undefined;
        const episode =
          valid.mediaDetails?.episode?.trim() ||
          valid.episode?.trim() ||
          undefined;
        const rating =
          valid.mediaDetails?.rating?.trim() ||
          valid.rating?.trim() ||
          undefined;

        return {
          slug,
          date,
          formattedDate,
          content,
          htmlContent,
          title: valid.title || undefined,
          image: valid.image || undefined,
          audio: valid.audio || undefined,
          season,
          episode,
          rating,
          tags: mergedTags,
          type: inferredType,
        };
      })
    );

    return thoughts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to read thoughts from akis:', error);
    return [];
  }
}
