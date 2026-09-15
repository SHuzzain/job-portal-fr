import { apiClient } from "@/connector/client";

import type { SeekerProfile } from "../schema";

export function getMyProfile() {
  return apiClient<SeekerProfile>("/seeker-profiles/me");
}
