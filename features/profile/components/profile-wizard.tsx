"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useUpdateProfile } from "../actions/profile.mutate"
import { myProfileQueryOptions } from "../queries/options"
import { draftToUpdate, useProfileWizard } from "../stores/profile-wizard"

export function ProfileWizard() {
  const t = useTranslations("SeekerProfile")
  const { data } = useQuery(myProfileQueryOptions())
  const { step, draft, hydrated, setStep, updateDraft, hydrate } = useProfileWizard()
  const updateProfile = useUpdateProfile()

  useEffect(() => {
    if (data && !hydrated) {
      hydrate(data)
    }
  }, [data, hydrate, hydrated])

  return (
    <div className="grid max-w-md gap-4 text-sm">
      <p className="text-muted-foreground">{t("step", { current: step, total: 5 })}</p>
      {data?.complete ? <p>{t("complete")}</p> : <p className="text-muted-foreground">{t("incomplete")}</p>}

      {step === 1 ? (
        <div className="grid gap-3">
          <Field label={t("displayName")} value={draft.displayName} onChange={(value) => updateDraft({ displayName: value })} />
          <Field label={t("icNumber")} value={draft.icNumber} onChange={(value) => updateDraft({ icNumber: value })} />
          <Field label={t("dateOfBirth")} type="date" value={draft.dateOfBirth} onChange={(value) => updateDraft({ dateOfBirth: value })} />
          <label className="grid gap-1">
            <span>{t("gender")}</span>
            <select
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={draft.gender}
              onChange={(event) =>
                updateDraft({ gender: event.target.value as typeof draft.gender })
              }
            >
              <option value="">{t("select")}</option>
              <option value="MALE">{t("male")}</option>
              <option value="FEMALE">{t("female")}</option>
              <option value="OTHER">{t("other")}</option>
            </select>
          </label>
          <Field label={t("city")} value={draft.city} onChange={(value) => updateDraft({ city: value })} />
          <Button type="button" onClick={() => setStep(2)}>
            {t("next")}
          </Button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-3">
          <Field label={t("highestEducation")} value={draft.highestEducation} onChange={(value) => updateDraft({ highestEducation: value })} />
          <Field label={t("fieldOfStudy")} value={draft.fieldOfStudy} onChange={(value) => updateDraft({ fieldOfStudy: value })} />
          <StepNav onBack={() => setStep(1)} onNext={() => setStep(3)} back={t("backStep")} next={t("next")} />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-3">
          <Field
            label={t("yearsOfExperience")}
            type="number"
            value={draft.yearsOfExperience}
            onChange={(value) => updateDraft({ yearsOfExperience: value })}
          />
          <label className="grid gap-1">
            <span>{t("skills")}</span>
            <textarea
              className="border-input bg-background min-h-24 rounded-md border px-2 py-1.5"
              value={draft.skills}
              onChange={(event) => updateDraft({ skills: event.target.value })}
            />
          </label>
          <StepNav onBack={() => setStep(2)} onNext={() => setStep(4)} back={t("backStep")} next={t("next")} />
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-3">
          <Field label={t("preferredLocation")} value={draft.preferredLocation} onChange={(value) => updateDraft({ preferredLocation: value })} />
          <label className="grid gap-1">
            <span>{t("preferredEmploymentType")}</span>
            <select
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={draft.preferredEmploymentType}
              onChange={(event) =>
                updateDraft({
                  preferredEmploymentType: event.target
                    .value as typeof draft.preferredEmploymentType,
                })
              }
            >
              <option value="">{t("select")}</option>
              <option value="FULL_TIME">{t("fullTime")}</option>
              <option value="PART_TIME">{t("partTime")}</option>
              <option value="CONTRACT">{t("contract")}</option>
              <option value="INTERNSHIP">{t("internship")}</option>
            </select>
          </label>
          <StepNav onBack={() => setStep(3)} onNext={() => setStep(5)} back={t("backStep")} next={t("next")} />
        </div>
      ) : null}

      {step === 5 ? (
        <div className="grid gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.isMalaysian}
              onChange={(event) => updateDraft({ isMalaysian: event.target.checked })}
            />
            <span>{t("isMalaysian")}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.hasWorkPermit}
              onChange={(event) => updateDraft({ hasWorkPermit: event.target.checked })}
            />
            <span>{t("hasWorkPermit")}</span>
          </label>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(4)}>
              {t("backStep")}
            </Button>
            <Button
              type="button"
              disabled={updateProfile.isPending}
              onClick={() => updateProfile.mutate(draftToUpdate(draft))}
            >
              {updateProfile.isPending ? t("saving") : t("save")}
            </Button>
          </div>
          {updateProfile.isError ? <p className="text-destructive">{t("error")}</p> : null}
          {updateProfile.isSuccess ? <p>{t("saved")}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
}) {
  return (
    <label className="grid gap-1">
      <span>{label}</span>
      <input
        type={type}
        className="border-input bg-background rounded-md border px-2 py-1.5"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

function StepNav({
  onBack,
  onNext,
  back,
  next,
}: {
  onBack: () => void
  onNext: () => void
  back: string
  next: string
}) {
  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" onClick={onBack}>
        {back}
      </Button>
      <Button type="button" onClick={onNext}>
        {next}
      </Button>
    </div>
  )
}
