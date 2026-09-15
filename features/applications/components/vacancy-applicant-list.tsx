"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { InterviewDetails } from "@/features/interviews/components/interview-details";
import { ScheduleInterviewModal } from "@/features/interviews/components/schedule-interview-modal";

import {
  useFollowUp,
  useSetApplicationStatus,
} from "../actions/application.mutate";
import { vacancyApplicationsQueryOptions } from "../queries/options";
import type { EmployerSetStatus } from "../schema";
import { ApplicationStatusBadge } from "./application-status-badge";

const statuses: EmployerSetStatus[] = [
  "SHORTLISTED",
  "INTERVIEW_COMPLETED",
  "REJECTED",
  "HIRED",
];

export function VacancyApplicantList({ vacancyId }: { vacancyId: string }) {
  const t = useTranslations("EmployerApplicants");
  const { data, isPending, isError } = useQuery(
    vacancyApplicationsQueryOptions(vacancyId)
  );
  const setStatus = useSetApplicationStatus();
  const followUp = useFollowUp();
  const [scheduleId, setScheduleId] = useState<string | null>(null);

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (isError || !data?.length) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="grid gap-3 text-sm">
      {data.map((application) => (
        <li
          key={application.id}
          className="grid gap-2 rounded-md border border-border p-3"
        >
          <p>{application.userId}</p>
          <ApplicationStatusBadge status={application.status} />
          {application.interview &&
          application.interview.status !== "CANCELLED" ? (
            <InterviewDetails interview={application.interview} />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                size="xs"
                variant={application.status === status ? "default" : "outline"}
                disabled={setStatus.isPending}
                onClick={() => setStatus.mutate({ id: application.id, status })}
              >
                {t(
                  (
                    {
                      SHORTLISTED: "shortlisted",
                      INTERVIEW_COMPLETED: "interviewCompleted",
                      REJECTED: "rejected",
                      HIRED: "hired",
                    } as const
                  )[status]
                )}
              </Button>
            ))}
            {application.status === "SHORTLISTED" ||
            application.status === "WAITING_FOR_INTERVIEW" ? (
              <Button
                size="xs"
                variant="secondary"
                onClick={() => setScheduleId(application.id)}
              >
                {t("scheduleInterview")}
              </Button>
            ) : null}
            <Button
              size="xs"
              variant="ghost"
              disabled={followUp.isPending}
              onClick={() => followUp.mutate(application.id)}
            >
              {t("followUp")}
            </Button>
          </div>
        </li>
      ))}
      <ScheduleInterviewModal
        applicationId={scheduleId ?? ""}
        open={scheduleId !== null}
        onClose={() => setScheduleId(null)}
      />
    </ul>
  );
}
