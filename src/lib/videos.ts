import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { VideoItemSchema, type VideoItem } from './schemas';
import { formatThoughtDate } from './thoughts';

const VIDEOS_DIRECTORY = path.join(process.cwd(), 'videolar');

/**
 * Extracts a 11-character YouTube video ID from any standard URL or raw string.
 * Supports youtu.be, youtube.com/watch?v=, youtube.com/embed/, youtube.com/shorts/, or raw ID.
 */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();

  // If already clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex extraction
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  return match ? match[1]! : trimmed;
}

function ensureDirectoryExists() {
  if (!fs.existsSync(VIDEOS_DIRECTORY)) {
    fs.mkdirSync(VIDEOS_DIRECTORY, { recursive: true });
  }
}

/**
 * Retrieves all videos from the videolar directory.
 * If empty or directory does not exist, safely returns empty array [].
 */
export async function getAllVideos(): Promise<VideoItem[]> {
  try {
    ensureDirectoryExists();

    const fileNames = fs.readdirSync(VIDEOS_DIRECTORY);
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

    if (markdownFiles.length === 0) {
      return [];
    }

    marked.use({ gfm: true, breaks: true });

    const items: VideoItem[] = await Promise.all(
      markdownFiles.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(VIDEOS_DIRECTORY, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);
        const htmlContent = content ? await marked.parse(content) : '';
        const youtubeId = extractYouTubeId(String(data.youtubeId || ''));
        const formattedDate = data.date ? formatThoughtDate(String(data.date)) : 'Bugün';

        const parsed = VideoItemSchema.safeParse({
          ...data,
          slug,
          youtubeId,
          formattedDate,
          content,
          htmlContent,
        });

        if (parsed.success) {
          return parsed.data;
        }

        console.warn(`Video item ${slug} validation warning:`, parsed.error);
        return {
          slug,
          title: String(data.title || slug),
          youtubeId,
          duration: String(data.duration || ''),
          category: String(data.category || ''),
          formattedDate,
          description: String(data.description || ''),
          isUnlisted: Boolean(data.isUnlisted),
          quality: String(data.quality || ''),
          content,
          htmlContent,
        };
      })
    );

    return items;
  } catch (error) {
    console.error('Failed to read videos:', error);
    return [];
  }
}

export async function getVideoBySlug(slug: string): Promise<VideoItem | null> {
  const items = await getAllVideos();
  return items.find((item) => item.slug === slug) || null;
}
