import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  title: z.string(),
  body: z.string(),
  href: z.string(),
  entityType: z.string().nullable(),
  entityId: z.string().nullable(),
  read: z.boolean(),
  createdAt: z.string(),
});

export const unreadCountSchema = z.object({
  count: z.number(),
});

export type Notification = z.infer<typeof notificationSchema>;
export type UnreadCount = z.infer<typeof unreadCountSchema>;
