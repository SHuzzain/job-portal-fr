"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import {
  useSubmitClaim,
  useUploadSignedClaim,
} from "../actions/tvet-claims.mutate";
import { downloadClaimDocument } from "../actions/tvet-claims.query.client";
import {
  eligibleCoursesQueryOptions,
  providerClaimsQueryOptions,
} from "../queries/options";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ProviderClaims() {
  const t = useTranslations("TvetClaims");
  const claims = useQuery(providerClaimsQueryOptions());
  const eligible = useQuery(eligibleCoursesQueryOptions());
  const submit = useSubmitClaim();
  const upload = useUploadSignedClaim();
  const [courseId, setCourseId] = useState("");
  const [amount, setAmount] = useState("");
  const [claimUrl, setClaimUrl] = useState("");
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [downloadError, setDownloadError] = useState("");

  async function download(path: string, filename: string) {
    setDownloadError("");
    try {
      saveBlob(await downloadClaimDocument(path), filename);
    } catch {
      setDownloadError(t("downloadError"));
    }
  }

  return (
    <div className="grid gap-6">
      <form
        className="grid gap-3 rounded-lg border border-border p-4"
        onSubmit={(event) => {
          event.preventDefault();
          submit.mutate(
            {
              courseId,
              claimAmount: amount,
              borangTuntutanUrl: claimUrl,
            },
            {
              onSuccess: () => {
                setCourseId("");
                setAmount("");
                setClaimUrl("");
              },
            }
          );
        }}
      >
        <h2 className="font-medium">{t("submitTitle")}</h2>
        <label className="grid gap-1 text-sm">
          <span>{t("course")}</span>
          <select
            className="h-9 rounded-lg border border-border bg-background px-3"
            value={courseId}
            required
            onChange={(event) => setCourseId(event.target.value)}
          >
            <option value="">{t("selectCourse")}</option>
            {eligible.data?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} ({new Date(course.endsAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </label>
        {!eligible.isPending && !eligible.data?.length ? (
          <p className="text-sm text-muted-foreground">{t("noEligible")}</p>
        ) : null}
        <label className="grid gap-1 text-sm">
          <span>{t("amount")}</span>
          <input
            className="h-9 rounded-lg border border-border bg-background px-3"
            inputMode="decimal"
            placeholder="0.00"
            pattern="(?:0|[1-9]\d{0,9})\.\d{2}"
            value={amount}
            required
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span>{t("claimFormUrl")}</span>
          <input
            className="h-9 rounded-lg border border-border bg-background px-3"
            type="url"
            value={claimUrl}
            required
            onChange={(event) => setClaimUrl(event.target.value)}
          />
        </label>
        <p className="text-xs text-muted-foreground">{t("urlFallback")}</p>
        <Button
          type="submit"
          disabled={submit.isPending || !eligible.data?.length}
        >
          {submit.isPending ? t("submitting") : t("submit")}
        </Button>
        {submit.isError ? (
          <p className="text-sm text-destructive">{t("submitError")}</p>
        ) : null}
      </form>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("listTitle")}</h2>
        {claims.isPending ? (
          <p className="text-sm text-muted-foreground">…</p>
        ) : !claims.data?.length ? (
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        ) : (
          claims.data.map((claim) => (
            <article
              key={claim.id}
              className="grid gap-2 rounded-lg border border-border p-4 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium">{claim.courseTitle}</h3>
                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                  {t(`statuses.${claim.status}`)}
                </span>
              </div>
              <p>{t("amountValue", { amount: claim.claimAmount })}</p>
              {claim.reviewNotes ? (
                <p className="text-destructive">{claim.reviewNotes}</p>
              ) : null}
              {claim.status === "FINANCE_APPROVED" ? (
                <div className="grid gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        download(
                          claim.paymentVoucherDownloadUrl,
                          `payment-voucher-${claim.id}.pdf`
                        )
                      }
                    >
                      {t("downloadVoucher")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        download(
                          claim.borangAkuanDownloadUrl,
                          `borang-akuan-terima-${claim.id}.pdf`
                        )
                      }
                    >
                      {t("downloadAcknowledgement")}
                    </Button>
                  </div>
                  <label className="grid gap-1">
                    <span>{t("signedUrl")}</span>
                    <input
                      className="h-9 rounded-lg border border-border bg-background px-3"
                      type="url"
                      value={signedUrls[claim.id] ?? ""}
                      onChange={(event) =>
                        setSignedUrls((current) => ({
                          ...current,
                          [claim.id]: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {t("signedUrlFallback")}
                  </p>
                  <Button
                    size="sm"
                    disabled={
                      upload.isPending || !(signedUrls[claim.id] ?? "").trim()
                    }
                    onClick={() =>
                      upload.mutate({
                        id: claim.id,
                        signedBorangAkuanUrl: signedUrls[claim.id]!.trim(),
                      })
                    }
                  >
                    {t("uploadSigned")}
                  </Button>
                </div>
              ) : null}
            </article>
          ))
        )}
        {downloadError ? (
          <p className="text-sm text-destructive">{downloadError}</p>
        ) : null}
      </section>
    </div>
  );
}
