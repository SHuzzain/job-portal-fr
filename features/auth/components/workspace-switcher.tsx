"use client";

import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { apiClient, authClient } from "@/connector";
import { useRouter } from "@/i18n/navigation";

import {
  type Workspace,
  activeWorkspaceOf,
  canSwitchWorkspace,
  portalHomeForWorkspace,
} from "../lib/workspace";

export function WorkspaceSwitcher() {
  const t = useTranslations("Workspace");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, refetch } = authClient.useSession();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canSwitchWorkspace(data?.user)) {
    return null;
  }

  const current = activeWorkspaceOf(data?.user);
  const next: Workspace =
    current === "training_provider" ? "employer" : "training_provider";

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted-foreground">
        {current === "training_provider"
          ? t("trainingProvider")
          : t("employer")}
      </span>
      <Button
        size="xs"
        variant="outline"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError(null);
          try {
            await apiClient("/users/me/workspace", {
              method: "PATCH",
              body: { workspace: next },
            });
            await authClient.getSession({
              query: { disableCookieCache: true },
            });
            await refetch();
            await queryClient.invalidateQueries();
            router.refresh();
            router.push(portalHomeForWorkspace(next));
          } catch {
            setError(t("switchError"));
          } finally {
            setPending(false);
          }
        }}
      >
        {pending
          ? t("switching")
          : next === "training_provider"
            ? t("switchToProvider")
            : t("switchToEmployer")}
      </Button>
      {error ? <span className="text-destructive">{error}</span> : null}
    </div>
  );
}
