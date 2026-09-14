"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/connector"
import {
  BUILTIN_ORG_PAGES,
  RESERVED_ORG_ROLES,
  orgRolePermission,
  pagesFromPermission,
  slugRoleName,
  type PageAccess,
} from "../pages"
import { PageAccessFields } from "./page-access-fields"

type OrgRole = {
  id?: string
  role: string
  permission?: Record<string, string[]>
}

type OrgMember = {
  id: string
  role: string
  user?: { email?: string; name?: string }
}

function asRoles(payload: unknown): OrgRole[] {
  if (Array.isArray(payload)) {
    return payload.filter((role): role is OrgRole => Boolean(role && typeof role === "object" && "role" in role))
  }
  if (payload && typeof payload === "object" && "roles" in payload && Array.isArray(payload.roles)) {
    return asRoles(payload.roles)
  }
  return []
}

function asMembers(payload: unknown): OrgMember[] {
  if (!payload || typeof payload !== "object") {
    return []
  }
  const members = "members" in payload ? payload.members : payload
  if (!Array.isArray(members)) {
    return []
  }
  return members.filter((member): member is OrgMember => Boolean(member && typeof member === "object" && "id" in member))
}

export function OrgAccessPanel() {
  const t = useTranslations("Access")
  const { data: active } = authClient.useActiveOrganization()
  const [roles, setRoles] = useState<OrgRole[]>([])
  const [members, setMembers] = useState<OrgMember[]>([])
  const [roleName, setRoleName] = useState("")
  const [pages, setPages] = useState<PageAccess[]>(["employer_portal"])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("admin")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)

  const roleOptions = [
    ...RESERVED_ORG_ROLES.filter((role) => role !== "member"),
    ...roles.map((role) => role.role),
  ]

  async function refresh() {
    setLoading(true)
    const [roleResult, memberResult] = await Promise.all([
      authClient.organization.listRoles(),
      authClient.organization.listMembers(),
    ])
    setLoading(false)
    if (roleResult.error) {
      setError(roleResult.error.message ?? t("loadError"))
    } else {
      setRoles(asRoles(roleResult.data))
    }
    if (memberResult.error) {
      setError(memberResult.error.message ?? t("loadError"))
    } else {
      setMembers(asMembers(memberResult.data))
    }
  }

  useEffect(() => {
    if (!active?.id) {
      setLoading(false)
      return
    }
    void refresh()
  }, [active?.id])

  if (!active?.id) {
    return <p className="text-muted-foreground text-sm">{t("needCompany")}</p>
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <h2 className="font-medium">{t("createRole")}</h2>
        <p className="text-muted-foreground text-sm">{t("orgRoleHint")}</p>
        <form
          className="grid max-w-md gap-3 text-sm"
          onSubmit={async (event) => {
            event.preventDefault()
            const role = slugRoleName(roleName)
            if (!role || RESERVED_ORG_ROLES.includes(role as (typeof RESERVED_ORG_ROLES)[number])) {
              setError(t("invalidRole"))
              return
            }
            if (pages.length === 0) {
              setError(t("needPage"))
              return
            }
            setError(null)
            setPending(true)
            const result = await authClient.organization.createRole({
              role,
              permission: orgRolePermission(pages),
            })
            setPending(false)
            if (result.error) {
              setError(result.error.message ?? t("createRoleError"))
              return
            }
            setRoleName("")
            setPages(["employer_portal"])
            await refresh()
          }}
        >
          <label className="grid gap-1">
            <span>{t("roleName")}</span>
            <input
              required
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              placeholder="hr"
            />
          </label>
          <PageAccessFields value={pages} onChange={setPages} />
          <Button type="submit" disabled={pending}>
            {pending ? t("saving") : t("createRole")}
          </Button>
        </form>
      </section>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("orgRoles")}</h2>
        <ul className="grid gap-2 text-sm">
          {RESERVED_ORG_ROLES.filter((role) => role !== "member").map((role) => (
            <li key={role} className="rounded-md border border-border p-3">
              <p className="font-medium">{role}</p>
              <p className="text-muted-foreground">
                {BUILTIN_ORG_PAGES[role].map((page) => t(page)).join(" · ")}
              </p>
              <p className="text-muted-foreground">{t("builtinRole")}</p>
            </li>
          ))}
          {roles.map((role) => (
            <li key={role.id ?? role.role} className="grid gap-2 rounded-md border border-border p-3">
              <p className="font-medium">{role.role}</p>
              <p className="text-muted-foreground">
                {pagesFromPermission(role.permission)
                  .map((page) => t(page))
                  .join(" · ") || t("noPages")}
              </p>
              <Button
                size="xs"
                variant="outline"
                onClick={async () => {
                  setError(null)
                  const result = role.id
                    ? await authClient.organization.deleteRole({ roleId: role.id })
                    : await authClient.organization.deleteRole({ roleName: role.role })
                  if (result.error) {
                    setError(result.error.message ?? t("deleteRoleError"))
                    return
                  }
                  await refresh()
                }}
              >
                {t("deleteRole")}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("inviteMember")}</h2>
        <p className="text-muted-foreground text-sm">{t("inviteHint")}</p>
        <form
          className="grid max-w-md gap-3 text-sm"
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)
            setPending(true)
            const result = await authClient.organization.inviteMember({
              email: inviteEmail,
              role: inviteRole,
            })
            setPending(false)
            if (result.error) {
              setError(result.error.message ?? t("inviteError"))
              return
            }
            setInviteEmail("")
            await refresh()
          }}
        >
          <label className="grid gap-1">
            <span>{t("email")}</span>
            <input
              required
              type="email"
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span>{t("orgRole")}</span>
            <select
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={inviteRole}
              onChange={(event) => setInviteRole(event.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" disabled={pending}>
            {pending ? t("saving") : t("inviteMember")}
          </Button>
        </form>
      </section>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("members")}</h2>
        {loading ? <p className="text-muted-foreground text-sm">…</p> : null}
        {!loading && members.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("membersEmpty")}</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {members.map((member) => (
              <li key={member.id} className="grid gap-2 rounded-md border border-border p-3">
                <p>{member.user?.name ?? member.user?.email ?? member.id}</p>
                <p className="text-muted-foreground">{member.user?.email}</p>
                <label className="grid gap-1">
                  <span>{t("orgRole")}</span>
                  <select
                    className="border-input bg-background rounded-md border px-2 py-1.5"
                    value={member.role}
                    onChange={async (event) => {
                      setError(null)
                      const result = await authClient.organization.updateMemberRole({
                        memberId: member.id,
                        role: event.target.value,
                      })
                      if (result.error) {
                        setError(result.error.message ?? t("setRoleError"))
                        return
                      }
                      await refresh()
                    }}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  )
}
