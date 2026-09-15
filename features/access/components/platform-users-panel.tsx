"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  accessErrorMessage,
  useAssignPlatformRole,
  useCreatePlatformUser,
} from "../actions/access.mutate"
import { platformRolesQueryOptions, platformUsersQueryOptions } from "../queries/options"
import { platformUserFormSchema } from "../schema"

export function PlatformUsersPanel() {
  const t = useTranslations("Access")
  const users = useQuery(platformUsersQueryOptions())
  const roles = useQuery(platformRolesQueryOptions())
  const createUser = useCreatePlatformUser()
  const assignRole = useAssignPlatformRole()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState<string | null>(null)

  const roleOptions = (roles.data ?? []).filter(
    (item) => item.name !== "training_provider",
  )
  const selectedRole = role || roleOptions[0]?.name || ""

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <div>
          <h2 className="font-medium">{t("createUser")}</h2>
          <p className="text-muted-foreground text-sm">{t("adminUserHint")}</p>
        </div>
        <form
          className="grid max-w-md gap-3 text-sm"
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)

            const parsed = platformUserFormSchema.safeParse({
              name,
              email,
              password,
              role: selectedRole,
            })
            if (!parsed.success) {
              setError(parsed.error.issues[0]?.message ?? t("createUserError"))
              return
            }

            try {
              await createUser.mutateAsync(parsed.data)
              setName("")
              setEmail("")
              setPassword("")
            } catch (mutationError) {
              setError(accessErrorMessage(mutationError, t("createUserError")))
            }
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
              value={selectedRole}
              onChange={(event) => setRole(event.target.value)}
            >
              {roleOptions.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" disabled={createUser.isPending || roles.isPending}>
            {createUser.isPending ? t("saving") : t("createUser")}
          </Button>
        </form>
      </section>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("users")}</h2>
        {users.isPending ? <p className="text-muted-foreground text-sm">…</p> : null}
        {users.error ? (
          <p className="text-destructive text-sm">
            {accessErrorMessage(users.error, t("loadError"))}
          </p>
        ) : null}
        {!users.isPending && (users.data ?? []).length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("usersEmpty")}</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {(users.data ?? []).map((user) => (
              <li key={user.id} className="grid gap-2 rounded-md border border-border p-3">
                <p>{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
                <label className="grid gap-1">
                  <span>{t("platformRole")}</span>
                  <select
                    className="border-input bg-background rounded-md border px-2 py-1.5"
                    value={user.role ?? ""}
                    onChange={async (event) => {
                      setError(null)
                      try {
                        await assignRole.mutateAsync({
                          userId: user.id,
                          role: event.target.value,
                        })
                      } catch (mutationError) {
                        setError(accessErrorMessage(mutationError, t("setRoleError")))
                      }
                    }}
                  >
                    {roleOptions.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.label}
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
