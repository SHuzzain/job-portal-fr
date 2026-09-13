import { apiClient } from "@/connector/client"
import type { TvetAttendance, TvetRfp, TvetSession, TvetSessionDetail } from "../schema"

export function listRfps() {
  return apiClient<TvetRfp[]>("/tvet/rfps")
}

export function listSessions(rfpId?: string) {
  const query = rfpId ? `?rfpId=${encodeURIComponent(rfpId)}` : ""
  return apiClient<TvetSession[]>(`/tvet/sessions${query}`)
}

export function getSession(id: string) {
  return apiClient<TvetSessionDetail>(`/tvet/sessions/${id}`)
}

export function listMyAttendance() {
  return apiClient<TvetAttendance[]>("/tvet/attendance/mine")
}
