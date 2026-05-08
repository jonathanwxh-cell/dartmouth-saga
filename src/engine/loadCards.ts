import { ZodError } from 'zod';
import { cardSchema, type Card } from './schema';

function payloadFromModule(moduleValue: unknown) {
  if (moduleValue && typeof moduleValue === 'object' && 'default' in moduleValue) {
    return (moduleValue as { default: unknown }).default;
  }

  return moduleValue;
}

function formatZodError(error: ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join('.') : '(root)';
      return `${path}: ${issue.message}`;
    })
    .join('; ');
}

export function parseCardModules(modules: Record<string, unknown>): Card[] {
  return Object.entries(modules)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([filename, moduleValue]) => {
      try {
        return cardSchema.parse(payloadFromModule(moduleValue));
      } catch (error) {
        if (error instanceof ZodError) {
          throw new Error(`Invalid card in ${filename}: ${formatZodError(error)}`);
        }
        throw error;
      }
    });
}

let cachedCards: Card[] | null = null;

export function loadCards(): Card[] {
  if (cachedCards) return cachedCards;
  const modules = import.meta.glob('/src/cards/**/*.json', { eager: true });
  cachedCards = parseCardModules(modules);
  return cachedCards;
}
