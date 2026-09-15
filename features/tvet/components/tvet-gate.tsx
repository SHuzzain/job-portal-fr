"use client";

import { useTranslations } from "next-intl";

import { authClient } from "@/connector";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import {
  activeWorkspaceOf,
  canSwitchWorkspace,
} from "@/features/auth/lib/workspace";

type Props = {
  children: React.ReactNode;
  resource?: string;
  action?: string;
};

export function TvetGate({
  children,
  resource = "tvet_rfp",
  action = "view",
}: Props) {
  const t = useTranslations("TvetPage");
  const { data, isPending } = authClient.useSession();
  const capable = canSwitchWorkspace(data?.user);
  const inProviderWorkspace =
    activeWorkspaceOf(data?.user) === "training_provider";
  const blocked = !capable || !inProviderWorkspace;

  return (
    <PermissionGate resource={resource} action={action}>
      {isPending ? (
        <p className="text-sm text-muted-foreground">…</p>
      ) : blocked ? (
        <p className="text-sm">
          {capable ? t("needWorkspace") : t("needCapability")}
        </p>
      ) : (
        children
      )}
    </PermissionGate>
  );
}
