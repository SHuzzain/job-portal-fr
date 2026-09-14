"use client"

import { forbidden, unauthorized } from "next/navigation"
import { usePermission } from "../hooks/use-permission"

type Props = {
  children: React.ReactNode
  resource: string
  action?: string
}

/** Page-level guard driven by resource/action permissions, not role names. */
export function PermissionGate({ children, resource, action = "view" }: Props) {
  const { allowed, isPending, authenticated } = usePermission(resource, action)

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (!authenticated) {
    unauthorized()
  }

  if (!allowed) {
    forbidden()
  }

  return <>{children}</>
}
