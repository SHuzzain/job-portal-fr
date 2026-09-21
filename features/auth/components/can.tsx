"use client";

import React from "react";

import { usePermission } from "../hooks/use-permission";

type CanProps = {
  resource: string;
  action?: string;
  fallback?: React.ReactNode;
  children:
    | React.ReactNode
    | ((props: { allowed: boolean; isPending: boolean }) => React.ReactNode);
};

/**
 * Granular authorization component for conditional UI rendering (e.g. action buttons, sections).
 * When `isPending` is true, renders the provided `fallback` (e.g. Skeleton or loader) to support smooth streaming.
 */
export function Can({
  resource,
  action = "view",
  fallback = null,
  children,
}: CanProps) {
  const { allowed, isPending } = usePermission(resource, action);

  if (typeof children === "function") {
    return <>{children({ allowed, isPending })}</>;
  }

  if (isPending) {
    return <>{fallback}</>;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
