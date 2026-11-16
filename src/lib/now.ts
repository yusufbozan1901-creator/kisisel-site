import fs from 'fs';
import path from 'path';
import { NowStateSchema, type NowState } from './schemas';

const NOW_FILE_PATH = path.join(process.cwd(), 'src', 'content', 'now.json');

const DEFAULT_NOW: NowState = {
  focus: {
    title: 'Monolith & Dijital Bahçe',
    description: 'Minimalist tipografi, editoryal web estetiği ve sakin yazılım mimarileri üzerine çalışmalar.',
    status: 'Aktif Geliştirme',
    updatedAt: 'Bugün',
  },
  shelf: {
    itemTitle: 'Severance (2. Sezon)',
    itemType: 'Dizi',
    itemMeta: 'S02 • B04',
    subItemTitle: 'Görme Biçimleri — J. Berger',
    subItemType: 'Kitap',
    subItemMeta: 's. 84 / 176',
    status: 'Takip Ediliyor',
  },
  thought: {
    quote: 'Sadelik, azın fazlalığı değil; gereksizin yokluğudur.',
    context: 'Tipografik ritim ve arayüzde bilişsel yük üzerine notlar.',
    label: 'Son Not',
    date: '16 Kasım',
  },
};

/**
 * Safely reads and validates the "Şu Sıralar" (Now) state from now.json with Zod.
 * Never throws or breaks build if the file is missing or invalid.
 */
export async function getNowData(): Promise<NowState> {
  try {
    if (!fs.existsSync(NOW_FILE_PATH)) {
      return DEFAULT_NOW;
    }

    const raw = fs.readFileSync(NOW_FILE_PATH, 'utf8');
    if (!raw.trim()) {
      return DEFAULT_NOW;
    }

    const parsedJson = JSON.parse(raw);
    const validated = NowStateSchema.safeParse(parsedJson);

    if (validated.success) {
      return validated.data;
    }

    console.warn('now.json Zod validation warning, using fallback defaults:', validated.error);
    return DEFAULT_NOW;
  } catch (error) {
    console.error('Failed to read now.json:', error);
    return DEFAULT_NOW;
  }
}
