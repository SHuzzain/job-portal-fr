"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { useCreateVacancy } from "../actions/vacancy.mutate";
import { vacancyEmploymentTypeSchema } from "../schema";
import { useVacancyWizard } from "../stores/vacancy-wizard";

const employmentTypes = vacancyEmploymentTypeSchema.options;

export function VacancyWizard() {
  const t = useTranslations("CreateVacancy");
  const { step, draft, setStep, updateDraft, reset } = useVacancyWizard();
  const createVacancy = useCreateVacancy();

  return (
    <div className="grid max-w-md gap-4 text-sm">
      <p className="text-muted-foreground">
        {t("step", { current: step, total: 3 })}
      </p>

      {step === 1 ? (
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span>{t("title")}</span>
            <input
              required
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={draft.title}
              onChange={(event) => updateDraft({ title: event.target.value })}
            />
          </label>
          <label className="grid gap-1">
            <span>{t("description")}</span>
            <textarea
              required
              className="min-h-24 rounded-md border border-input bg-background px-2 py-1.5"
              value={draft.description}
              onChange={(event) =>
                updateDraft({ description: event.target.value })
              }
            />
          </label>
          <Button
            type="button"
            disabled={!draft.title || !draft.description}
            onClick={() => setStep(2)}
          >
            {t("next")}
          </Button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span>{t("location")}</span>
            <input
              required
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={draft.location}
              onChange={(event) =>
                updateDraft({ location: event.target.value })
              }
            />
          </label>
          <label className="grid gap-1">
            <span>{t("employmentType")}</span>
            <select
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={draft.employmentType}
              onChange={(event) =>
                updateDraft({
                  employmentType: event.target
                    .value as typeof draft.employmentType,
                })
              }
            >
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`types.${type}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span>{t("minQualification")}</span>
            <input
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={draft.minQualification ?? ""}
              onChange={(event) =>
                updateDraft({ minQualification: event.target.value })
              }
            />
          </label>
          <label className="grid gap-1">
            <span>{t("preferredGender")}</span>
            <select
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={draft.preferredGender ?? ""}
              onChange={(event) =>
                updateDraft({
                  preferredGender: (event.target.value || undefined) as
                    "MALE" | "FEMALE" | undefined,
                })
              }
            >
              <option value="">{t("anyGender")}</option>
              <option value="MALE">{t("male")}</option>
              <option value="FEMALE">{t("female")}</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1">
              <span>{t("minAge")}</span>
              <input
                type="number"
                min={16}
                max={80}
                className="rounded-md border border-input bg-background px-2 py-1.5"
                value={draft.minAge ?? ""}
                onChange={(event) =>
                  updateDraft({
                    minAge: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  })
                }
              />
            </label>
            <label className="grid gap-1">
              <span>{t("maxAge")}</span>
              <input
                type="number"
                min={16}
                max={80}
                className="rounded-md border border-input bg-background px-2 py-1.5"
                value={draft.maxAge ?? ""}
                onChange={(event) =>
                  updateDraft({
                    maxAge: event.target.value
                      ? Number(event.target.value)
                      : undefined,
                  })
                }
              />
            </label>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              {t("backStep")}
            </Button>
            <Button
              type="button"
              disabled={!draft.location}
              onClick={() => setStep(3)}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-3">
          <dl className="grid gap-2">
            <div>
              <dt className="text-muted-foreground">{t("title")}</dt>
              <dd>{draft.title}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("location")}</dt>
              <dd>{draft.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("employmentType")}</dt>
              <dd>{t(`types.${draft.employmentType}`)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("description")}</dt>
              <dd>{draft.description}</dd>
            </div>
          </dl>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              {t("backStep")}
            </Button>
            <Button
              type="button"
              disabled={createVacancy.isPending}
              onClick={() =>
                createVacancy.mutate(
                  {
                    ...draft,
                    minQualification:
                      draft.minQualification?.trim() || undefined,
                    preferredGender: draft.preferredGender || undefined,
                  },
                  {
                    onSuccess: () => reset(),
                  }
                )
              }
            >
              {createVacancy.isPending ? t("saving") : t("submit")}
            </Button>
          </div>
          {createVacancy.isError ? (
            <p className="text-destructive">{t("error")}</p>
          ) : null}
          {createVacancy.isSuccess ? (
            <p className="text-muted-foreground">{t("success")}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
