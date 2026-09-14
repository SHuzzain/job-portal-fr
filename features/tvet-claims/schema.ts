import { z } from "zod"

export const tvetClaimStatusSchema = z.enum([
  "SUBMITTED",
  "FINANCE_APPROVED",
  "SIGNED_DOC_SUBMITTED",
  "PAID",
  "REJECTED",
])

export const tvetClaimSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  employerId: z.string(),
  claimAmount: z.string(),
  borangTuntutanUrl: z.string(),
  status: tvetClaimStatusSchema,
  signedBorangAkuanUrl: z.string().nullable(),
  reviewNotes: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  courseTitle: z.string(),
  courseStartsAt: z.string(),
  courseEndsAt: z.string(),
  providerName: z.string(),
  paymentVoucherDownloadUrl: z.string(),
  borangAkuanDownloadUrl: z.string(),
})

export const eligibleCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
})

export type TvetClaim = z.infer<typeof tvetClaimSchema>
export type TvetClaimStatus = z.infer<typeof tvetClaimStatusSchema>
export type EligibleTvetCourse = z.infer<typeof eligibleCourseSchema>
