"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { authClient } from "@/connector"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { useRouter } from "@/i18n/navigation"

export function SessionActions() {
  const t = useTranslations("Auth")
  const router = useRouter()
  const { data } = authClient.useSession()

  if (!data) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <NotificationBell />
      <span className="text-muted-foreground">{data.user.email}</span>
      <Button
        size="xs"
        variant="outline"
        onClick={async () => {
          await authClient.signOut()
          router.push("/")
        }}
      >
        {t("signOut")}
      </Button>
    </div>
  )
}
