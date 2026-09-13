import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SignInForm } from "@/features/auth/components/sign-in-form"

type Props = {
  searchParams: Promise<{ next?: string }>
}

export default async function SignInPage({ searchParams }: Props) {
  const t = await getTranslations("Auth")
  const { next } = await searchParams
  const nextPath = next?.startsWith("/") ? next : "/employer"

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <LocaleSwitcher />
      </div>
      <div>
        <h1 className="font-medium">{t("signInTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("signInHint")}</p>
      </div>
      <SignInForm nextPath={nextPath} />
      <NavButton href="/sign-up" variant="outline">
        {t("needAccount")}
      </NavButton>
    </div>
  )
}
