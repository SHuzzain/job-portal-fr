"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { PlatformRolesPanel } from "./platform-roles-panel";
import { PlatformUsersPanel } from "./platform-users-panel";

const tabs = ["users", "roles"] as const;

export function AdminAccessPanel() {
  const t = useTranslations("Access");
  const [tab, setTab] = useState<(typeof tabs)[number]>("users");

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

      {tab === "users" ? <PlatformUsersPanel /> : <PlatformRolesPanel />}
    </div>
  );
}
