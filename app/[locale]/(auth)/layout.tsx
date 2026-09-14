import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"

type Props = {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: Props) {
  const t = await getTranslations("Nav")

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between gap-3 px-6 py-4">
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <LocaleSwitcher />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 pb-10">
        {children}
      </main>
    </div>
  )
}
