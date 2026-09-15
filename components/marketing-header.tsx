"use client";

import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavButton } from "@/components/nav-button";
import { authClient } from "@/connector";
import { SessionActions } from "@/features/auth/components/session-actions";

export function MarketingHeader() {
  const t = useTranslations("Nav");
  const { data } = authClient.useSession();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
      <nav
        className="flex flex-wrap items-center gap-2"
        aria-label={t("public")}
      >
        <NavButton href="/" variant="ghost">
          {t("home")}
        </NavButton>
        <NavButton href="/jobs" variant="ghost">
          {t("jobs")}
        </NavButton>
      </nav>
      <div className="flex flex-wrap items-center gap-2">
        {data ? (
          <SessionActions />
        ) : (
          <>
            <NavButton href="/sign-in" variant="ghost">
              {t("signIn")}
            </NavButton>
            <NavButton href="/sign-up" variant="outline">
              {t("signUp")}
            </NavButton>
          </>
        )}
        <LocaleSwitcher />
      </div>
    </header>
  );
}
