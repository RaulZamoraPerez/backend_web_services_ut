import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const TEMP_DIR = path.resolve(process.cwd(), 'temp_uploads');

export async function cleanupTempUploadsNow(options?: { olderThanMs?: number; onlyTmpPrefix?: boolean }) {
  const olderThanMs = options?.olderThanMs ?? 15 * 60 * 1000; // 15 min
  const onlyTmpPrefix = options?.onlyTmpPrefix ?? false;

  if (!existsSync(TEMP_DIR)) return { deleted: 0, kept: 0, dir: TEMP_DIR };

  const entries = await fs.readdir(TEMP_DIR);
  let deleted = 0, kept = 0;
  const now = Date.now();

  await Promise.all(entries.map(async (name) => {
    if (onlyTmpPrefix && !name.startsWith('tmp-')) { kept++; return; }
    const filePath = path.join(TEMP_DIR, name);
    try {
      const st = await fs.stat(filePath);
      const age = now - st.mtimeMs;
      if (age >= olderThanMs) {
        await fs.unlink(filePath);
        deleted++;
      } else {
        kept++;
      }
    } catch { /* ignore */ }
  }));

  return { deleted, kept, dir: TEMP_DIR };
}

let timer: NodeJS.Timeout | null = null;

export function scheduleTempUploadsCleanup(everyMs = 24 * 60 * 60 * 1000, options?: { olderThanMs?: number; onlyTmpPrefix?: boolean }) {
  cleanupTempUploadsNow(options)
    .then(r => console.log(`Temp cleanup: deleted=${r.deleted} kept=${r.kept} dir=${r.dir}`))
    .catch(() => { });

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    cleanupTempUploadsNow(options)
      .then(r => console.log(`Temp cleanup: deleted=${r.deleted} kept=${r.kept} dir=${r.dir}`))
      .catch(() => { });
  }, everyMs);
}

/**
 * Detiene el timer de limpieza programado
 */
export function stopTempUploadsCleanup(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
    console.log('🛑 Timer de limpieza de archivos temporales detenido');
  }
}