"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export function JobFilters({
  q = "",
  location = "",
  employmentType = "",
}: {
  q?: string;
  location?: string;
  employmentType?: string;
}) {
  const t = useTranslations("JobsPage");
  const router = useRouter();
  const [draftQ, setDraftQ] = useState(q);
  const [draftLocation, setDraftLocation] = useState(location);
  const [draftType, setDraftType] = useState(employmentType);

  return (
    <form
      className="grid gap-3 text-sm sm:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (draftQ) params.set("q", draftQ);
        if (draftLocation) params.set("location", draftLocation);
        if (draftType) params.set("employmentType", draftType);
        const query = params.toString();
        router.push(query ? `/jobs?${query}` : "/jobs");
      }}
    >
      <input
        className="rounded-md border border-input bg-background px-2 py-1.5"
        placeholder={t("search")}
        value={draftQ}
        onChange={(event) => setDraftQ(event.target.value)}
      />
      <input
        className="rounded-md border border-input bg-background px-2 py-1.5"
        placeholder={t("location")}
        value={draftLocation}
        onChange={(event) => setDraftLocation(event.target.value)}
      />
      <select
        className="rounded-md border border-input bg-background px-2 py-1.5"
        value={draftType}
        onChange={(event) => setDraftType(event.target.value)}
      >
        <option value="">{t("anyType")}</option>
        <option value="FULL_TIME">{t("fullTime")}</option>
        <option value="PART_TIME">{t("partTime")}</option>
        <option value="CONTRACT">{t("contract")}</option>
        <option value="INTERNSHIP">{t("internship")}</option>
      </select>
      <Button type="submit" className="sm:col-span-3">
        {t("filter")}
      </Button>
    </form>
  );
}
