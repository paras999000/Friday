import { z } from 'zod';

export const SAFE_BOARD_DIR = /^[a-z0-9][a-z0-9._/-]*$/;
export const SAFE_IDENTIFIER = /^[a-z0-9][a-z0-9.-]*$/;
export const SAFE_WAKE_WORD = /^(?:disabled|nihaoxiaozhi|wn9[sl]?_[a-z0-9_]+)$/;

export const buildJobSchema = z.object({
  board_dir: z.string()
    .min(1)
    .max(128)
    .regex(SAFE_BOARD_DIR, 'Invalid board directory characters')
    .refine((val) => !val.startsWith('/') && !val.includes('..'), 'Path traversal detected in board_dir'),
  board_name: z.string()
    .min(1)
    .max(128)
    .regex(SAFE_IDENTIFIER, 'Invalid board name characters'),
  language: z.string()
    .min(2)
    .max(16)
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code format (e.g. en-US, zh-CN)'),
  wake_word: z.string()
    .min(1)
    .max(64)
    .refine((val) => {
      const normalized = val.toLowerCase().replace(/-/g, '_');
      return SAFE_WAKE_WORD.test(normalized);
    }, 'Invalid wake word format'),
  build_options: z.record(z.union([z.string(), z.boolean()])).optional().default({}),
});

export function sanitizeInputString(input: string): string {
  return input.replace(/[^a-zA-Z0-9._/-]/g, '');
}
