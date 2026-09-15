"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import {
  useFinalizeClaim,
  useReviewClaim,
} from "../actions/tvet-claims.mutate";
import { pasakClaimsQueryOptions } from "../queries/options";

export function PasakClaims() {
  const t = useTranslations("TvetClaims");
  const claims = useQuery(pasakClaimsQueryOptions());
  const review = useReviewClaim();
  const finalize = useFinalizeClaim();
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});
  const busy = review.isPending || finalize.isPending;

  if (claims.isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (!claims.data?.length) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="grid gap-3">
      {claims.data.map((claim) => (
        <article
          key={claim.id}
          className="grid gap-2 rounded-lg border border-border p-4 text-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-medium">{claim.courseTitle}</h2>
            <span className="rounded-full bg-muted px-2 py-1 text-xs">
              {t(`statuses.${claim.status}`)}
            </span>
          </div>
          <p>{claim.providerName}</p>
          <p>{t("amountValue", { amount: claim.claimAmount })}</p>
          <a
            className="underline"
            href={claim.borangTuntutanUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t("openClaimForm")}
          </a>
          {claim.signedBorangAkuanUrl ? (
            <a
              className="underline"
              href={claim.signedBorangAkuanUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t("openSignedAcknowledgement")}
            </a>
          ) : null}
          {claim.status === "SUBMITTED" ? (
            <div className="grid gap-2">
              <label className="grid gap-1">
                <span>{t("rejectionReason")}</span>
                <input
                  className="h-9 rounded-lg border border-border bg-background px-3"
                  value={rejectNotes[claim.id] ?? ""}
                  onChange={(event) =>
                    setRejectNotes((current) => ({
                      ...current,
                      [claim.id]: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  disabled={busy}
                  onClick={() =>
                    review.mutate({ id: claim.id, action: "APPROVE" })
                  }
                >
                  {t("approve")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy || !(rejectNotes[claim.id] ?? "").trim()}
                  onClick={() =>
                    review.mutate({
                      id: claim.id,
                      action: "REJECT",
                      comments: rejectNotes[claim.id]!.trim(),
                    })
                  }
                >
                  {t("reject")}
                </Button>
              </div>
            </div>
          ) : null}
          {claim.status === "SIGNED_DOC_SUBMITTED" ? (
            <Button
              size="sm"
              disabled={busy}
              onClick={() => finalize.mutate(claim.id)}
            >
              {t("finalizePayment")}
            </Button>
          ) : null}
          {review.isError || finalize.isError ? (
            <p className="text-destructive">{t("reviewError")}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
