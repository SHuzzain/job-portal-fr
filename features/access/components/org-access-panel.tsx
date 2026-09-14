"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/connector"
import { OrgMembersPanel } from "./org-members-panel"
import { OrgRolesPanel } from "./org-roles-panel"

const tabs = ["members", "roles"] as const

export function OrgAccessPanel() {
  const t = useTranslations("Access")
  const { data: active, isPending } = authClient.useActiveOrganization()
  const [tab, setTab] = useState<(typeof tabs)[number]>("members")

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (!active?.id) {
    return <p className="text-muted-foreground text-sm">{t("needCompany")}</p>
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

      {tab === "members" ? (
        <OrgMembersPanel organizationId={active.id} />
      ) : (
        <OrgRolesPanel organizationId={active.id} />
      )}
    </div>
  )
}
