"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { useReviewCompany, useSetCompanyStatus } from "../actions/pasak.mutate";
import { pendingCompaniesQueryOptions } from "../queries/options";
import { ReviewCommentsModal } from "./review-comments-modal";

export function CompanyQueue() {
  const t = useTranslations("Pasak");
  const setStatus = useSetCompanyStatus();
  const review = useReviewCompany();
  const [returnId, setReturnId] = useState<string | null>(null);
  const [comments, setComments] = useState("");
  const { data, isPending, isError } = useQuery(pendingCompaniesQueryOptions());

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (isError || !data?.length) {
    return (
      <p className="text-sm text-muted-foreground">{t("companiesEmpty")}</p>
    );
  }

  const busy = setStatus.isPending || review.isPending;

  return (
    <div className="grid gap-3">
      {data.map((company) => (
        <article
          key={company.id}
          className="grid gap-2 rounded-lg border border-border p-4 text-sm"
        >
          <h2 className="font-medium">{company.name}</h2>
          <p>{company.ssmNumber}</p>
          {company.ssmDocumentUrl ? (
            <a
              className="underline"
              href={company.ssmDocumentUrl}
              target="_blank"
              rel="noreferrer"
            >
              {t("ssmLink")}
            </a>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                setStatus.mutate({ id: company.id, status: "APPROVED" })
              }
            >
              {t("approve")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() =>
                setStatus.mutate({ id: company.id, status: "REJECTED" })
              }
            >
              {t("reject")}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => {
                setComments("");
                setReturnId(company.id);
              }}
            >
              {t("returnForCorrection")}
            </Button>
          </div>
        </article>
      ))}
      <ReviewCommentsModal
        open={returnId !== null}
        title={t("returnForCorrection")}
        comments={comments}
        commentsLabel={t("comments")}
        commentsPlaceholder={t("commentsPlaceholder")}
        requiredHint={t("commentsRequired")}
        confirmLabel={t("submitReturn")}
        cancelLabel={t("cancel")}
        pending={review.isPending}
        onCommentsChange={setComments}
        onCancel={() => setReturnId(null)}
        onConfirm={() => {
          if (!returnId || !comments.trim()) {
            return;
          }
          review.mutate(
            {
              id: returnId,
              action: "RETURN_FOR_CORRECTION",
              comments: comments.trim(),
            },
            { onSuccess: () => setReturnId(null) }
          );
        }}
      />
    </div>
  );
}
