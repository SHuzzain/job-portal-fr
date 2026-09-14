"use client"

import { useTranslations } from "next-intl"
import { MODULES, RESOURCES, type PermissionMap } from "@/connector/access/catalog"

type Props = {
  permissions: PermissionMap
}

export function PermissionSummary({ permissions }: Props) {
  const t = useTranslations("Access")
  const granted = MODULES.flatMap((group) =>
    group.resources.filter((resource) => (permissions[resource] ?? []).length > 0),
  )

  if (granted.length === 0) {
    return <p className="text-muted-foreground text-sm">{t("noPermissions")}</p>
  }

  return (
    <ul className="grid gap-1 text-sm">
      {granted.map((resource) => {
        const actions = permissions[resource] ?? []

        return (
          <li key={resource} className="flex flex-wrap gap-x-2">
            <span className="font-medium">{t(`resource_${resource}`)}</span>
            <span className="text-muted-foreground">
              {RESOURCES[resource]
                .filter((action) => actions.includes(action))
                .map((action) => t(`action_${action}`))
                .join(" · ")}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
