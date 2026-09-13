import { z } from "zod"

export const resumeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  fileUrl: z.string(),
  createdAt: z.string(),
})

export const resumeCreateSchema = resumeSchema.pick({
  title: true,
  fileUrl: true,
})

export type Resume = z.infer<typeof resumeSchema>
export type ResumeCreate = z.infer<typeof resumeCreateSchema>
