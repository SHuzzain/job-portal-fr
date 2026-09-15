"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

import { useMarkAllRead, useMarkRead } from "../actions/notification.mutate";
import { notificationsQueryOptions } from "../queries/options";

export function NotificationList() {
  const t = useTranslations("Notifications");
  const router = useRouter();
  const { data, isPending, isError } = useQuery(notificationsQueryOptions());
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (isError || !data?.length) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="grid gap-3">
      <Button
        size="sm"
        variant="outline"
        disabled={markAllRead.isPending || data.every((item) => item.read)}
        onClick={() => markAllRead.mutate()}
      >
        {t("markAll")}
      </Button>
      <ul className="grid gap-2 text-sm">
        {data.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="grid w-full gap-1 rounded-md border border-border p-3 text-left"
              onClick={() => {
                if (!item.read) {
                  markRead.mutate(item.id);
                }
                router.push(item.href);
              }}
            >
              <span
                className={item.read ? "text-muted-foreground" : "font-medium"}
              >
                {item.title}
              </span>
              <span className="text-muted-foreground">{item.body}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
