import { apiClient } from "@/connector/client";

import type { Resume } from "../schema";

export function listMyResumes() {
  return apiClient<Resume[]>("/resumes");
}
