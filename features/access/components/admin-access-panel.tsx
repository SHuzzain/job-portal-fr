"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/connector"
import { platformRoles } from "@/connector/access/admin"
import { PAGE_ACCESS, PLATFORM_ROLES, type PageAccess, type PlatformRole } from "../pages"
import { PageAccessFields } from "./page-access-fields"

type ListedUser = {
  id: string
  name: string
  email: string
  role?: string | string[] | null
}

function asUsers(payload: unknown): ListedUser[] {
  if (!payload || typeof payload !== "object") {
    return []
  }
  const users = "users" in payload ? payload.users : payload
  if (!Array.isArray(users)) {
    return []
  }
  return users.filter((user): user is ListedUser => {
    return Boolean(user && typeof user === "object" && "id" in user && "email" in user)
  })
}

function isPlatformRole(role: string): role is PlatformRole {
  return (PLATFORM_ROLES as readonly string[]).includes(role)
}

function roleLabel(role: string | string[] | null | undefined) {
  if (Array.isArray(role)) {
    return role[0] ?? "jobseeker"
  }
  return typeof role === "string" && role.length > 0 ? role : "jobseeker"
}

function pagesForPlatformRole(role: string): PageAccess[] {
  if (!isPlatformRole(role)) {
    return []
  }
  const statements = platformRoles[role].statements
  const pages = "page" in statements ? statements.page : []
  return PAGE_ACCESS.filter((page) => (pages as readonly string[]).includes(page))
}

export function AdminAccessPanel() {
  const t = useTranslations("Access")
  const [users, setUsers] = useState<ListedUser[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<PlatformRole>("employer")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    const result = await authClient.admin.listUsers({ query: { limit: 100 } })
    setLoading(false)
    if (result.error) {
      setError(result.error.message ?? t("loadError"))
      return
    }
    setUsers(asUsers(result.data))
  }

  useEffect(() => {
    void refresh()
  }, [])

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <h2 className="font-medium">{t("createUser")}</h2>
        <p className="text-muted-foreground text-sm">{t("adminUserHint")}</p>
        <form
          className="grid max-w-md gap-3 text-sm"
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)
            setPending(true)
            const result = await authClient.admin.createUser({
              name,
              email,
              password,
              role,
            })
            setPending(false)
            if (result.error) {
              setError(result.error.message ?? t("createUserError"))
              return
            }
            setName("")
            setEmail("")
            setPassword("")
            await refresh()
          }}
        >
          <label className="grid gap-1">
            <span>{t("name")}</span>
            <input
              required
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span>{t("email")}</span>
            <input
              required
              type="email"
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span>{t("password")}</span>
            <input
              required
              type="password"
              minLength={8}
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span>{t("platformRole")}</span>
            <select
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={role}
              onChange={(event) => setRole(event.target.value as PlatformRole)}
            >
              {PLATFORM_ROLES.map((item) => (
                <option key={item} value={item}>
                  {t(item)}
                </option>
              ))}
            </select>
          </label>
          <PageAccessFields value={pagesForPlatformRole(role)} onChange={() => undefined} disabled />
          <Button type="submit" disabled={pending}>
            {pending ? t("saving") : t("createUser")}
          </Button>
        </form>
      </section>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("platformRoles")}</h2>
        <p className="text-muted-foreground text-sm">{t("platformRolesHint")}</p>
        <ul className="grid gap-2 text-sm">
          {PLATFORM_ROLES.map((item) => (
            <li key={item} className="rounded-md border border-border p-3">
              <p className="font-medium">{t(item)}</p>
              <p className="text-muted-foreground">
                {pagesForPlatformRole(item)
                  .map((page) => t(page))
                  .join(" · ") || t("noPages")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("users")}</h2>
        {loading ? <p className="text-muted-foreground text-sm">…</p> : null}
        {!loading && users.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("usersEmpty")}</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {users.map((user) => (
              <li key={user.id} className="grid gap-2 rounded-md border border-border p-3">
                <p>{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
                <label className="grid gap-1">
                  <span>{t("platformRole")}</span>
                  <select
                    className="border-input bg-background rounded-md border px-2 py-1.5"
                    value={isPlatformRole(roleLabel(user.role)) ? roleLabel(user.role) : "jobseeker"}
                    onChange={async (event) => {
                      const nextRole = event.target.value as PlatformRole
                      setError(null)
                      const result = await authClient.admin.setRole({
                        userId: user.id,
                        role: nextRole,
                      })
                      if (result.error) {
                        setError(result.error.message ?? t("setRoleError"))
                        return
                      }
                      await refresh()
                    }}
                  >
                    {PLATFORM_ROLES.map((item) => (
                      <option key={item} value={item}>
                        {t(item)}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="text-muted-foreground">
                  {pagesForPlatformRole(roleLabel(user.role))
                    .map((page) => t(page))
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  )
}
