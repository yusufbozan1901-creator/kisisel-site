import { describe, it, expect } from 'vitest';
import { extractYouTubeId } from '../videos';

describe('extractYouTubeId', () => {
  const EXPECTED_ID = 'dQw4w9WgXcQ';

  it('handles clean 11-character video IDs directly', () => {
    expect(extractYouTubeId(EXPECTED_ID)).toBe(EXPECTED_ID);
    expect(extractYouTubeId('  dQw4w9WgXcQ  ')).toBe(EXPECTED_ID);
    expect(extractYouTubeId('abc-_123XYZ')).toBe('abc-_123XYZ');
  });

  it('extracts ID from standard youtube.com/watch?v= URLs', () => {
    expect(extractYouTubeId(`https://www.youtube.com/watch?v=${EXPECTED_ID}`)).toBe(EXPECTED_ID);
    expect(extractYouTubeId(`http://youtube.com/watch?v=${EXPECTED_ID}`)).toBe(EXPECTED_ID);
    expect(extractYouTubeId(`https://www.youtube.com/watch?feature=shared&v=${EXPECTED_ID}&t=10s`)).toBe(EXPECTED_ID);
  });

  it('extracts ID from short youtu.be/ URLs', () => {
    expect(extractYouTubeId(`https://youtu.be/${EXPECTED_ID}`)).toBe(EXPECTED_ID);
    expect(extractYouTubeId(`http://youtu.be/${EXPECTED_ID}?t=42`)).toBe(EXPECTED_ID);
  });

  it('extracts ID from YouTube Shorts and Embed URLs', () => {
    expect(extractYouTubeId(`https://www.youtube.com/shorts/${EXPECTED_ID}`)).toBe(EXPECTED_ID);
    expect(extractYouTubeId(`https://www.youtube.com/embed/${EXPECTED_ID}`)).toBe(EXPECTED_ID);
  });

  it('safely handles empty, whitespace, or invalid inputs', () => {
    expect(extractYouTubeId('')).toBe('');
    expect(extractYouTubeId('   ')).toBe('');
    expect(extractYouTubeId('not-a-youtube-url')).toBe('not-a-youtube-url');
  });
});
