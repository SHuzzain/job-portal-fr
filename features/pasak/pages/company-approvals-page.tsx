import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { CompanyQueue } from "@/features/pasak/components/company-queue";

export default async function CompanyApprovalsPage() {
  const t = await getTranslations("Pasak");

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("companiesTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("companiesHint")}
        </p>
      </div>
      <PermissionGate resource="company_review" action="view">
        <CompanyQueue />
      </PermissionGate>
    </div>
  );
}
