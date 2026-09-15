"use client";

import { unauthorized } from "next/navigation";
import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { authClient } from "@/connector";

import { MultiSessionPanel } from "./multi-session-panel";
import { SessionManagementPanel } from "./session-management-panel";

const tabs = ["sessions", "accounts"] as const;

export function SettingsTabsPanel() {
  const t = useTranslations("Settings");
  const { data, isPending } = authClient.useSession();
  const [tab, setTab] = useState<(typeof tabs)[number]>("sessions");

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (!data) {
    unauthorized();
  }

  return (
    <div className="grid gap-6">
      <div className="flex gap-2">
        {tabs.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={tab === item ? "secondary" : "ghost"}
            onClick={() => setTab(item)}
          >
            {t(`tab_${item}`)}
          </Button>
        ))}
      </div>

      {tab === "sessions" ? <SessionManagementPanel /> : <MultiSessionPanel />}
    </div>
  );
}
