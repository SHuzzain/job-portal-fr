"use client";

import { useTranslations } from "next-intl";

import { authClient } from "@/connector";
import { useRouter } from "@/i18n/navigation";

import { ReturnedCompanyBanner } from "./returned-company-banner";

type CompanySwitcherProps = {
  currentSlug?: string;
};

export function CompanySwitcher({ currentSlug }: CompanySwitcherProps) {
  const t = useTranslations("Company");
  const router = useRouter();
  const { data: organizations, isPending } = authClient.useListOrganizations();
  const { data: active } = authClient.useActiveOrganization();

  if (isPending) {
    return <p className="text-xs text-muted-foreground">Loading workspace…</p>;
  }

  if (!organizations?.length) {
    return (
      <div className="rounded-md border border-dashed border-border p-2.5 text-xs text-muted-foreground">
        No companies registered.
      </div>
    );
  }

  // Active by current slug if provided, else Better Auth active
  const selectedOrg = currentSlug
    ? (organizations.find((org) => org.slug === currentSlug) ?? active)
    : active;

  return (
    <div className="grid gap-2">
      <ReturnedCompanyBanner />
      <label className="grid gap-1 text-xs">
        <select
          className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium focus:ring-1 focus:ring-ring focus:outline-none"
          value={selectedOrg?.id ?? ""}
          onChange={async (event) => {
            const organizationId = event.target.value;
            const targetOrg = organizations.find(
              (org) => org.id === organizationId
            );
            if (targetOrg) {
              await authClient.organization.setActive({
                organizationId: targetOrg.id,
              });
              router.push(`/employer/${targetOrg.slug}/dashboard`);
              router.refresh();
            }
          }}
        >
          <option value="" disabled>
            {t("select")}
          </option>
          {organizations.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.name} ({organization.status ?? "PENDING"})
            </option>
          ))}
        </select>
        {selectedOrg?.status &&
        selectedOrg.status !== "APPROVED" &&
        selectedOrg.status !== "RETURNED_FOR_CORRECTION" ? (
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            {t("pendingHint")}
          </p>
        ) : null}
      </label>
    </div>
  );
}
