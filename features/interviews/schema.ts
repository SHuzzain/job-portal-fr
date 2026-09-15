import { z } from "zod";

export const interviewModeSchema = z.enum(["PHYSICAL", "ONLINE"]);
export const interviewStatusSchema = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

export const interviewSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  interviewDate: z.string(),
  interviewTime: z.string(),
  mode: interviewModeSchema,
  location: z.string().nullable(),
  meetingLink: z.string().nullable(),
  notes: z.string().nullable(),
  status: interviewStatusSchema,
  createdAt: z.string(),
});

export const interviewScheduleSchema = z
  .object({
    applicationId: z.string().min(1),
    interviewDate: z.string().min(1),
    interviewTime: z.string().min(1),
    mode: interviewModeSchema,
    location: z.string().optional(),
    meetingLink: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "PHYSICAL" && !data.location?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["location"],
        message: "Location is required",
      });
    }
    if (data.mode === "ONLINE" && !data.meetingLink?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["meetingLink"],
        message: "Meeting link is required",
      });
    }
  });

export type Interview = z.infer<typeof interviewSchema>;
export type InterviewSchedule = z.infer<typeof interviewScheduleSchema>;
export type InterviewMode = z.infer<typeof interviewModeSchema>;
