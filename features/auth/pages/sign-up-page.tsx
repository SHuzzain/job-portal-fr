import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export default async function SignUpPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-medium">{t("signUpTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("signUpHint")}</p>
      </div>
      <SignUpForm />
      <NavButton href="/sign-in" variant="outline">
        {t("haveAccount")}
      </NavButton>
    </div>
  );
}
