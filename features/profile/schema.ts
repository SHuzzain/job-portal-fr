import { z } from "zod"

export const seekerProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  displayName: z.string().nullable(),
  icNumber: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.string().nullable(),
  city: z.string().nullable(),
  highestEducation: z.string().nullable(),
  fieldOfStudy: z.string().nullable(),
  yearsOfExperience: z.number().nullable(),
  skills: z.string().nullable(),
  preferredLocation: z.string().nullable(),
  preferredEmploymentType: z.string().nullable(),
  isMalaysian: z.boolean(),
  hasWorkPermit: z.boolean(),
  complete: z.boolean(),
})

export const seekerProfileUpdateSchema = z.object({
  displayName: z.string().min(1).optional(),
  icNumber: z.string().min(6).optional(),
  dateOfBirth: z.string().min(4).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  city: z.string().min(1).optional(),
  highestEducation: z.string().min(1).optional(),
  fieldOfStudy: z.string().min(1).optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  skills: z.string().min(1).optional(),
  preferredLocation: z.string().min(1).optional(),
  preferredEmploymentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]).optional(),
  isMalaysian: z.boolean().optional(),
  hasWorkPermit: z.boolean().optional(),
})

export type SeekerProfile = z.infer<typeof seekerProfileSchema>
export type SeekerProfileUpdate = z.infer<typeof seekerProfileUpdateSchema>
