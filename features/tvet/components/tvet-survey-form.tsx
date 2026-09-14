"use client"

import { Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { tvetErrorMessage, useSubmitSurvey } from "../actions/tvet.mutate"

type Props = {
  sessionId: string
}

export function TvetSurveyForm({ sessionId }: Props) {
  const t = useTranslations("TvetSurvey")
  const router = useRouter()
  const survey = useSubmitSurvey(sessionId)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)

  return (
    <form
      className="grid max-w-xl gap-6 text-sm"
      onSubmit={(event) => {
        event.preventDefault()
        if (rating < 1) {
          setValidationError(t("ratingRequired"))
          return
        }

        setValidationError(null)
        survey.mutate(
          { rating, feedback: feedback.trim() || undefined },
          {
            onSuccess: () => {
              router.push(`/seeker/tvet/${sessionId}/certificate`)
            },
          }
        )
      }}
    >
      <fieldset className="grid gap-2">
        <legend className="font-medium">{t("rating")}</legend>
        <p className="text-muted-foreground">{t("ratingHint")}</p>
        <div className="flex gap-1" role="radiogroup" aria-label={t("rating")}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={t("starLabel", { value })}
              className="rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={() => {
                setRating(value)
                setValidationError(null)
              }}
            >
              <Star
                className={
                  value <= rating
                    ? "size-8 fill-amber-400 text-amber-500"
                    : "size-8 text-muted-foreground"
                }
              />
            </button>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-2">
        <span className="font-medium">{t("feedback")}</span>
        <textarea
          className="min-h-32 rounded-md border border-input bg-background px-3 py-2"
          maxLength={4000}
          placeholder={t("feedbackPlaceholder")}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
        <span className="text-xs text-muted-foreground">
          {t("characters", { count: feedback.length })}
        </span>
      </label>

      {validationError ? (
        <p className="text-destructive">{validationError}</p>
      ) : null}
      {survey.isError ? (
        <p className="text-destructive">
          {tvetErrorMessage(survey.error, t("error"))}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={survey.isPending}>
          {survey.isPending ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  )
}
