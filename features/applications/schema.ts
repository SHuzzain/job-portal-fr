import { z } from "zod"
import { interviewSchema } from "@/features/interviews/schema"

export const applicationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  vacancyId: z.string(),
  resumeId: z.string(),
  status: z.string(),
  createdAt: z.string(),
  interview: interviewSchema.nullable(),
})

export const applicationCreateSchema = z.object({
  vacancyId: z.string(),
  resumeId: z.string(),
})

export const applicationStatusSchema = z.enum([
  "SHORTLISTED",
  "INTERVIEW_COMPLETED",
  "REJECTED",
  "HIRED",
  "FAILED",
])

export const employerSetStatusSchema = z.enum([
  "SHORTLISTED",
  "INTERVIEW_COMPLETED",
  "REJECTED",
  "HIRED",
])

export type Application = z.infer<typeof applicationSchema>
export type ApplicationCreate = z.infer<typeof applicationCreateSchema>
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>
export type EmployerSetStatus = z.infer<typeof employerSetStatusSchema>
