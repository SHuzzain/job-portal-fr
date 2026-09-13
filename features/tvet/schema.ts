import { z } from "zod"

export const tvetRfpStatusSchema = z.enum(["OPEN", "CLOSED"])

export const tvetRfpSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  title: z.string(),
  description: z.string(),
  status: tvetRfpStatusSchema,
  createdAt: z.string(),
})

export const tvetRfpCreateSchema = tvetRfpSchema.pick({
  title: true,
  description: true,
})

export const tvetAttendanceSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
})

export const tvetSessionSchema = z.object({
  id: z.string(),
  rfpId: z.string(),
  organizationId: z.string(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
  barcode: z.string(),
  createdAt: z.string(),
})

export const tvetSessionDetailSchema = tvetSessionSchema.extend({
  attendance: tvetAttendanceSchema.array(),
})

export const tvetSessionCreateSchema = z.object({
  rfpId: z.string(),
  title: z.string(),
  venue: z.string(),
  startsAt: z.string(),
  endsAt: z.string(),
})

export const tvetScanSchema = z.object({
  barcode: z.string().min(1),
})

export type TvetRfp = z.infer<typeof tvetRfpSchema>
export type TvetRfpCreate = z.infer<typeof tvetRfpCreateSchema>
export type TvetAttendance = z.infer<typeof tvetAttendanceSchema>
export type TvetSession = z.infer<typeof tvetSessionSchema>
export type TvetSessionDetail = z.infer<typeof tvetSessionDetailSchema>
export type TvetSessionCreate = z.infer<typeof tvetSessionCreateSchema>
export type TvetScan = z.infer<typeof tvetScanSchema>
