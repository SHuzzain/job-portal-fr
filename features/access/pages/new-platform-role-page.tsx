import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { PlatformRoleForm } from "@/features/access/components/platform-role-form";
import { PermissionGate } from "@/features/auth/components/permission-gate";

export default async function NewPlatformRolePage() {
  const t = await getTranslations("Access");

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/pasak/access" variant="ghost">
          {t("backAccess")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("createRole")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("createRoleHint")}
        </p>
      </div>
      <PermissionGate resource="platform_role" action="create">
        <PlatformRoleForm />
      </PermissionGate>
    </div>
  );
}
