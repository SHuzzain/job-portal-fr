"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { authClient } from "@/connector";
import {
  type PermissionMap,
  countPermissions,
} from "@/connector/access/catalog";
import { RESERVED_ORG_ROLES } from "@/connector/access/organization";
import { useRouter } from "@/i18n/navigation";

import { roleNameSchema } from "../schema";
import { PermissionMatrix } from "./permission-matrix";

function toRoleName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^_+/, "")
    .slice(0, 40);
}

export function OrgRoleForm() {
  const t = useTranslations("Access");
  const router = useRouter();
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<PermissionMap>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid gap-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);

        const parsed = roleNameSchema.safeParse(name);
        if (!parsed.success) {
          setError(parsed.error.issues[0]?.message ?? t("invalidRole"));
          return;
        }
        if ((RESERVED_ORG_ROLES as readonly string[]).includes(parsed.data)) {
          setError(t("invalidRole"));
          return;
        }
        if (countPermissions(permissions) === 0) {
          setError(t("needPermission"));
          return;
        }

        setPending(true);
        const result = await authClient.organization.createRole({
          role: parsed.data,
          permission: permissions,
        });
        setPending(false);

        if (result.error) {
          setError(result.error.message ?? t("createRoleError"));
          return;
        }
        router.push("/employer/access");
      }}
    >
      <label className="grid max-w-md gap-1 text-sm">
        <span>{t("roleName")}</span>
        <input
          required
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={name}
          placeholder="hr"
          onChange={(event) => setName(toRoleName(event.target.value))}
        />
        <span className="text-xs text-muted-foreground">
          {t("roleNameHint")}
        </span>
      </label>

      <PermissionMatrix
        scope="organization"
        value={permissions}
        onChange={setPermissions}
      />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("createRole")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t("permissionCount", { count: countPermissions(permissions) })}
        </span>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
