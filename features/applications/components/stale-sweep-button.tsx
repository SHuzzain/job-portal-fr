"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { useMarkStaleApplications } from "../actions/application.mutate";
import { applicationKeys } from "../queries/keys";

export function StaleSweepButton() {
  const t = useTranslations("EmployerVacancies");
  const queryClient = useQueryClient();
  const sweep = useMarkStaleApplications();

  return (
    <div className="grid gap-1 text-sm">
      <Button
        size="sm"
        variant="outline"
        disabled={sweep.isPending}
        onClick={() =>
          sweep.mutate(undefined, {
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: applicationKeys.all,
              });
            },
          })
        }
      >
        {sweep.isPending ? t("staleSaving") : t("stale")}
      </Button>
      {sweep.isSuccess ? (
        <p className="text-muted-foreground">
          {t("staleDone", { count: sweep.data.marked })}
        </p>
      ) : null}
    </div>
  );
}
