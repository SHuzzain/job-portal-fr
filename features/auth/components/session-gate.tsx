"use client"

import { useTranslations } from "next-intl"
import { authClient } from "@/connector"
import { NavButton } from "@/components/nav-button"

type Props = {
  children: React.ReactNode
  roles?: string[]
  nextPath?: string
}

export function SessionGate({ children, roles, nextPath = "/employer" }: Props) {
  const t = useTranslations("Auth")
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (!data) {
    return (
      <div className="grid gap-3 text-sm">
        <p>{t("required")}</p>
        <div className="flex flex-wrap gap-2">
          <NavButton href={`/sign-in?next=${encodeURIComponent(nextPath)}`}>
            {t("signIn")}
          </NavButton>
          <NavButton href="/sign-up" variant="outline">
            {t("signUp")}
          </NavButton>
        </div>
      </div>
    )
  }

  const role = typeof data.user.role === "string" ? data.user.role : ""
  if (roles && !roles.includes(role)) {
    return <p className="text-sm">{t("forbidden")}</p>
  }

  return <>{children}</>
}
