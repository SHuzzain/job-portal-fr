"use client"

import { useTranslations } from "next-intl"
import { authClient } from "@/connector"
import { PermissionGate } from "@/features/auth/components/permission-gate"

type Props = {
  children: React.ReactNode
  resource?: string
  action?: string
}

export function TvetGate({
  children,
  resource = "tvet_rfp",
  action = "view",
}: Props) {
  const t = useTranslations("TvetPage")
  const { data, isPending } = authClient.useSession()
  const role = typeof data?.user.role === "string" ? data.user.role : ""
  const capable =
    data?.user &&
    typeof data.user === "object" &&
    "hasTvetCapability" in data.user &&
    data.user.hasTvetCapability === true
  const blocked = role === "employer" && !capable

  return (
    <PermissionGate resource={resource} action={action}>
      {isPending ? (
        <p className="text-muted-foreground text-sm">…</p>
      ) : blocked ? (
        <p className="text-sm">{t("needCapability")}</p>
      ) : (
        children
      )}
    </PermissionGate>
  )
}
