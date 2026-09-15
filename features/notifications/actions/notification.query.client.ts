import { apiClient } from "@/connector/client";

import type { Notification, UnreadCount } from "../schema";

export function listNotifications() {
  return apiClient<Notification[]>("/notifications");
}

export function getUnreadCount() {
  return apiClient<UnreadCount>("/notifications/unread-count");
}
