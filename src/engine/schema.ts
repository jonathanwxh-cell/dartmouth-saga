import { z } from 'zod';

const qualityKeys = [
  'symbolic_progress',
  'funding',
  'public_trust',
  'academic_credibility',
  'compute',
  'team_morale',
] as const;

const eraKeys = ['1956', '1974', '1980', '1987', '1993', '2012', '2020'] as const;
const formKeys = ['standard', 'letter', 'newswire', 'notebook'] as const;

const effectSchema = z
  .object({
    symbolic_progress: z.number().optional(),
    funding: z.number().optional(),
    public_trust: z.number().optional(),
    academic_credibility: z.number().optional(),
    compute: z.number().optional(),
    team_morale: z.number().optional(),
  })
  .strict();

const rangeSchema = z
  .tuple([z.number().min(0).max(100), z.number().min(0).max(100)])
  .refine(([min, max]) => min <= max, 'min must be less than or equal to max');

const requiresSchema = z
  .object(Object.fromEntries(qualityKeys.map((quality) => [quality, rangeSchema.optional()])))
  .strict();

const choiceSchema = z
  .object({
    label: z.string().min(1).max(32),
    effects: effectSchema,
    flags: z.array(z.string().min(1)).optional(),
    nextCardId: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional(),
  })
  .strict();

export const cardSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    era: z.enum(eraKeys),
    weight: z.number().positive(),
    requires: requiresSchema.partial().optional(),
    flags_required: z.array(z.string().min(1)).optional(),
    flags_forbidden: z.array(z.string().min(1)).optional(),
    one_shot: z.boolean().optional(),
    is_interstitial: z.boolean().optional(),
    form: z.enum(formKeys).optional(),
    speaker: z
      .object({
        name: z.string(),
        portrait: z.string(),
        title: z.string().min(1).optional(),
      })
      .strict(),
    prompt: z.string().min(1),
    left: choiceSchema,
    right: choiceSchema,
  })
  .strict()
  .superRefine((card, ctx) => {
    if (card.is_interstitial) return;

    if (card.speaker.name.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['speaker', 'name'],
        message: 'speaker.name is required for non-interstitial cards',
      });
    }

    if ((card.form ?? 'standard') === 'standard' && card.speaker.portrait.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['speaker', 'portrait'],
        message: 'speaker.portrait is required for standard cards',
      });
    }
  });

export const cardArraySchema = z.array(cardSchema);

export type Card = z.infer<typeof cardSchema>;
