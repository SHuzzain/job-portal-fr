"use client"

import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { useDeviceAccounts } from "../hooks/use-device-accounts"
import { roleLabel } from "../lib/sessions"

export function AccountMenu() {
  const t = useTranslations("Settings")
  const router = useRouter()
  const {
    accounts,
    atLimit,
    isPending,
    session,
    signOutAll,
    signOutCurrent,
    switchAccount,
  } = useDeviceAccounts()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  if (!session) {
    return null
  }

  const otherAccounts = accounts.filter((account) => !account.isActive)

  async function run(action: () => Promise<string | null>, failed: string) {
    setPending(true)
    setError(null)
    const message = await action()
    setPending(false)
    if (message) {
      setError(failed)
      return
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={rootRef}>
      <Button
        size="xs"
        variant="outline"
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={isPending}
        onClick={() => {
          setError(null)
          setOpen((value) => !value)
        }}
      >
        {session.user.email}
      </Button>
      {open ? (
        <div
          role="menu"
          className="border-border bg-background absolute right-0 z-20 mt-1 grid min-w-64 gap-1 rounded-md border p-2 text-xs shadow-sm"
        >
          <Button
            size="xs"
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setOpen(false)
              router.push("/settings")
            }}
          >
            {t("open")}
          </Button>
          <Button
            size="xs"
            variant="ghost"
            className="justify-start"
            disabled={pending || atLimit}
            onClick={() => {
              setOpen(false)
              router.push("/sign-in?addAccount=1&next=/settings")
            }}
          >
            {t("addAccount")}
          </Button>
          {atLimit ? (
            <p className="text-muted-foreground px-2">{t("accountLimit")}</p>
          ) : null}

          {otherAccounts.length > 0 ? (
            <div className="grid gap-1 border-t border-border pt-1">
              <p className="text-muted-foreground px-2">{t("switchAccount")}</p>
              {otherAccounts.map((account) => (
                <Button
                  key={account.sessionToken}
                  size="xs"
                  variant="ghost"
                  className="h-auto justify-start py-1.5 text-left"
                  disabled={pending}
                  onClick={() =>
                    void run(
                      () => switchAccount(account.sessionToken),
                      t("switchError"),
                    )
                  }
                >
                  <span className="grid">
                    <span>{account.name}</span>
                    <span className="text-muted-foreground font-normal">
                      {account.email}
                      {roleLabel(account.role) ? ` · ${roleLabel(account.role)}` : ""}
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          ) : null}

          <div className="grid gap-1 border-t border-border pt-1">
            <Button
              size="xs"
              variant="ghost"
              className="justify-start"
              disabled={pending}
              onClick={() => {
                if (!window.confirm(t("confirmSignOutCurrent"))) {
                  return
                }
                void run(signOutCurrent, t("removeError"))
              }}
            >
              {t("signOutCurrent")}
            </Button>
            <Button
              size="xs"
              variant="destructive"
              className="justify-start"
              disabled={pending}
              onClick={() => {
                if (!window.confirm(t("confirmSignOutAll"))) {
                  return
                }
                void run(async () => {
                  await signOutAll()
                  return null
                }, t("removeError"))
              }}
            >
              {t("signOutAll")}
            </Button>
          </div>
          {error ? <p className="text-destructive px-2">{error}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
