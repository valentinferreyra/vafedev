import { z } from "zod";

import { COLLECTIONS } from "./types";

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const contentRelationSchema = z.object({
  collection: z.enum(COLLECTIONS),
  slug: z.string().regex(slug, "Slug must use lowercase kebab-case"),
});

export const contentMetaSchema = z.object({
  slug: z.string().regex(slug, "Slug must use lowercase kebab-case"),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  date: z.preprocess(
    (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
    z
      .string()
      .regex(isoDate, "Date must use ISO YYYY-MM-DD")
      .refine(
        (value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)),
        "Date is invalid",
      ),
  ),
  draft: z.boolean().default(false),
  status: z.string().trim().min(1).optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
  related: z.array(contentRelationSchema).default([]),
});
