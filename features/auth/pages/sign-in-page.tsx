import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { SignInForm } from "@/features/auth/components/sign-in-form";

type Props = {
  searchParams: Promise<{ next?: string; addAccount?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const t = await getTranslations("Auth");
  const { next, addAccount } = await searchParams;
  const addingAccount = addAccount === "1";
  const nextPath = next?.startsWith("/")
    ? next
    : addingAccount
      ? "/settings"
      : "/employer";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-medium">
          {addingAccount ? t("addAccountTitle") : t("signInTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {addingAccount ? t("addAccountHint") : t("signInHint")}
        </p>
      </div>
      <SignInForm addAccount={addingAccount} nextPath={nextPath} />
      {addingAccount ? null : (
        <NavButton href="/sign-up" variant="outline">
          {t("needAccount")}
        </NavButton>
      )}
    </div>
  );
}
