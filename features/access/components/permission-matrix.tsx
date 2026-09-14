"use client"

import { useTranslations } from "next-intl"
import {
  actionColumns,
  actionsFor,
  hasPermission,
  modulesForScope,
  toggleResource,
  togglePermission,
  type AccessScope,
  type PermissionMap,
} from "@/connector/access/catalog"

type Props = {
  scope: AccessScope
  value: PermissionMap
  onChange?: (permissions: PermissionMap) => void
  readOnly?: boolean
}

export function PermissionMatrix({ scope, value, onChange, readOnly }: Props) {
  const t = useTranslations("Access")
  const disabled = readOnly || !onChange

  function update(next: PermissionMap) {
    onChange?.(next)
  }

  return (
    <div className="grid gap-6">
      {modulesForScope(scope).map((group) => {
        const columns = actionColumns(group.resources)

        return (
          <section key={group.module} className="grid gap-2">
            <h3 className="text-sm font-medium">{t(`module_${group.module}`)}</h3>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full min-w-3xl border-collapse text-sm">
                <thead className="border-b border-border bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">{t("resource")}</th>
                    {columns.map((action) => (
                      <th
                        key={action}
                        className="px-3 py-2 text-center font-medium whitespace-nowrap"
                      >
                        {t(`action_${action}`)}
                      </th>
                    ))}
                    {disabled ? null : (
                      <th className="px-3 py-2 text-center font-medium">{t("all")}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {group.resources.map((resource) => {
                    const supported = actionsFor(resource)
                    const granted = value[resource] ?? []
                    const allGranted =
                      supported.length > 0 && granted.length === supported.length

                    return (
                      <tr key={resource} className="border-b border-border last:border-0">
                        <th className="px-3 py-2 text-left font-normal whitespace-nowrap">
                          {t(`resource_${resource}`)}
                        </th>
                        {columns.map((action) => {
                          if (!supported.includes(action)) {
                            return (
                              <td
                                key={action}
                                aria-hidden
                                className="text-muted-foreground px-3 py-2 text-center"
                              >
                                –
                              </td>
                            )
                          }

                          return (
                            <td key={action} className="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                disabled={disabled}
                                aria-label={`${t(`resource_${resource}`)}: ${t(`action_${action}`)}`}
                                checked={hasPermission(value, resource, action)}
                                onChange={(event) =>
                                  update(
                                    togglePermission(
                                      value,
                                      resource,
                                      action,
                                      event.target.checked,
                                    ),
                                  )
                                }
                              />
                            </td>
                          )
                        })}
                        {disabled ? null : (
                          <td className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              aria-label={`${t(`resource_${resource}`)}: ${t("all")}`}
                              checked={allGranted}
                              onChange={(event) =>
                                update(
                                  toggleResource(value, resource, event.target.checked),
                                )
                              }
                            />
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )
      })}
    </div>
  )
}
