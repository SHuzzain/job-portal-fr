import { z } from "zod"

export const pasakCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  status: z.string(),
  ssmNumber: z.string().nullable(),
  ssmDocumentUrl: z.string().nullable(),
  legalName: z.string().nullable(),
  industry: z.string().nullable(),
  website: z.string().nullable(),
  address: z.string().nullable(),
  reviewNotes: z.string().nullable(),
})

export const pasakEmployerSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  hasTvetCapability: z.boolean(),
})

export const pasakReviewActionSchema = z.enum([
  "APPROVE",
  "REJECT",
  "RETURN_FOR_CORRECTION",
])

export type PasakCompany = z.infer<typeof pasakCompanySchema>
export type PasakEmployer = z.infer<typeof pasakEmployerSchema>
export type PasakReviewAction = z.infer<typeof pasakReviewActionSchema>
