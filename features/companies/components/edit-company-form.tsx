"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { authClient } from "@/connector";
import { useRouter } from "@/i18n/navigation";

import { useResubmitCompany } from "../actions/company.mutate";
import { companyCreateSchema } from "../schema";

export function EditCompanyForm({
  organizationId,
}: {
  organizationId: string;
}) {
  const t = useTranslations("Company");
  const router = useRouter();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const company = organizations?.find((item) => item.id === organizationId);
  const resubmit = useResubmitCompany();
  const [name, setName] = useState<string | null>(null);
  const [ssmNumber, setSsmNumber] = useState<string | null>(null);
  const [ssmDocumentUrl, setSsmDocumentUrl] = useState<string | null>(null);
  const [legalName, setLegalName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (!company) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  const currentName = name ?? company.name;
  const currentSsm = ssmNumber ?? company.ssmNumber ?? "";
  const currentUrl = ssmDocumentUrl ?? company.ssmDocumentUrl ?? "";
  const currentLegal = legalName ?? company.legalName ?? "";

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(false);
        const parsed = companyCreateSchema.safeParse({
          name: currentName,
          ssmNumber: currentSsm,
          ssmDocumentUrl: currentUrl,
          legalName: currentLegal || undefined,
        });
        if (!parsed.success) {
          setError(t("invalid"));
          return;
        }
        setPending(true);
        const result = await authClient.organization.update({
          organizationId,
          data: {
            name: parsed.data.name,
            ssmNumber: parsed.data.ssmNumber,
            ssmDocumentUrl: parsed.data.ssmDocumentUrl,
            legalName: parsed.data.legalName ?? "",
            industry: company.industry ?? "",
            website: company.website ?? "",
            address: company.address ?? "",
          },
        });
        if (result.error) {
          setPending(false);
          setError(result.error.message ?? t("resubmitError"));
          return;
        }
        try {
          await resubmit.mutateAsync(organizationId);
          setSuccess(true);
          router.push("/employer");
        } catch {
          setError(t("resubmitError"));
        } finally {
          setPending(false);
        }
      }}
    >
      {company.status === "RETURNED_FOR_CORRECTION" && company.reviewNotes ? (
        <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-3 text-yellow-950 dark:border-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-50">
          <p>{t("returnedFeedback", { notes: company.reviewNotes })}</p>
        </div>
      ) : null}
      <label className="grid gap-1">
        <span>{t("name")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentName}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("ssmNumber")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentSsm}
          onChange={(event) => setSsmNumber(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("ssmDocumentUrl")}</span>
        <input
          required
          type="url"
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentUrl}
          onChange={(event) => setSsmDocumentUrl(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("legalName")}</span>
        <input
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentLegal}
          onChange={(event) => setLegalName(event.target.value)}
        />
      </label>
      <Button type="submit" disabled={pending || resubmit.isPending}>
        {pending || resubmit.isPending ? t("saving") : t("saveResubmit")}
      </Button>
      {success ? <p>{t("resubmitSuccess")}</p> : null}
      {error ? <p className="text-destructive">{error}</p> : null}
    </form>
  );
}
