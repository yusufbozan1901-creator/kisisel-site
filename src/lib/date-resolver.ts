import fs from 'fs';
import { execSync } from 'child_process';

/**
 * Retrieves the Git commit ISO timestamp for a file, or falls back to filesystem creation/modification time.
 */
function getFileTimestamp(filePath: string): Date | null {
  try {
    const gitOutput = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    if (gitOutput) {
      const gitDate = new Date(gitOutput);
      if (!isNaN(gitDate.getTime())) {
        return gitDate;
      }
    }
  } catch {
    // Git log failed or repository unavailable
  }

  try {
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.birthtime && stat.birthtime.getTime() > 0) {
        return stat.birthtime;
      }
      if (stat.mtime && stat.mtime.getTime() > 0) {
        return stat.mtime;
      }
    }
  } catch {
    // Filesystem stat failed
  }

  return null;
}

/**
 * Formats a Date object to Turkey time HH:mm:ss string.
 */
function getTurkeyTimeString(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

/**
 * Formats a Date object to Turkey date YYYY-MM-DD string.
 */
function getTurkeyDateString(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Resolves a date string or Date object from frontmatter into an ISO string with Turkey timezone (+03:00).
 * If the frontmatter has no time or has midnight ("00:00"), it automatically resolves
 * the real creation/commit time from Git or filesystem in Turkey timezone (Europe/Istanbul).
 */
export function resolveTurkeyTimestamp(rawDate: unknown, filePath: string): string {
  let datePart: string | null = null;
  let hasValidTime = false;
  let timePart: string | null = null;

  if (rawDate instanceof Date) {
    // YAML unquoted dates (e.g., date: 2026-11-05) are parsed into Date objects at 00:00:00 UTC
    const isMidnight = rawDate.getUTCHours() === 0 && rawDate.getUTCMinutes() === 0 && rawDate.getUTCSeconds() === 0;
    datePart = `${rawDate.getUTCFullYear()}-${String(rawDate.getUTCMonth() + 1).padStart(2, '0')}-${String(rawDate.getUTCDate()).padStart(2, '0')}`;
    if (!isMidnight) {
      hasValidTime = true;
      timePart = getTurkeyTimeString(rawDate);
    }
  } else if (typeof rawDate === 'string' && rawDate.trim().length > 0) {
    const trimmed = rawDate.trim();
    const dateOnlyMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})$/);
    if (dateOnlyMatch) {
      datePart = dateOnlyMatch[1]!;
      hasValidTime = false;
    } else {
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        const hasExplicitMidnight = /T00:00(:00)?(\.000)?(Z|\+00:00)?$/.test(trimmed) || /\s00:00(:00)?$/.test(trimmed);
        if (!hasExplicitMidnight) {
          hasValidTime = true;
          datePart = getTurkeyDateString(parsed);
          timePart = getTurkeyTimeString(parsed);
        } else {
          datePart = getTurkeyDateString(parsed);
          hasValidTime = false;
        }
      }
    }
  }

  // If time was missing or explicitly 00:00, retrieve real commit/file creation time in Turkey timezone
  if (!hasValidTime || !timePart) {
    const fileTime = getFileTimestamp(filePath);
    if (fileTime) {
      if (!datePart) {
        datePart = getTurkeyDateString(fileTime);
      }
      timePart = getTurkeyTimeString(fileTime);
    } else {
      const now = new Date();
      if (!datePart) {
        datePart = getTurkeyDateString(now);
      }
      timePart = getTurkeyTimeString(now);
    }
  }

  return `${datePart}T${timePart}+03:00`;
}
