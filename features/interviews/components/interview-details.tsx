"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import type { Interview } from "../schema";

export function InterviewDetails({ interview }: { interview: Interview }) {
  const t = useTranslations("Interview");
  const cancelled = interview.status === "CANCELLED";

  return (
    <div className="grid gap-1 rounded-md border border-border p-3 text-sm">
      <p className="font-medium">{t("title")}</p>
      <p>
        {t("date")}: {interview.interviewDate}
      </p>
      <p>
        {t("time")}: {interview.interviewTime}
      </p>
      <p>
        {t("mode")}: {t(`modes.${interview.mode}`)}
      </p>
      {interview.mode === "PHYSICAL" && interview.location ? (
        <p>
          {t("location")}: {interview.location}
        </p>
      ) : null}
      {interview.mode === "ONLINE" && interview.meetingLink ? (
        <p>
          {t("meetingLink")}:{" "}
          <a
            className="underline"
            href={interview.meetingLink}
            target="_blank"
            rel="noreferrer"
          >
            {interview.meetingLink}
          </a>
        </p>
      ) : null}
      {interview.notes ? (
        <p>
          {t("notes")}: {interview.notes}
        </p>
      ) : null}
      <p className="text-xs text-muted-foreground">
        {cancelled ? t("cancelled") : t(`statuses.${interview.status}`)}
      </p>
    </div>
  );
}
