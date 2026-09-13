import { queryOptions } from "@tanstack/react-query"
import { getSession, listMyAttendance, listRfps, listSessions } from "../actions/tvet.query.client"
import { tvetKeys } from "./keys"

export function rfpsQueryOptions() {
  return queryOptions({
    queryKey: tvetKeys.rfps(),
    queryFn: listRfps,
  })
}

export function sessionsQueryOptions(rfpId?: string) {
  return queryOptions({
    queryKey: tvetKeys.sessions(rfpId),
    queryFn: () => listSessions(rfpId),
  })
}

export function sessionQueryOptions(id: string) {
  return queryOptions({
    queryKey: tvetKeys.session(id),
    queryFn: () => getSession(id),
  })
}

export function myAttendanceQueryOptions() {
  return queryOptions({
    queryKey: tvetKeys.attendance(),
    queryFn: listMyAttendance,
  })
}
