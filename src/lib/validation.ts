import { z } from "zod";

const forbiddenControls = /\p{Cc}/u;
const forbiddenMarkup = /[<>]/u;

export function codePointLength(value: string) {
  return Array.from(value).length;
}

export function normalizeWord(value: string) {
  return value.normalize("NFKC");
}

function configuredBlocklist() {
  return new Set(
    (process.env.MODERATION_BLOCKLIST ?? "")
      .split(",")
      .map((word) => word.trim().toLocaleLowerCase("en-US"))
      .filter(Boolean),
  );
}

export const lightInputSchema = z
  .object({
    word: z.string().transform(normalizeWord),
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
  })
  .superRefine((value, context) => {
    const length = codePointLength(value.word);
    if (length < 1 || length > 24) {
      context.addIssue({ code: "custom", path: ["word"], message: "Use 1–24 characters." });
    }
    if (/\s/u.test(value.word)) {
      context.addIssue({ code: "custom", path: ["word"], message: "Enter exactly one word, without spaces." });
    }
    if (forbiddenControls.test(value.word) || forbiddenMarkup.test(value.word)) {
      context.addIssue({ code: "custom", path: ["word"], message: "That word contains unsupported characters." });
    }
    if (configuredBlocklist().has(value.word.toLocaleLowerCase("en-US"))) {
      context.addIssue({ code: "custom", path: ["word"], message: "That word cannot be published." });
    }
  });

export const lightsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(120),
  cursor: z.string().max(256).optional(),
});
