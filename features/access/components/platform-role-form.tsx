"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { countPermissions, type PermissionMap } from "@/connector/access/catalog"
import { useRouter } from "@/i18n/navigation"
import {
  accessErrorMessage,
  useCreatePlatformRole,
  useUpdatePlatformRole,
} from "../actions/access.mutate"
import { platformRoleFormSchema } from "../schema"
import { PermissionMatrix } from "./permission-matrix"

type Props = {
  role?: {
    id: string
    name: string
    label: string
    permissions: PermissionMap
  }
}

/** Keeps typed role names in the slug shape the API accepts. */
function toRoleName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^_+/, "")
    .slice(0, 40)
}

export function PlatformRoleForm({ role }: Props) {
  const t = useTranslations("Access")
  const router = useRouter()
  const [name, setName] = useState(role?.name ?? "")
  const [label, setLabel] = useState(role?.label ?? "")
  const [permissions, setPermissions] = useState<PermissionMap>(role?.permissions ?? {})
  const [error, setError] = useState<string | null>(null)

  const createRole = useCreatePlatformRole()
  const updateRole = useUpdatePlatformRole(role?.id ?? "")
  const pending = createRole.isPending || updateRole.isPending

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    const parsed = platformRoleFormSchema.safeParse({
      name: role?.name ?? name,
      label,
      permissions,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? t("invalidRole"))
      return
    }

    try {
      if (role) {
        await updateRole.mutateAsync({ label: parsed.data.label, permissions })
      } else {
        await createRole.mutateAsync(parsed.data)
      }
      router.push("/pasak/access")
    } catch (mutationError) {
      setError(
        accessErrorMessage(
          mutationError,
          role ? t("saveRoleError") : t("createRoleError"),
        ),
      )
    }
  }

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <div className="grid max-w-md gap-3 text-sm">
        <label className="grid gap-1">
          <span>{t("roleName")}</span>
          <input
            required
            readOnly={Boolean(role)}
            className="border-input bg-background rounded-md border px-2 py-1.5 read-only:opacity-60"
            value={name}
            placeholder="finance_officer"
            onChange={(event) => setName(toRoleName(event.target.value))}
          />
          {role ? null : (
            <span className="text-muted-foreground text-xs">{t("roleNameHint")}</span>
          )}
        </label>
        <label className="grid gap-1">
          <span>{t("roleLabel")}</span>
          <input
            required
            className="border-input bg-background rounded-md border px-2 py-1.5"
            value={label}
            placeholder="Finance officer"
            onChange={(event) => setLabel(event.target.value)}
          />
        </label>
      </div>

      <PermissionMatrix scope="platform" value={permissions} onChange={setPermissions} />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : role ? t("saveRole") : t("createRole")}
        </Button>
        <span className="text-muted-foreground text-sm">
          {t("permissionCount", { count: countPermissions(permissions) })}
        </span>
      </div>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </form>
  )
}
