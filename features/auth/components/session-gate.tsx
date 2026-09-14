"use client"

import { forbidden, unauthorized } from "next/navigation"
import { authClient } from "@/connector"

type Props = {
  children: React.ReactNode
  roles?: string[]
  nextPath?: string
}

export function SessionGate({ children, roles }: Props) {
  const { data, isPending } = authClient.useSession()

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (!data) {
    unauthorized()
  }

  const role = typeof data.user.role === "string" ? data.user.role : ""
  if (roles && !roles.includes(role)) {
    forbidden()
  }

  return <>{children}</>
}
