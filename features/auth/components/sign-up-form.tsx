"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/connector"
import { useRouter } from "@/i18n/navigation"

export function SignUpForm() {
  const t = useTranslations("Auth")
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"employer" | "jobseeker">("employer")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={async (event) => {
        event.preventDefault()
        setError(null)
        setPending(true)
        const result = await authClient.signUp.email(
          { name, email, password },
          { body: { accountType: role } },
        )
        setPending(false)
        if (result.error) {
          setError(result.error.message ?? t("signUpError"))
          return
        }
        router.push(role === "employer" ? "/employer" : "/seeker")
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
        <span>{t("accountType")}</span>
        <select
          className="border-input bg-background rounded-md border px-2 py-1.5"
          value={role}
          onChange={(event) => setRole(event.target.value as "employer" | "jobseeker")}
        >
          <option value="employer">{t("employer")}</option>
          <option value="jobseeker">{t("jobseeker")}</option>
        </select>
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? t("signingUp") : t("signUp")}
      </Button>
      {error ? <p className="text-destructive">{error}</p> : null}
    </form>
  )
}
