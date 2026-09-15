"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";
import { authClient } from "@/connector";

import { unreadCountQueryOptions } from "../queries/options";

export function NotificationBell() {
  const t = useTranslations("Notifications");
  const { data: session } = authClient.useSession();
  const { data } = useQuery({
    ...unreadCountQueryOptions(),
    enabled: Boolean(session),
  });

  if (!session) {
    return null;
  }

  const count = data?.count ?? 0;

  return (
    <NavButton href="/notifications" size="xs" variant="outline">
      {count > 0 ? t("bellCount", { count }) : t("bell")}
    </NavButton>
  );
}
