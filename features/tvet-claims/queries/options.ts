import { queryOptions } from "@tanstack/react-query"
import {
  listEligibleCourses,
  listPasakClaims,
  listProviderClaims,
} from "../actions/tvet-claims.query.client"
import { tvetClaimKeys } from "./keys"

export function providerClaimsQueryOptions() {
  return queryOptions({
    queryKey: tvetClaimKeys.provider(),
    queryFn: listProviderClaims,
  })
}

export function eligibleCoursesQueryOptions() {
  return queryOptions({
    queryKey: tvetClaimKeys.eligible(),
    queryFn: listEligibleCourses,
  })
}

export function pasakClaimsQueryOptions() {
  return queryOptions({
    queryKey: tvetClaimKeys.pasak(),
    queryFn: listPasakClaims,
  })
}
