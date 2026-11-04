import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIRECTORY = path.join(process.cwd(), 'yazilar');

export interface Post {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly publishedAt: string;
  readonly readingTime: string;
  readonly tags: readonly string[];
  readonly content: string;
  readonly htmlContent?: string;
}

/**
 * Calculates estimated reading time in Turkish.
 */
function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
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

    const publishedAt = data.date ? String(data.date) : new Date().toISOString().split('T')[0]!;
    const readingTime = data.readingTime ? String(data.readingTime) : calculateReadingTime(content);
    const tags = Array.isArray(data.tags) ? data.tags : [];

    return {
      slug,
      title: String(data.title || slug),
      description: String(data.description || ''),
      publishedAt,
      readingTime,
      tags,
      content,
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

  const publishedAt = data.date ? String(data.date) : new Date().toISOString().split('T')[0]!;
  const readingTime = data.readingTime ? String(data.readingTime) : calculateReadingTime(content);
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    slug,
    title: String(data.title || slug),
    description: String(data.description || ''),
    publishedAt,
    readingTime,
    tags,
    content,
    htmlContent,
  };
}
