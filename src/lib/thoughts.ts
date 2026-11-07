import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { resolveTurkeyTimestamp } from './date-resolver';

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

        const date = resolveTurkeyTimestamp(data.date, fullPath);
        const formattedDate = formatThoughtDate(date);
        const htmlContent = await marked.parse(content);

        return {
          slug,
          date,
          formattedDate,
          content,
          htmlContent,
          title: data.title ? String(data.title) : undefined,
          image: data.image ? String(data.image) : undefined,
          audio: data.audio ? String(data.audio) : undefined,
          season: data.season !== undefined && data.season !== null && String(data.season).trim().length > 0
            ? String(data.season).trim()
            : undefined,
          episode: data.episode !== undefined && data.episode !== null && String(data.episode).trim().length > 0
            ? String(data.episode).trim()
            : undefined,
          rating: data.rating !== undefined && data.rating !== null && String(data.rating).trim().length > 0
            ? String(data.rating).trim()
            : undefined,
        };
      })
    );

    return thoughts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to read thoughts from akis:', error);
    return [];
  }
}
