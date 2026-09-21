import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { RoleSignUpForm } from "@/features/auth/components/role-signup-form";

export default async function EmployerRegisterPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <NavButton href="/register" variant="ghost" className="mb-2 -ml-3">
          ← Back to selection
        </NavButton>
        <h1 className="text-xl font-semibold">Employer Registration</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register your company account to post vacancies and manage applicants.
        </p>
      </div>

      <RoleSignUpForm defaultRole="employer" redirectPath="/employer" />

      <div className="border-t border-border pt-4">
        <NavButton href="/sign-in" variant="outline" className="w-full">
          {t("haveAccount")}
        </NavButton>
      </div>
    </div>
  );
}
