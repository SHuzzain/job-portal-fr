import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SignUpForm } from "@/features/auth/components/sign-up-form"

export default async function SignUpPage() {
  const t = await getTranslations("Auth")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <LocaleSwitcher />
      </div>
      <div>
        <h1 className="font-medium">{t("signUpTitle")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("signUpHint")}</p>
      </div>
      <SignUpForm />
      <NavButton href="/sign-in" variant="outline">
        {t("haveAccount")}
      </NavButton>
    </div>
  )
}
