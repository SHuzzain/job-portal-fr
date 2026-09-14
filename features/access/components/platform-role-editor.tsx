"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { accessErrorMessage } from "../actions/access.mutate"
import { platformRoleQueryOptions } from "../queries/options"
import { PlatformRoleForm } from "./platform-role-form"

export function PlatformRoleEditor({ id }: { id: string }) {
  const t = useTranslations("Access")
  const { data: role, isPending, error } = useQuery(platformRoleQueryOptions(id))

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (error || !role) {
    return (
      <p className="text-destructive text-sm">
        {accessErrorMessage(error, t("loadError"))}
      </p>
    )
  }

  return (
    <div className="grid gap-4">
      {role.isSystem ? (
        <p className="text-muted-foreground text-sm">{t("systemRoleHint")}</p>
      ) : null}
      <PlatformRoleForm
        role={{
          id: role.id,
          name: role.name,
          label: role.label,
          permissions: role.permissions,
        }}
      />
    </div>
  )
}
