"use client";

import { useEffect, useId, useRef, useState } from "react";

const ATTENDANCE_CODE_PATTERN = /^TP-[A-F0-9]{12}$/;

type CameraScannerProps = {
  onDetected: (barcode: string) => void;
  onInvalid: () => void;
  onUnavailable: () => void;
  initializingLabel: string;
  instructionsLabel: string;
};

export function CameraScanner({
  onDetected,
  onInvalid,
  onUnavailable,
  initializingLabel,
  instructionsLabel,
}: CameraScannerProps) {
  const scannerId = `tvet-camera-${useId().replaceAll(":", "")}`;
  const detectedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let scanner: import("html5-qrcode").Html5Qrcode | null = null;

    async function stopAndClear() {
      if (!scanner) return;

      try {
        await scanner.stop();
      } catch {
        // The scanner may not have finished starting.
      }

      try {
        scanner.clear();
      } catch {
        // The element may already have been removed during unmount.
      }
    }

    async function startScanner() {
      if (!navigator.mediaDevices?.getUserMedia) {
        onUnavailable();
        return;
      }

      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;

        scanner = new Html5Qrcode(scannerId, false);
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (detectedRef.current) return;

            const barcode = decodedText.trim();
            if (!ATTENDANCE_CODE_PATTERN.test(barcode)) {
              onInvalid();
              return;
            }

            detectedRef.current = true;
            void stopAndClear().finally(() => {
              if (!cancelled) onDetected(barcode);
            });
          },
          () => {
            // Decode misses are expected while the camera is moving.
          }
        );

        if (cancelled) {
          await stopAndClear();
          return;
        }

        setIsReady(true);
      } catch {
        if (!cancelled) onUnavailable();
        await stopAndClear();
      }
    }

    void startScanner();

    return () => {
      cancelled = true;
      detectedRef.current = true;
      void stopAndClear();
    };
  }, [onDetected, onInvalid, onUnavailable, scannerId]);

  return (
    <div className="grid gap-3">
      <div
        id={scannerId}
        className="min-h-64 overflow-hidden rounded-md border border-border bg-muted"
      />
      <p className="text-muted-foreground" aria-live="polite">
        {isReady ? instructionsLabel : initializingLabel}
      </p>
    </div>
  );
}
