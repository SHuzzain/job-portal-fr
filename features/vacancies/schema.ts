import { z } from "zod";

export const vacancyStatusSchema = z.enum([
  "PENDING_APPROVAL",
  "APPROVED",
  "RETURNED_FOR_CORRECTION",
  "REJECTED",
  "CLOSED",
]);

export const vacancyEmploymentTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
]);

export const vacancySchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  employmentType: vacancyEmploymentTypeSchema,
  minQualification: z.string().nullable(),
  preferredGender: z.string().nullable(),
  minAge: z.number().int().nullable(),
  maxAge: z.number().int().nullable(),
  status: vacancyStatusSchema,
  reviewNotes: z.string().nullable(),
  createdAt: z.string(),
});

export const vacancyCreateSchema = vacancySchema
  .pick({
    title: true,
    description: true,
    location: true,
    employmentType: true,
  })
  .extend({
    minQualification: z.string().optional(),
    preferredGender: z.enum(["MALE", "FEMALE"]).optional(),
    minAge: z.number().int().optional(),
    maxAge: z.number().int().optional(),
  });

export type Vacancy = z.infer<typeof vacancySchema>;
export type VacancyCreate = z.infer<typeof vacancyCreateSchema>;
export type VacancyStatus = z.infer<typeof vacancyStatusSchema>;
