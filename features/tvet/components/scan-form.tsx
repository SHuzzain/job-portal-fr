"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useCallback, useRef, useState } from "react"
import { NavButton } from "@/components/nav-button"
import { Button } from "@/components/ui/button"
import { tvetErrorMessage, useScanSession } from "../actions/tvet.mutate"
import { myAttendanceQueryOptions } from "../queries/options"
import { CameraScanner } from "./camera-scanner"

type ScanMode = "camera" | "manual"

function provideScanFeedback() {
  if (navigator.vibrate) navigator.vibrate(120)

  try {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.frequency.value = 880
    gain.gain.setValueAtTime(0.12, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.1
    )
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.addEventListener("ended", () => void audioContext.close())

    void audioContext
      .resume()
      .then(() => {
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.1)
      })
      .catch(() => void audioContext.close())
  } catch {
    // Audio feedback is optional and can be blocked by browser policy.
  }
}

export function ScanForm() {
  const t = useTranslations("TvetScan")
  const scan = useScanSession()
  const { mutate, reset } = scan
  const attendance = useQuery(myAttendanceQueryOptions())
  const [barcode, setBarcode] = useState("")
  const [mode, setMode] = useState<ScanMode>("camera")
  const [cameraUnavailable, setCameraUnavailable] = useState(false)
  const [cameraNotice, setCameraNotice] = useState<
    "detected" | "invalid" | null
  >(null)
  const [cameraRun, setCameraRun] = useState(0)
  const detectedBarcodeRef = useRef<string | null>(null)
  const submittingRef = useRef(false)

  const submitAttendance = useCallback(
    (value: string) => {
      if (submittingRef.current) return

      const trimmedBarcode = value.trim()
      if (!trimmedBarcode) return

      submittingRef.current = true
      mutate(
        { barcode: trimmedBarcode },
        {
          onSuccess: () => setBarcode(""),
          onSettled: () => {
            submittingRef.current = false
          },
        }
      )
    },
    [mutate]
  )

  const handleCameraUnavailable = useCallback(() => {
    setCameraUnavailable(true)
    setCameraNotice(null)
    setMode("manual")
  }, [])

  const handleInvalidScan = useCallback(() => {
    setCameraNotice("invalid")
  }, [])

  const handleDetected = useCallback(
    (detectedBarcode: string) => {
      if (
        submittingRef.current ||
        detectedBarcodeRef.current === detectedBarcode
      ) {
        return
      }

      detectedBarcodeRef.current = detectedBarcode
      setCameraNotice("detected")
      provideScanFeedback()
      submitAttendance(detectedBarcode)
    },
    [submitAttendance]
  )

  return (
    <div className="grid gap-6 text-sm">
      <div
        className="grid max-w-md grid-cols-2 rounded-lg bg-muted p-1"
        role="tablist"
        aria-label={t("method")}
      >
        <Button
          type="button"
          variant={mode === "camera" ? "default" : "ghost"}
          role="tab"
          aria-selected={mode === "camera"}
          aria-controls="camera-scan-panel"
          disabled={cameraUnavailable}
          onClick={() => {
            setCameraNotice(null)
            setMode("camera")
          }}
        >
          {t("cameraTab")}
        </Button>
        <Button
          type="button"
          variant={mode === "manual" ? "default" : "ghost"}
          role="tab"
          aria-selected={mode === "manual"}
          aria-controls="manual-scan-panel"
          onClick={() => setMode("manual")}
        >
          {t("manualTab")}
        </Button>
      </div>

      {mode === "camera" ? (
        <section
          id="camera-scan-panel"
          role="tabpanel"
          className="grid max-w-md gap-3"
        >
          <CameraScanner
            key={cameraRun}
            onDetected={handleDetected}
            onInvalid={handleInvalidScan}
            onUnavailable={handleCameraUnavailable}
            initializingLabel={t("cameraStarting")}
            instructionsLabel={t("cameraHint")}
          />
          {cameraNotice ? (
            <p
              className={
                cameraNotice === "detected"
                  ? "text-foreground"
                  : "text-destructive"
              }
              aria-live="polite"
            >
              {t(
                cameraNotice === "detected"
                  ? "cameraDetected"
                  : "invalidCameraCode"
              )}
            </p>
          ) : null}
          {scan.isError && detectedBarcodeRef.current ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                detectedBarcodeRef.current = null
                setCameraNotice(null)
                reset()
                setCameraRun((run) => run + 1)
              }}
            >
              {t("retryCamera")}
            </Button>
          ) : null}
        </section>
      ) : (
        <form
          id="manual-scan-panel"
          role="tabpanel"
          className="grid max-w-md gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            submitAttendance(barcode)
          }}
        >
          {cameraUnavailable ? (
            <p className="rounded-md border border-border bg-muted p-3">
              {t("cameraUnavailable")}
            </p>
          ) : (
            <p className="text-muted-foreground">{t("manualHint")}</p>
          )}
          <label className="grid gap-1">
            <span>{t("barcode")}</span>
            <input
              required
              className="rounded-md border border-input bg-background px-2 py-1.5 font-mono"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
            />
          </label>
          <Button type="submit" disabled={scan.isPending}>
            {scan.isPending ? t("saving") : t("submit")}
          </Button>
        </form>
      )}

      {scan.isError ? (
        <p className="max-w-md text-destructive">
          {tvetErrorMessage(scan.error, t("error"))}
        </p>
      ) : null}
      {scan.isSuccess ? (
        <div className="grid max-w-md gap-3 rounded-md border border-border p-4">
          <div>
            <p className="font-medium">{t("success")}</p>
            <p className="mt-1 text-muted-foreground">
              {scan.data.sessionTitle}
            </p>
          </div>
          <div>
            <NavButton href={`/seeker/tvet/${scan.data.sessionId}/survey`}>
              {t("proceedSurvey")}
            </NavButton>
          </div>
        </div>
      ) : null}

      <div className="grid gap-2">
        <h2 className="font-medium">{t("mine")}</h2>
        {attendance.isPending ? (
          <p className="text-muted-foreground">…</p>
        ) : !attendance.data?.length ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="grid gap-2">
            {attendance.data.map((row) => (
              <li
                key={row.id}
                className="grid gap-3 rounded-md border border-border p-3"
              >
                <div>
                  <p className="font-medium">{row.sessionTitle}</p>
                  <p className="text-muted-foreground">
                    {new Date(row.attendanceRecordedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <NavButton
                    href={
                      row.surveyCompletedAt
                        ? `/seeker/tvet/${row.sessionId}/certificate`
                        : `/seeker/tvet/${row.sessionId}/survey`
                    }
                    variant="outline"
                    size="sm"
                  >
                    {row.surveyCompletedAt
                      ? t("viewCertificate")
                      : t("takeSurvey")}
                  </NavButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
