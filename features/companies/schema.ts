import { z } from "zod"

export const companyCreateSchema = z.object({
  name: z.string().min(2),
  ssmNumber: z.string().min(3),
  ssmDocumentUrl: z.url(),
  legalName: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
})

export type CompanyCreate = z.infer<typeof companyCreateSchema>

export function slugFromName(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `${base || "company"}-${crypto.randomUUID().slice(0, 8)}`
}
