import { describe, it, expect } from 'vitest';
import { turkishSlugify, parseMarkdownWithToc } from '../posts';

describe('turkishSlugify', () => {
  it('correctly converts Turkish special characters to ASCII equivalents', () => {
    expect(turkishSlugify('Çalışma, Gelişme ve Üretkenlik')).toBe('calisma-gelisme-ve-uretkenlik');
    expect(turkishSlugify('Örnek Şiirler ve İlhamlar')).toBe('ornek-siirler-ve-ilhamlar');
    expect(turkishSlugify('Ilık Bir Günde Ağaçların Altında')).toBe('ilik-bir-gunde-agaclarin-altinda');
  });

  it('strips punctuation, symbols and trims whitespace', () => {
    expect(turkishSlugify('  Merhaba Dünya! (2026)  ')).toBe('merhaba-dunya-2026');
    expect(turkishSlugify('React & Next.js: Hızlı Bir Giriş...')).toBe('react-nextjs-hizli-bir-giris');
    expect(turkishSlugify('---Özel---Karakterler---')).toBe('ozel-karakterler');
  });

  it('falls back to "baslik" if input is empty or contains only non-word characters', () => {
    expect(turkishSlugify('')).toBe('baslik');
    expect(turkishSlugify('    ')).toBe('baslik');
    expect(turkishSlugify('!@#$%^&*()')).toBe('baslik');
  });
});

describe('parseMarkdownWithToc duplicate heading handling', () => {
  it('assigns unique suffix (-1, -2) to duplicate headings in TOC and HTML', async () => {
    const markdown = `
## Giriş
İlk giriş metni.

## Örnekler
İlk örnekler.

## Giriş
İkinci giriş başlığı (tekrarlı).

## Giriş
Üçüncü giriş başlığı (tekrarlı).
`;

    const result = await parseMarkdownWithToc(markdown);

    expect(result.toc).toHaveLength(4);
    expect(result.toc[0]?.id).toBe('giris');
    expect(result.toc[1]?.id).toBe('ornekler');
    expect(result.toc[2]?.id).toBe('giris-1');
    expect(result.toc[3]?.id).toBe('giris-2');

    expect(result.html).toContain('id="giris"');
    expect(result.html).toContain('id="ornekler"');
    expect(result.html).toContain('id="giris-1"');
    expect(result.html).toContain('id="giris-2"');
  });

  it('captures both h2 and h3 headings with correct levels', async () => {
    const markdown = `
## Ana Bölüm
### Alt Bölüm 1
### Alt Bölüm 2
`;
    const result = await parseMarkdownWithToc(markdown);
    expect(result.toc).toEqual([
      { id: 'ana-bolum', text: 'Ana Bölüm', level: 2 },
      { id: 'alt-bolum-1', text: 'Alt Bölüm 1', level: 3 },
      { id: 'alt-bolum-2', text: 'Alt Bölüm 2', level: 3 },
    ]);
  });
});
