"use client";

import { Button } from "@/components/ui/button";

export function ReviewCommentsModal({
  open,
  title,
  comments,
  commentsLabel,
  commentsPlaceholder,
  requiredHint,
  confirmLabel,
  cancelLabel,
  pending,
  onCommentsChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  comments: string;
  commentsLabel: string;
  commentsPlaceholder: string;
  requiredHint: string;
  confirmLabel: string;
  cancelLabel: string;
  pending: boolean;
  onCommentsChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="grid w-full max-w-md gap-3 rounded-lg border border-border bg-background p-4 shadow-lg"
      >
        <h2 className="font-medium">{title}</h2>
        <label className="grid gap-1 text-sm">
          <span>{commentsLabel}</span>
          <textarea
            required
            className="min-h-28 rounded-md border border-input bg-background px-2 py-1.5"
            value={comments}
            placeholder={commentsPlaceholder}
            onChange={(event) => onCommentsChange(event.target.value)}
          />
        </label>
        {!comments.trim() ? (
          <p className="text-sm text-destructive">{requiredHint}</p>
        ) : null}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            disabled={pending || !comments.trim()}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
