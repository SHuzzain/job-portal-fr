import { apiClient, apiClientBlob } from "@/connector/client"
import type { EligibleTvetCourse, TvetClaim } from "../schema"

export function listProviderClaims() {
  return apiClient<TvetClaim[]>("/tvet/claims")
}

export function listEligibleCourses() {
  return apiClient<EligibleTvetCourse[]>("/tvet/claims/eligible-courses")
}

export function listPasakClaims() {
  return apiClient<TvetClaim[]>("/pasak/claims")
}

export function downloadClaimDocument(path: string) {
  return apiClientBlob(path)
}
