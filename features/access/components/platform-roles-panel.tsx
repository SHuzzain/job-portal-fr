"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { NavButton } from "@/components/nav-button"
import { Button } from "@/components/ui/button"
import { accessErrorMessage, useDeletePlatformRole } from "../actions/access.mutate"
import { platformRolesQueryOptions } from "../queries/options"
import { PermissionSummary } from "./permission-summary"

export function PlatformRolesPanel() {
  const t = useTranslations("Access")
  const { data: roles, isPending, error } = useQuery(platformRolesQueryOptions())
  const deleteRole = useDeletePlatformRole()
  const [actionError, setActionError] = useState<string | null>(null)

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-medium">{t("platformRoles")}</h2>
          <p className="text-muted-foreground text-sm">{t("platformRolesHint")}</p>
        </div>
        <NavButton href="/pasak/access/roles/new" size="sm">
          {t("createRole")}
        </NavButton>
      </div>

      {isPending ? <p className="text-muted-foreground text-sm">…</p> : null}
      {error ? (
        <p className="text-destructive text-sm">
          {accessErrorMessage(error, t("loadError"))}
        </p>
      ) : null}

      <ul className="grid gap-3">
        {(roles ?? []).map((role) => (
          <li key={role.id} className="grid gap-3 rounded-md border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium">{role.label}</p>
                <p className="text-muted-foreground text-xs">{role.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <NavButton
                  href={`/pasak/access/roles/${role.id}`}
                  size="xs"
                  variant="outline"
                >
                  {t("editRole")}
                </NavButton>
                {role.isSystem ? (
                  <span className="text-muted-foreground text-xs">
                    {t("systemRole")}
                  </span>
                ) : (
                  <Button
                    size="xs"
                    variant="destructive"
                    disabled={deleteRole.isPending}
                    onClick={async () => {
                      setActionError(null)
                      try {
                        await deleteRole.mutateAsync(role.id)
                      } catch (mutationError) {
                        setActionError(
                          accessErrorMessage(mutationError, t("deleteRoleError")),
                        )
                      }
                    }}
                  >
                    {t("deleteRole")}
                  </Button>
                )}
              </div>
            </div>
            <PermissionSummary permissions={role.permissions} />
          </li>
        ))}
      </ul>

      {actionError ? <p className="text-destructive text-sm">{actionError}</p> : null}
    </div>
  )
}
