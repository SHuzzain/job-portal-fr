"use client"

import { authClient } from "@/connector"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { AccountMenu } from "./account-menu"
import { WorkspaceSwitcher } from "./workspace-switcher"

export function SessionActions() {
  const { data } = authClient.useSession()

  if (!data) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <NotificationBell />
      <WorkspaceSwitcher />
      <AccountMenu />
    </div>
  )
}
