import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { ZodError } from 'zod';
import { cardSchema, type Card } from '../src/engine/schema';

async function findJsonFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return findJsonFiles(path);
      return entry.isFile() && entry.name.endsWith('.json') ? [path] : [];
    })
  );

  return nested.flat().sort((left, right) => left.localeCompare(right));
}

function formatZodError(error: ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${path}: ${issue.message}`;
    })
    .join('; ');
}

async function parseCardFile(path: string): Promise<Card> {
  const relativePath = relative(process.cwd(), path);

  try {
    const raw = await readFile(path, 'utf8');
    return cardSchema.parse(JSON.parse(raw));
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`${relativePath}: ${formatZodError(error)}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`${relativePath}: ${error.message}`);
    }
    throw error;
  }
}

export async function loadCardsFromFs(cardsDir: string = join(process.cwd(), 'src', 'cards')): Promise<Card[]> {
  const files = await findJsonFiles(cardsDir);
  return Promise.all(files.map((path) => parseCardFile(path)));
}
