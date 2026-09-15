"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

import {
  useResubmitVacancy,
  useUpdateVacancy,
} from "../actions/vacancy.mutate";
import { mineVacancyQueryOptions } from "../queries/options";
import { vacancyEmploymentTypeSchema } from "../schema";

const employmentTypes = vacancyEmploymentTypeSchema.options;

export function EditVacancyForm({ vacancyId }: { vacancyId: string }) {
  const t = useTranslations("EmployerVacancies");
  const createT = useTranslations("CreateVacancy");
  const router = useRouter();
  const { data, isPending, isError } = useQuery(
    mineVacancyQueryOptions(vacancyId)
  );
  const updateVacancy = useUpdateVacancy();
  const resubmit = useResubmitVacancy();
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [minQualification, setMinQualification] = useState<string | null>(null);
  const [preferredGender, setPreferredGender] = useState<string | null>(null);
  const [minAge, setMinAge] = useState<string | null>(null);
  const [maxAge, setMaxAge] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  const currentTitle = title ?? data.title;
  const currentDescription = description ?? data.description;
  const currentLocation = location ?? data.location;
  const currentType = vacancyEmploymentTypeSchema.parse(
    employmentType ?? data.employmentType
  );
  const currentQualification = minQualification ?? data.minQualification ?? "";
  const currentGender = preferredGender ?? data.preferredGender ?? "";
  const currentMinAge =
    minAge ?? (data.minAge !== null ? String(data.minAge) : "");
  const currentMaxAge =
    maxAge ?? (data.maxAge !== null ? String(data.maxAge) : "");
  const busy = updateVacancy.isPending || resubmit.isPending;

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        try {
          await updateVacancy.mutateAsync({
            id: vacancyId,
            body: {
              title: currentTitle,
              description: currentDescription,
              location: currentLocation,
              employmentType: currentType,
              minQualification: currentQualification.trim() || undefined,
              preferredGender: (currentGender || undefined) as
                "MALE" | "FEMALE" | undefined,
              minAge: currentMinAge ? Number(currentMinAge) : undefined,
              maxAge: currentMaxAge ? Number(currentMaxAge) : undefined,
            },
          });
          await resubmit.mutateAsync(vacancyId);
          router.push("/employer/vacancies");
        } catch {
          setError(t("resubmitError"));
        }
      }}
    >
      {data.status === "RETURNED_FOR_CORRECTION" && data.reviewNotes ? (
        <div className="rounded-lg border border-yellow-400 bg-yellow-50 p-3 text-yellow-950 dark:border-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-50">
          <p>{t("returnedFeedback", { notes: data.reviewNotes })}</p>
        </div>
      ) : null}
      <label className="grid gap-1">
        <span>{createT("title")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentTitle}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{createT("description")}</span>
        <textarea
          required
          className="min-h-24 rounded-md border border-input bg-background px-2 py-1.5"
          value={currentDescription}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{createT("location")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentLocation}
          onChange={(event) => setLocation(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{createT("employmentType")}</span>
        <select
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentType}
          onChange={(event) => setEmploymentType(event.target.value)}
        >
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {createT(`types.${type}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1">
        <span>{createT("minQualification")}</span>
        <input
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentQualification}
          onChange={(event) => setMinQualification(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{createT("preferredGender")}</span>
        <select
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={currentGender}
          onChange={(event) => setPreferredGender(event.target.value)}
        >
          <option value="">{createT("anyGender")}</option>
          <option value="MALE">{createT("male")}</option>
          <option value="FEMALE">{createT("female")}</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1">
          <span>{createT("minAge")}</span>
          <input
            type="number"
            min={16}
            max={80}
            className="rounded-md border border-input bg-background px-2 py-1.5"
            value={currentMinAge}
            onChange={(event) => setMinAge(event.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>{createT("maxAge")}</span>
          <input
            type="number"
            min={16}
            max={80}
            className="rounded-md border border-input bg-background px-2 py-1.5"
            value={currentMaxAge}
            onChange={(event) => setMaxAge(event.target.value)}
          />
        </label>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? t("saving") : t("saveResubmit")}
      </Button>
      {error ? <p className="text-destructive">{error}</p> : null}
    </form>
  );
}
