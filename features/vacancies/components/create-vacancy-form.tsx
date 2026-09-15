"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { useCreateVacancy } from "../actions/vacancy.mutate";
import type { VacancyCreate } from "../schema";

const emptyDraft: VacancyCreate = {
  title: "",
  description: "",
  location: "",
  employmentType: "FULL_TIME",
};

export function CreateVacancyForm() {
  const t = useTranslations("CreateVacancy");
  const createVacancy = useCreateVacancy();
  const [draft, setDraft] = useState(emptyDraft);

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault();
        createVacancy.mutate(draft);
      }}
    >
      <label className="grid gap-1">
        <span>{t("title")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={draft.title}
          onChange={(event) =>
            setDraft({ ...draft, title: event.target.value })
          }
        />
      </label>
      <label className="grid gap-1">
        <span>{t("location")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={draft.location}
          onChange={(event) =>
            setDraft({ ...draft, location: event.target.value })
          }
        />
      </label>
      <label className="grid gap-1">
        <span>{t("description")}</span>
        <textarea
          required
          className="min-h-24 rounded-md border border-input bg-background px-2 py-1.5"
          value={draft.description}
          onChange={(event) =>
            setDraft({ ...draft, description: event.target.value })
          }
        />
      </label>
      <Button type="submit" disabled={createVacancy.isPending}>
        {createVacancy.isPending ? t("saving") : t("submit")}
      </Button>
      {createVacancy.isError ? (
        <p className="text-sm text-destructive">{t("error")}</p>
      ) : null}
      {createVacancy.isSuccess ? (
        <p className="text-sm text-muted-foreground">{t("success")}</p>
      ) : null}
    </form>
  );
}
