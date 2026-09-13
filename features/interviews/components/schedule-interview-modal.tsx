"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useScheduleInterview } from "../actions/interview.mutate"
import type { InterviewMode } from "../schema"

export function ScheduleInterviewModal({
  applicationId,
  open,
  onClose,
}: {
  applicationId: string
  open: boolean
  onClose: () => void
}) {
  const t = useTranslations("Interview")
  const schedule = useScheduleInterview()
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")
  const [mode, setMode] = useState<InterviewMode>("PHYSICAL")
  const [location, setLocation] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (!open) {
    return null
  }

  const missingPlace = mode === "PHYSICAL" ? !location.trim() : !meetingLink.trim()
  const invalid = !interviewDate || !interviewTime || missingPlace

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        role="dialog"
        aria-modal="true"
        className="bg-background grid w-full max-w-md gap-3 rounded-lg border border-border p-4 shadow-lg text-sm"
        onSubmit={async (event) => {
          event.preventDefault()
          setError(null)
          if (invalid) {
            setError(t("invalid"))
            return
          }
          try {
            await schedule.mutateAsync({
              applicationId,
              interviewDate,
              interviewTime,
              mode,
              location: mode === "PHYSICAL" ? location.trim() : undefined,
              meetingLink: mode === "ONLINE" ? meetingLink.trim() : undefined,
              notes: notes.trim() || undefined,
            })
            onClose()
          } catch {
            setError(t("error"))
          }
        }}
      >
        <h2 className="font-medium">{t("scheduleTitle")}</h2>
        <label className="grid gap-1">
          <span>{t("date")}</span>
          <input
            required
            type="date"
            className="border-input bg-background rounded-md border px-2 py-1.5"
            value={interviewDate}
            onChange={(event) => setInterviewDate(event.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span>{t("time")}</span>
          <input
            required
            type="time"
            className="border-input bg-background rounded-md border px-2 py-1.5"
            value={interviewTime}
            onChange={(event) => setInterviewTime(event.target.value)}
          />
        </label>
        <fieldset className="grid gap-2">
          <legend>{t("mode")}</legend>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === "PHYSICAL"}
              onChange={() => setMode("PHYSICAL")}
            />
            <span>{t("physical")}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === "ONLINE"}
              onChange={() => setMode("ONLINE")}
            />
            <span>{t("online")}</span>
          </label>
        </fieldset>
        {mode === "PHYSICAL" ? (
          <label className="grid gap-1">
            <span>{t("location")}</span>
            <input
              required
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </label>
        ) : (
          <label className="grid gap-1">
            <span>{t("meetingLink")}</span>
            <input
              required
              type="url"
              className="border-input bg-background rounded-md border px-2 py-1.5"
              value={meetingLink}
              onChange={(event) => setMeetingLink(event.target.value)}
            />
          </label>
        )}
        <label className="grid gap-1">
          <span>{t("notes")}</span>
          <textarea
            className="border-input bg-background min-h-20 rounded-md border px-2 py-1.5"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        {error ? <p className="text-destructive">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={schedule.isPending} onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={schedule.isPending || invalid}>
            {schedule.isPending ? t("saving") : t("submit")}
          </Button>
        </div>
      </form>
    </div>
  )
}
