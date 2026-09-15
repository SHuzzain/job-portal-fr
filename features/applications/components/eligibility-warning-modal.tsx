"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import type { EligibilityMismatch } from "../eligibility";

export function EligibilityWarningModal({
  open,
  mismatches,
  pending,
  onCancel,
  onContinue,
}: {
  open: boolean;
  mismatches: EligibilityMismatch[];
  pending: boolean;
  onCancel: () => void;
  onContinue: () => void;
}) {
  const t = useTranslations("Apply");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="grid w-full max-w-md gap-3 rounded-lg border border-border bg-background p-4 text-sm shadow-lg"
      >
        <h2 className="font-medium">{t("guardrailTitle")}</h2>
        <p className="text-muted-foreground">{t("guardrailHint")}</p>
        <ul className="grid list-disc gap-1 pl-5">
          {mismatches.map((item) => (
            <li key={item.criterion}>
              {t(`mismatch.${item.criterion}`, {
                preferred: item.preferred,
                actual: item.actual,
              })}
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onCancel}
          >
            {t("guardrailCancel")}
          </Button>
          <Button type="button" disabled={pending} onClick={onContinue}>
            {pending ? t("saving") : t("guardrailContinue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
