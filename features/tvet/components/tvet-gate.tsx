"use client"

import { useTranslations } from "next-intl"
import { authClient } from "@/connector"
import { SessionGate } from "@/features/auth/components/session-gate"

type Props = {
  children: React.ReactNode
  nextPath?: string
}

export function TvetGate({ children, nextPath = "/employer/tvet" }: Props) {
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
    <SessionGate roles={["employer", "admin", "super_admin"]} nextPath={nextPath}>
      {isPending ? (
        <p className="text-muted-foreground text-sm">…</p>
      ) : blocked ? (
        <p className="text-sm">{t("needCapability")}</p>
      ) : (
        children
      )}
    </SessionGate>
  )
}
