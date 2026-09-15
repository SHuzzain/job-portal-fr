import { getTranslations } from "next-intl/server"
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-medium">{t("signInTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("signInHint")}</p>
      </div>
      <SignInForm nextPath={nextPath} />
      <NavButton href="/sign-up" variant="outline">
        {t("needAccount")}
      </NavButton>
    </div>
  )
}
