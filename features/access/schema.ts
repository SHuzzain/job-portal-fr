import { z } from "zod";

import { RESOURCES } from "@/connector/access/catalog";

export const permissionMapSchema = z.record(z.string(), z.array(z.string()));

export const platformRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  permissions: permissionMapSchema,
  isSystem: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const platformUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string().nullable(),
  accountStatus: z.string().nullable(),
  hasTvetCapability: z.boolean().nullable(),
  banned: z.boolean().nullable(),
  createdAt: z.string(),
});

export const roleNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(40)
  .regex(/^[a-z][a-z0-9_]*$/, "Use lowercase letters, digits and underscores");

export const platformRoleFormSchema = z.object({
  name: roleNameSchema,
  label: z.string().trim().min(2).max(80),
  permissions: permissionMapSchema.refine(
    (value) => Object.keys(value).length > 0,
    "Select at least one permission"
  ),
});

export const platformUserFormSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: roleNameSchema,
});

export type PermissionMapValue = z.infer<typeof permissionMapSchema>;
export type PlatformRole = z.infer<typeof platformRoleSchema>;
export type PlatformUser = z.infer<typeof platformUserSchema>;
export type PlatformRoleForm = z.infer<typeof platformRoleFormSchema>;
export type PlatformUserForm = z.infer<typeof platformUserFormSchema>;

export type ResourceName = keyof typeof RESOURCES;

/** Turns "tvet_rfp" into a slug usable as an i18n key. */
export function resourceKey(resource: string) {
  return resource as ResourceName;
}
