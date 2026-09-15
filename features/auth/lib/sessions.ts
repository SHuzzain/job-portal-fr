export const MAX_DEVICE_ACCOUNTS = 5;

export type DeviceKind = "laptop" | "phone" | "tablet";

export type DeviceAccount = {
  sessionToken: string;
  userId: string;
  email: string;
  name: string;
  role?: string;
  isActive: boolean;
};

export type UserSession = {
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  expiresAt: Date;
  isCurrent: boolean;
  device: DeviceKind;
};

export function portalHomeForRole(
  role?: string | null,
  workspace?: string | null
) {
  if (role === "employer") {
    return workspace === "training_provider" ? "/employer/tvet" : "/employer";
  }

  if (role === "admin" || role === "super_admin") {
    return "/pasak";
  }

  if (role === "jobseeker") {
    return "/seeker";
  }

  return "/";
}

export function deviceKindFromUserAgent(userAgent?: string | null): DeviceKind {
  const ua = userAgent ?? "";

  if (/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    return "tablet";
  }

  if (/Mobile|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "phone";
  }

  return "laptop";
}

export function roleLabel(role?: string | null) {
  return role?.trim() ? role.replaceAll("_", " ") : undefined;
}
