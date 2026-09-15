"use client"

import { useFormatter, useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/connector"
import { useDeviceAccounts } from "@/features/auth/hooks/use-device-accounts"
import {
  deviceKindFromUserAgent,
  type DeviceKind,
  type UserSession,
} from "@/features/auth/lib/sessions"

const deviceOrder: DeviceKind[] = ["laptop", "phone", "tablet"]

export function SessionManagementPanel() {
  const t = useTranslations("Settings")
  const format = useFormatter()
  const { data } = authClient.useSession()
  const { signOutCurrent } = useDeviceAccounts()
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [isPending, setIsPending] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingToken, setPendingToken] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const result = await authClient.listSessions()
    if (result.error) {
      setError(t("loadError"))
      setSessions([])
      setIsPending(false)
      return
    }

    const currentToken = data?.session.token
    setSessions(
      (result.data ?? []).map((session) => ({
        token: session.token,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        createdAt: new Date(session.createdAt),
        expiresAt: new Date(session.expiresAt),
        isCurrent: session.token === currentToken,
        device: deviceKindFromUserAgent(session.userAgent),
      })),
    )
    setError(null)
    setIsPending(false)
  }, [data?.session.token, t])

  useEffect(() => {
    void reload()
  }, [reload])

  async function revoke(session: UserSession) {
    if (!window.confirm(t("confirmRevoke"))) {
      return
    }

    setPendingToken(session.token)
    setError(null)

    if (session.isCurrent) {
      const message = await signOutCurrent()
      setPendingToken(null)
      if (message) {
        setError(t("revokeError"))
      }
      return
    }

    const result = await authClient.revokeSession({ token: session.token })
    setPendingToken(null)
    if (result.error) {
      setError(t("revokeError"))
      return
    }

    await reload()
  }

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  const grouped = deviceOrder
    .map((device) => ({
      device,
      items: sessions.filter((session) => session.device === device),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-medium">{t("sessionsTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("sessionsHint")}</p>
      </div>
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      {grouped.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("emptySessions")}</p>
      ) : (
        grouped.map((group) => (
          <section key={group.device} className="grid gap-3">
            <h3 className="text-sm font-medium">{t(group.device)}</h3>
            <ul className="grid gap-3">
              {group.items.map((session) => (
                <li
                  key={session.token}
                  className="border-border grid gap-2 rounded-md border p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="grid gap-0.5">
                      <p>
                        {session.isCurrent ? t("currentSession") : t("otherSession")}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {session.ipAddress ? t("ip", { value: session.ipAddress }) : t("ipUnknown")}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {t("created", {
                          value: format.dateTime(session.createdAt, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }),
                        })}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {t("expires", {
                          value: format.dateTime(session.expiresAt, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }),
                        })}
                      </p>
                    </div>
                    <Button
                      size="xs"
                      variant="outline"
                      disabled={pendingToken === session.token}
                      onClick={() => void revoke(session)}
                    >
                      {pendingToken === session.token ? t("revoking") : t("revoke")}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
