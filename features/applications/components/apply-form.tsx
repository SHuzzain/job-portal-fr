"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";
import { Button } from "@/components/ui/button";
import { myProfileQueryOptions } from "@/features/profile/queries/options";
import { myResumesQueryOptions } from "@/features/resumes/queries/options";
import type { Vacancy } from "@/features/vacancies/schema";

import { applyErrorMessage, useApply } from "../actions/application.mutate";
import { unmatchedVacancyCriteria } from "../eligibility";
import { EligibilityWarningModal } from "./eligibility-warning-modal";

export function ApplyForm({ vacancy }: { vacancy: Vacancy }) {
  const t = useTranslations("Apply");
  const { data: profile } = useQuery(myProfileQueryOptions());
  const { data: resumes } = useQuery(myResumesQueryOptions());
  const apply = useApply();
  const [resumeId, setResumeId] = useState("");
  const [showWarning, setShowWarning] = useState(false);

  if (profile && !profile.complete) {
    return (
      <div className="grid gap-2 text-sm">
        <p>{t("needProfile")}</p>
        <NavButton href="/seeker/profile">{t("goProfile")}</NavButton>
      </div>
    );
  }

  if (resumes && resumes.length === 0) {
    return (
      <div className="grid gap-2 text-sm">
        <p>{t("needResume")}</p>
        <NavButton href="/seeker/resumes">{t("goResumes")}</NavButton>
      </div>
    );
  }

  const mismatches = profile ? unmatchedVacancyCriteria(vacancy, profile) : [];

  function submit() {
    if (!resumeId) {
      return;
    }
    apply.mutate({ vacancyId: vacancy.id, resumeId });
  }

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault();
        if (!resumeId) {
          return;
        }
        if (mismatches.length) {
          setShowWarning(true);
          return;
        }
        submit();
      }}
    >
      <label className="grid gap-1">
        <span>{t("resume")}</span>
        <select
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={resumeId}
          onChange={(event) => setResumeId(event.target.value)}
        >
          <option value="">{t("selectResume")}</option>
          {resumes?.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.title}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" disabled={apply.isPending || !resumeId}>
        {apply.isPending ? t("saving") : t("submit")}
      </Button>
      {apply.isError ? (
        <p className="text-destructive">
          {applyErrorMessage(apply.error, t("error"))}
        </p>
      ) : null}
      {apply.isSuccess ? <p>{t("success")}</p> : null}
      <EligibilityWarningModal
        open={showWarning}
        mismatches={mismatches}
        pending={apply.isPending}
        onCancel={() => setShowWarning(false)}
        onContinue={() => {
          submit();
          setShowWarning(false);
        }}
      />
    </form>
  );
}
