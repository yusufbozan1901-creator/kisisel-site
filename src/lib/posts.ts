import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { resolveTurkeyTimestamp } from './date-resolver';

const POSTS_DIRECTORY = path.join(process.cwd(), 'yazilar');

export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly wordCount: number;
  readonly tags: readonly string[];
  readonly content: string;
  readonly htmlContent?: string;
  readonly audio?: string;
  readonly image?: string;
}

/**
 * Calculates word count from raw Markdown content.
 */
function getWordCount(content: string): number {
  return content.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Calculates estimated reading time in Turkish based on real word count.
 */
function calculateReadingTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} dk okuma`;
}

/**
 * Ensures the yazilar directory exists.
 */
function ensureDirectoryExists() {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    fs.mkdirSync(POSTS_DIRECTORY, { recursive: true });
  }
}

/**
 * Retrieves all markdown posts from the yazilar directory sorted by date.
 */
export function getAllPosts(): Post[] {
  ensureDirectoryExists();

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));

  const posts: Post[] = markdownFiles.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(POSTS_DIRECTORY, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    const wordCount = getWordCount(content);
    const publishedAt = resolveTurkeyTimestamp(data.date, fullPath);
    const readingTime = data.readingTime ? String(data.readingTime) : calculateReadingTime(wordCount);
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const audio = data.audio ? String(data.audio) : undefined;
    const image = data.image ? String(data.image) : undefined;

    return {
      slug,
      title: String(data.title || slug),
      description: String(data.summary || data.description || ''),
      publishedAt,
      readingTime,
      wordCount,
      tags,
      content,
      audio,
      image,
    };
  });

  // Sort posts by date descending
  return posts.sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
}

/**
 * Retrieves all post slugs for static generation.
 */
export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/**
 * Retrieves a single post by slug and compiles its markdown content to HTML.
 * Supports standard markdown images and HTML5 audio tags (<audio controls src="...">).
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensureDirectoryExists();
  const fullPath = path.join(POSTS_DIRECTORY, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Configure marked for GitHub Flavored Markdown and HTML support
  marked.use({
    gfm: true,
    breaks: true,
  });

  const htmlContent = await marked.parse(content);

  const wordCount = getWordCount(content);
  const publishedAt = resolveTurkeyTimestamp(data.date, fullPath);
  const readingTime = data.readingTime ? String(data.readingTime) : calculateReadingTime(wordCount);
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const audio = data.audio ? String(data.audio) : undefined;
  const image = data.image ? String(data.image) : undefined;

  return {
    slug,
    title: String(data.title || slug),
    description: String(data.summary || data.description || ''),
    publishedAt,
    readingTime,
    wordCount,
    tags,
    content,
    htmlContent,
    audio,
    image,
  };
}

/**
 * Returns adjacent (previous and next) posts relative to the given slug,
 * ordered chronologically (newest first).
 */
export function getAdjacentPosts(slug: string): {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  // Posts are sorted newest-first: index-1 is newer, index+1 is older
  const newer = index > 0 ? posts[index - 1]! : null;
  const older = index < posts.length - 1 ? posts[index + 1]! : null;

  return {
    previous: older ? { slug: older.slug, title: older.title } : null,
    next: newer ? { slug: newer.slug, title: newer.title } : null,
  };
}
