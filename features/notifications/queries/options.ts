import { queryOptions } from "@tanstack/react-query";

import {
  getUnreadCount,
  listNotifications,
} from "../actions/notification.query.client";
import { notificationKeys } from "./keys";

export function notificationsQueryOptions() {
  return queryOptions({
    queryKey: notificationKeys.list(),
    queryFn: listNotifications,
  });
}

export function unreadCountQueryOptions() {
  return queryOptions({
    queryKey: notificationKeys.unread(),
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
  });
}
