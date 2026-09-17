import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { BoardSummary, BoardVariant, LanguageInfo, WakeWordInfo } from '../types';

const execFileAsync = promisify(execFile);

export class BoardDiscoveryService {
  private firmwareDir: string;
  private cachedVariants: BoardVariant[] | null = null;
  private cachedSummaries: BoardSummary[] | null = null;

  constructor() {
    this.firmwareDir = process.env.FIRMWARE_DIR || path.resolve(__dirname, '../../../firmware');
  }

  public getFirmwareDir(): string {
    return this.firmwareDir;
  }

  public async loadBoards(): Promise<BoardSummary[]> {
    if (this.cachedSummaries) {
      return this.cachedSummaries;
    }

    try {
      const buildScript = path.join(this.firmwareDir, 'scripts', 'build.py');
      if (fs.existsSync(buildScript)) {
        // Execute python scripts/build.py --list-boards --json
        const { stdout } = await execFileAsync('python', [buildScript, '--list-boards', '--json'], {
          cwd: this.firmwareDir,
          maxBuffer: 10 * 1024 * 1024,
        });

        // Filter out any warning lines preceding JSON
        const jsonStart = stdout.indexOf('[');
        if (jsonStart !== -1) {
          const jsonStr = stdout.substring(jsonStart).trim();
          const rawVariants: BoardVariant[] = JSON.parse(jsonStr);
          this.cachedVariants = rawVariants;
          this.cachedSummaries = this.transformToSummaries(rawVariants);
          return this.cachedSummaries;
        }
      }
    } catch (err) {
      console.warn('build.py --list-boards execution failed, falling back to filesystem parser:', err);
    }

    // Fallback: parse main/boards/**/config.json directly
    const variants = await this.parseBoardsFromFS();
    this.cachedVariants = variants;
    this.cachedSummaries = this.transformToSummaries(variants);
    return this.cachedSummaries;
  }

  public async getBoardById(id: string): Promise<BoardSummary | null> {
    const boards = await this.loadBoards();
    return boards.find((b) => b.id === id) || null;
  }

  public async getBoardByDirAndName(boardDir: string, variantName: string): Promise<BoardVariant | null> {
    if (!this.cachedVariants) {
      await this.loadBoards();
    }
    return (
      this.cachedVariants?.find((v) => v.board === boardDir && v.name === variantName) || null
    );
  }

  public getLanguages(): LanguageInfo[] {
    return [
      { code: 'en-US', label: 'English (United States)' },
      { code: 'zh-CN', label: '简体中文 (Simplified Chinese)' },
      { code: 'zh-TW', label: '繁體中文 (Traditional Chinese)' },
      { code: 'ja-JP', label: '日本語 (Japanese)' },
      { code: 'ko-KR', label: '한국어 (Korean)' },
      { code: 'es-ES', label: 'Español (Spanish)' },
      { code: 'fr-FR', label: 'Français (French)' },
      { code: 'de-DE', label: 'Deutsch (German)' },
      { code: 'it-IT', label: 'Italiano (Italian)' },
      { code: 'ru-RU', label: 'Русский (Russian)' },
      { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
      { code: 'pt-BR', label: 'Português (Brasil)' },
      { code: 'vi-VN', label: 'Tiếng Việt (Vietnamese)' },
      { code: 'th-TH', label: 'ไทย (Thai)' },
      { code: 'id-ID', label: 'Bahasa Indonesia' },
      { code: 'tr-TR', label: 'Türkçe (Turkish)' },
      { code: 'pl-PL', label: 'Polski (Polish)' },
      { code: 'nl-NL', label: 'Nederlands (Dutch)' },
      { code: 'ar-SA', label: 'العربية (Arabic)' },
      { code: 'he-IL', label: 'עברית (Hebrew)' },
    ];
  }

  public getWakeWords(target?: string): WakeWordInfo[] {
    const isLite = target === 'esp32c3' || target === 'esp32c5' || target === 'esp32c6';

    const words: WakeWordInfo[] = [
      {
        model: 'disabled',
        phrase: 'Wake Word Disabled',
        targets: ['esp32', 'esp32s3', 'esp32c3', 'esp32c5', 'esp32c6', 'esp32p4'],
      },
      {
        model: isLite ? 'wn9s_nihaoxiaozhi' : 'nihaoxiaozhi',
        phrase: 'Nihao Xiaozhi (你好小智)',
        targets: ['esp32', 'esp32s3', 'esp32c3', 'esp32c5', 'esp32c6', 'esp32p4'],
      },
      {
        model: isLite ? 'wn9s_hilexin' : 'wn9_hilexin',
        phrase: 'Hi LeXin / Hi ESP',
        targets: ['esp32', 'esp32s3', 'esp32c3', 'esp32c5', 'esp32c6', 'esp32p4'],
      },
      {
        model: 'wn9_jarvis_tts',
        phrase: 'Jarvis (FIRDAY Assistant)',
        targets: ['esp32s3', 'esp32p4', 'esp32'],
      },
      {
        model: 'wn9_alexa_tts',
        phrase: 'Alexa',
        targets: ['esp32s3', 'esp32p4', 'esp32'],
      },
    ];

    if (!target) return words;
    return words.filter((w) => w.targets.includes(target));
  }

  private transformToSummaries(variants: BoardVariant[]): BoardSummary[] {
    return variants.map((v) => {
      const parts = v.board.split('/');
      const manufacturer = parts.length > 1 ? parts[0] : 'Generic';
      const id = `${v.board.replace(/\//g, '-')}-${v.name}`;

      // Enhance display name for pristine presentation
      let friendlyName = v.display_name;
      if (!friendlyName || friendlyName === v.name) {
        friendlyName = v.name
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      return {
        id,
        board: v.board,
        name: v.name,
        full_name: v.full_name,
        type: v.type,
        target: v.target,
        display_name: friendlyName,
        manufacturer,
        wake_word_supported: v.wake_word_supported,
        build_options: v.build_options || [],
      };
    });
  }

  private async parseBoardsFromFS(): Promise<BoardVariant[]> {
    const boardsDir = path.join(this.firmwareDir, 'main', 'boards');
    const results: BoardVariant[] = [];

    const walk = (currentDir: string, relativeDir: string) => {
      if (!fs.existsSync(currentDir)) return;
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subRel = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
          const subFull = path.join(currentDir, entry.name);
          const configPath = path.join(subFull, 'config.json');

          if (fs.existsSync(configPath)) {
            try {
              const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
              const builds = Array.isArray(cfg.builds) ? cfg.builds : [];

              for (const build of builds) {
                const name = build.name || entry.name;
                results.push({
                  board: subRel,
                  name,
                  full_name: `${cfg.manufacturer ? cfg.manufacturer + '-' : ''}${name}`,
                  type: cfg.type || name,
                  target: cfg.target || 'esp32s3',
                  display_name: cfg.display_name || name,
                  wake_word_supported: cfg.target === 'esp32s3' || cfg.target === 'esp32c3',
                  build_options: [],
                });
              }
            } catch (e) {
              console.error(`Failed parsing ${configPath}:`, e);
            }
          } else {
            walk(subFull, subRel);
          }
        }
      }
    };

    walk(boardsDir, '');
    return results;
  }
}

export const boardDiscoveryService = new BoardDiscoveryService();
