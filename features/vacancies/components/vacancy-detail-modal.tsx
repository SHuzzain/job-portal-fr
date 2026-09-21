"use client";

import React, { useEffect } from "react";

import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";

import type { Vacancy } from "../schema";

type VacancyDetailModalProps = {
  vacancy: Vacancy;
  workspaceSlug?: string;
};

export function VacancyDetailModal({
  vacancy,
  workspaceSlug,
}: VacancyDetailModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200 fade-in"
      onClick={() => router.back()}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl animate-in flex-col rounded-2xl border border-border bg-background p-6 shadow-2xl duration-200 zoom-in-95"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {vacancy.status ?? "ACTIVE"}
            </span>
            <h2 className="mt-2 text-xl font-bold text-foreground">
              {vacancy.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {vacancy.location} · {vacancy.employmentType}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 text-sm leading-relaxed text-foreground">
          <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Job Description
          </h3>
          <p className="text-sm whitespace-pre-line text-foreground/90">
            {vacancy.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          {workspaceSlug ? (
            <Link
              href={`/employer/${workspaceSlug}/jobs/${vacancy.id}/edit`}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
            >
              ✏️ Edit Vacancy
            </Link>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow transition hover:bg-primary/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
