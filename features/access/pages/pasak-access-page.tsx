import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { AdminAccessPanel } from "@/features/access/components/admin-access-panel";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export default async function PasakAccessPage() {
  const t = await getTranslations("Access");

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak" variant="ghost">
          {t("backPasak")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("adminTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("adminHint")}</p>
      </div>
      <PermissionGate resource="platform_user" action="view">
        <AdminAccessPanel />
      </PermissionGate>
    </div>
  );
}
