"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { tvetErrorMessage, useCreateSession } from "../actions/tvet.mutate";

type Props = {
  rfpId: string;
};

function toIso(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

export function CreateSessionForm({ rfpId }: Props) {
  const t = useTranslations("TvetPage");
  const createSession = useCreateSession();
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault();
        createSession.mutate(
          {
            rfpId,
            title,
            venue,
            startsAt: toIso(startsAt),
            endsAt: toIso(endsAt),
          },
          {
            onSuccess: () => {
              setTitle("");
              setVenue("");
              setStartsAt("");
              setEndsAt("");
            },
          }
        );
      }}
    >
      <label className="grid gap-1">
        <span>{t("sessionTitle")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("venue")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={venue}
          onChange={(event) => setVenue(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("startsAt")}</span>
        <input
          required
          type="datetime-local"
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={startsAt}
          onChange={(event) => setStartsAt(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("endsAt")}</span>
        <input
          required
          type="datetime-local"
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={endsAt}
          onChange={(event) => setEndsAt(event.target.value)}
        />
      </label>
      <Button type="submit" disabled={createSession.isPending}>
        {createSession.isPending ? t("saving") : t("createSession")}
      </Button>
      {createSession.isError ? (
        <p className="text-sm text-destructive">
          {tvetErrorMessage(createSession.error, t("error"))}
        </p>
      ) : null}
    </form>
  );
}
